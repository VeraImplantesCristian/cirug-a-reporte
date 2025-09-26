// src/stores/formStore.js

import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { supabase } from '../supabase'

import { useClientesStore } from './clientesStore'
import { useMaterialesStore } from './materialesStore'
import { useTiposCirugiaStore } from './tiposCirugiaStore'

const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const todayLocal = new Date(today.getTime() - (offset * 60 * 1000));
  return todayLocal.toISOString().split('T')[0];
}

export const useFormStore = defineStore('form', () => {
  const formState = reactive({
    mensaje_inicio: 'Estimados, Adjunto detalles de la cirugía programada:',
    cliente: null,
    paciente: '',
    medico: '',
    instrumentador: '',
    lugar_cirugia: '',
    fecha_cirugia: '',
    tipo_cirugia: null,
    material: '',
    observaciones: '',
    info_adicional: '',
    fecha_envio: null,
    email_cliente: null,
  })

  const sugerencias = reactive({
    medicos: [],
    instrumentadores: [],
    lugaresCirugia: []
  })

  const validationErrors = reactive({
    cliente: null,
    paciente: null,
    medico: null,
    fecha_cirugia: null
  })

  const validateField = (field) => {
    if (formState[field] === null || (typeof formState[field] === 'string' && formState[field].trim() === '')) {
      validationErrors[field] = `El campo ${field.replace('_', ' ')} es requerido.`
    } else {
      validationErrors[field] = null
    }
  }

  const validateForm = () => {
    validateField('cliente')
    validateField('paciente')
    validateField('medico')
    validateField('fecha_cirugia')
    return Object.values(validationErrors).every(error => error === null)
  }

  const saveSugerencia = async (campo, valor) => {
    if (!valor || valor.trim() === '') {
      console.log(`saveSugerencia: No se guarda sugerencia para ${campo} porque está vacía.`);
      return;
    }
    const valorLimpio = valor.trim()
    try {
      const { error } = await supabase
        .from('sugerencias')
        .upsert(
          { campo: campo, valor: valorLimpio },
          { onConflict: 'campo, valor', ignoreDuplicates: true }
        );
      if (error) {
        console.error(`saveSugerencia: Error guardando sugerencia para ${campo} con valor "${valorLimpio}":`, error);
      } else {
        console.log(`saveSugerencia: Sugerencia para ${campo} con valor "${valorLimpio}" guardada/ignorada exitosamente.`);
        // Después de guardar, si es nueva, la añadimos al estado local para que se vea reflejada.
        if (campo === 'medico' && !sugerencias.medicos.includes(valorLimpio)) sugerencias.medicos.push(valorLimpio);
        if (campo === 'instrumentador' && !sugerencias.instrumentadores.includes(valorLimpio)) sugerencias.instrumentadores.push(valorLimpio);
        if (campo === 'lugar_cirugia' && !sugerencias.lugaresCirugia.includes(valorLimpio)) sugerencias.lugaresCirugia.push(valorLimpio);
      }
    } catch (error) {
      console.error(`saveSugerencia: Error inesperado al guardar sugerencia para ${campo} con valor "${valorLimpio}":`, error);
    }
  }

  const initializeForm = async () => {
    const clientesStore = useClientesStore()
    const materialesStore = useMaterialesStore()
    const tiposCirugiaStore = useTiposCirugiaStore()

    await clientesStore.fetchAllClients()
    await materialesStore.fetchMateriales()
    await tiposCirugiaStore.fetchTiposCirugia()

    try {
      console.log('initializeForm: Intentando cargar sugerencias de Supabase...');
      const { data, error } = await supabase.from('sugerencias').select('campo, valor')
      if (error) throw error

      console.log('initializeForm: Sugerencias recibidas de Supabase:', data);

      sugerencias.medicos = []
      sugerencias.instrumentadores = []
      sugerencias.lugaresCirugia = []

      data.forEach(item => {
        if (item.campo === 'medico') sugerencias.medicos.push(item.valor)
        else if (item.campo === 'instrumentador') sugerencias.instrumentadores.push(item.valor)
        else if (item.campo === 'lugar_cirugia') sugerencias.lugaresCirugia.push(item.valor)
      })
      console.log('initializeForm: Sugerencias pobladas en el store:', sugerencias);

    } catch (error) {
      console.error('initializeForm: Error al cargar las sugerencias:', error.message)
    }
    console.log('formStore initializeForm: Clientes cargados para el formulario (ALL):', clientesStore.allClients);
  }

  const saveReport = async () => {
    try {
      formState.fecha_envio = getTodayDateString();
      
      const reportDataToSave = { ...formState };
      delete reportDataToSave.email_cliente;

      const { data, error } = await supabase.from('reportes').insert([reportDataToSave]).select()
      if (error) throw error

      console.log('saveReport: Reporte guardado con éxito en Supabase:', data);
      
      await Promise.all([
        saveSugerencia('medico', formState.medico),
        saveSugerencia('instrumentador', formState.instrumentador),
        saveSugerencia('lugar_cirugia', formState.lugar_cirugia)
      ])
      return true
    } catch (error) {
      console.error('saveReport: Error al guardar el reporte:', error.message)
      return false
    }
  }

  const loadLastReport = async () => {
    try {
      const { data, error } = await supabase
        .from('reportes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      if (data) {
        console.log('loadLastReport: Último reporte cargado:', data);
        formState.mensaje_inicio = data.mensaje_inicio || 'Estimados, Adjunto detalles de la cirugía programada:'
        formState.cliente = data.cliente
        formState.paciente = data.paciente
        formState.medico = data.medico
        formState.instrumentador = data.instrumentador
        formState.lugar_cirugia = data.lugar_cirugia
        formState.fecha_cirugia = data.fecha_cirugia
        formState.tipo_cirugia = data.tipo_cirugia
        formState.material = data.material
        formState.observaciones = data.observaciones
        formState.info_adicional = data.info_adicional
        formState.fecha_envio = data.fecha_envio
      } else {
        console.log('loadLastReport: No se encontraron reportes anteriores.');
      }
    } catch (error) {
      console.error('loadLastReport: Error al cargar el último reporte:', error.message)
    }
  }

  const loadLastMaterial = async () => {
    try {
      const { data, error } = await supabase
        .from('reportes')
        .select('material')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (error) throw error
      if (data && data.material) {
        console.log('loadLastMaterial: Material del último reporte cargado:', data.material);
        const valorActual = formState.material.trim()
        formState.material = valorActual 
          ? `${valorActual}\n${data.material}`
          : data.material
      } else {
        console.log('loadLastMaterial: No se encontró material en el último reporte.');
      }
    } catch (error) {
      console.error('loadLastMaterial: Error al cargar el último material:', error.message)
    }
  }

  const resetForm = () => {
    console.log('resetForm: Limpiando formulario...');
    formState.mensaje_inicio = 'Estimados, Adjunto detalles de la cirugía programada:'
    formState.cliente = null
    formState.paciente = ''
    formState.medico = ''
    formState.instrumentador = ''
    formState.lugar_cirugia = ''
    formState.fecha_cirugia = ''
    formState.tipo_cirugia = null
    formState.material = ''
    formState.observaciones = ''
    formState.info_adicional = ''
    formState.fecha_envio = null
    formState.email_cliente = null;

    Object.keys(validationErrors).forEach(key => {
      validationErrors[key] = null
    })
  }

  return {
    formState,
    sugerencias,
    validationErrors,
    initializeForm,
    saveReport,
    resetForm,
    loadLastReport,
    loadLastMaterial,
    validateField,
    validateForm
  }
})