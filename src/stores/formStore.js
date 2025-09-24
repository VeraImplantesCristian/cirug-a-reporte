// src/stores/formStore.js

import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { supabase } from '../supabase'
import { useClientesStore } from './clientesStore'
import { useMaterialesStore } from './materialesStore'
import { useTiposCirugiaStore } from './tiposCirugiaStore'

// Función auxiliar para obtener la fecha de hoy en formato YYYY-MM-DD
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
    fecha_envio: null
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
    if (!valor || valor.trim() === '') return
    const valorLimpio = valor.trim()
    const { error } = await supabase
      .from('sugerencias')
      .upsert(
        { campo: campo, valor: valorLimpio },
        { onConflict: 'campo, valor', ignoreDuplicates: true }
      )
    if (error) console.error(`Error guardando sugerencia para ${campo}:`, error)
  }

  const initializeForm = async () => {
    useClientesStore().fetchClientes()
    useMaterialesStore().fetchMateriales()
    useTiposCirugiaStore().fetchTiposCirugia()
    try {
      const { data, error } = await supabase.from('sugerencias').select('campo, valor')
      if (error) throw error
      sugerencias.medicos = []
      sugerencias.instrumentadores = []
      sugerencias.lugaresCirugia = []
      data.forEach(item => {
        if (item.campo === 'medico') sugerencias.medicos.push(item.valor)
        if (item.campo === 'instrumentador') sugerencias.instrumentadores.push(item.valor)
        if (item.campo === 'lugar_cirugia') sugerencias.lugaresCirugia.push(item.valor)
      })
    } catch (error) {
      console.error('Error al cargar las sugerencias:', error.message)
    }
  }

  const saveReport = async () => {
    try {
      formState.fecha_envio = getTodayDateString();
      
      const reportData = { ...formState }
      const { data, error } = await supabase.from('reportes').insert([reportData]).select()
      if (error) throw error

      alert('¡Reporte guardado con éxito!')
      
      await Promise.all([
        saveSugerencia('medico', formState.medico),
        saveSugerencia('instrumentador', formState.instrumentador),
        saveSugerencia('lugar_cirugia', formState.lugar_cirugia)
      ])
      return true
    } catch (error) {
      console.error('Error al guardar el reporte:', error.message)
      alert('Error al guardar el reporte.')
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
        alert('Último reporte cargado.')
      } else {
        alert('No se encontraron reportes anteriores.')
      }
    } catch (error) {
      console.error('Error al cargar el último reporte:', error.message)
      alert('No se pudo cargar el último reporte.')
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
        const valorActual = formState.material.trim()
        formState.material = valorActual 
          ? `${valorActual}\n${data.material}`
          : data.material
        alert('Material del último reporte añadido.')
      } else {
        alert('No se encontró material en el último reporte.')
      }
    } catch (error) {
      console.error('Error al cargar el último material:', error.message)
      alert('No se pudo cargar el material del último reporte.')
    }
  }

  const resetForm = () => {
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