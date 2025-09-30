// src/stores/formStore.js

import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { supabase } from '../supabase'
import { useClientesStore } from './clientesStore'
import { useMaterialesStore } from './materialesStore'
import { useTiposCirugiaStore } from './tiposCirugiaStore'
// Importamos el store de configuración
import { useConfigStore } from './configStore' 

const getTodayDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const todayLocal = new Date(today.getTime() - (offset * 60 * 1000));
  return todayLocal.toISOString().split('T')[0];
}

const MENSAJE_INICIO_DEFAULT = 'Estimados, Adjunto detalles de la cirugía programada:';

// --- CONFIGURACIÓN DE EMAILS FIJOS (DEBEN COINCIDIR CON FooterBar.vue) ---
const EMAIL_INTERNO = 'coordinacion@districorr.com.ar';
const EMAIL_ART = 'autorizaciones@art-implantes.com';


export const useFormStore = defineStore('form', () => {
  const formState = reactive({
    mensaje_inicio: MENSAJE_INICIO_DEFAULT,
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
    id: null, // ID del reporte guardado
  })

  const actionTrigger = ref(null);

  // --- ACCIONES para ser llamadas desde el FooterBar ---
  const triggerGeneratePreview = () => { actionTrigger.value = { name: 'generatePreview', timestamp: Date.now() } };
  const triggerSaveReport = () => { actionTrigger.value = { name: 'saveReport', timestamp: Date.now() } };
  const triggerSolicitarPedido = () => { actionTrigger.value = { name: 'solicitarPedido', timestamp: Date.now() } };
  const triggerShare = (option) => { actionTrigger.value = { name: 'share', payload: option, timestamp: Date.now() } };
  
  // --- TRIGGER AUDITABLE ---
  const triggerSendAuditableMail = (mailType) => { actionTrigger.value = { name: 'sendAuditableMail', payload: { mailType }, timestamp: Date.now() } };
  
  const clearActionTrigger = () => { actionTrigger.value = null };

  const sugerencias = reactive({
    medicos: [],
    instrumentadores: [],
    lugaresCirugia: []
  });

  const validationErrors = reactive({
    cliente: null,
    paciente: null,
    medico: null,
    fecha_cirugia: null
  });

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
    if (!valor || valor.trim() === '') return;
    const valorLimpio = valor.trim()
    try {
      const { error } = await supabase
        .from('sugerencias')
        .upsert({ campo, valor: valorLimpio }, { onConflict: 'campo, valor' });
      if (error) throw error;
      
      if (campo === 'medico' && !sugerencias.medicos.includes(valorLimpio)) sugerencias.medicos.push(valorLimpio);
      if (campo === 'instrumentador' && !sugerencias.instrumentadores.includes(valorLimpio)) sugerencias.instrumentadores.push(valorLimpio);
      if (campo === 'lugar_cirugia' && !sugerencias.lugaresCirugia.includes(valorLimpio)) sugerencias.lugaresCirugia.push(valorLimpio);
    } catch (error) {
      console.error(`Error guardando sugerencia:`, error);
    }
  }

  const initializeForm = async () => {
    const clientesStore = useClientesStore()
    const materialesStore = useMaterialesStore()
    const tiposCirugiaStore = useTiposCirugiaStore()
    const configStore = useConfigStore() // Usamos configStore aquí

    // Cargamos todos los datos maestros y de configuración en paralelo
    await Promise.all([
      clientesStore.fetchAllClients(),
      materialesStore.fetchMateriales(),
      tiposCirugiaStore.fetchTiposCirugia(),
      configStore.fetchMensajes(), // Cargamos los mensajes de configuración
    ]);

    try {
      const { data, error } = await supabase.from('sugerencias').select('campo, valor')
      if (error) throw error

      sugerencias.medicos = data.filter(s => s.campo === 'medico').map(s => s.valor)
      sugerencias.instrumentadores = data.filter(s => s.campo === 'instrumentador').map(s => s.valor)
      sugerencias.lugaresCirugia = data.filter(s => s.campo === 'lugar_cirugia').map(s => s.valor)
    } catch (error) {
      console.error('Error al cargar las sugerencias:', error.message)
    }
  }

  // --- Función: Registra el intento de envío de email ---
  const logEmailAttempt = async (logData) => {
    try {
        const { error } = await supabase
            .from('log_emails')
            .insert([logData]);
        if (error) throw error;
        console.log(`LogEmail: Intento de envío a ${logData.tipo_envio} registrado con éxito.`);
    } catch (error) {
        console.error('LogEmail: Error al registrar el intento de envío:', error.message);
    }
  }

  // --- Función: Construye y registra el mailto auditable ---
  const sendAuditableMail = async (mailType, textoPlano) => {
      // 1. Dependencias y Variables
      const configStore = useConfigStore();
      const asuntoBase = configStore.mensajes.asunto_base || 'Reporte de Cirugía';
      const asuntoFinal = configStore.replaceVariables(asuntoBase, formState);

      let destinatario;
      let asunto = asuntoFinal;
      
      switch (mailType) {
          case 'cliente':
              destinatario = formState.email_cliente;
              break;
          case 'interno':
              destinatario = EMAIL_INTERNO;
              asunto = asuntoFinal + ' (INTERNO)';
              break;
          case 'art':
              destinatario = EMAIL_ART;
              asunto = asuntoFinal + ' (AUTORIZACIÓN ART)';
              break;
          default:
              return { success: false, error: 'Tipo de envío desconocido.' };
      }

      if (!destinatario) {
          return { success: false, error: `El destinatario para ${mailType} no está configurado o no tiene email.` };
      }

      // 2. Registrar la intención de envío (Log)
      const logData = {
          reporte_id: formState.id, 
          tipo_envio: mailType.toUpperCase(),
          destinatarios: destinatario,
          asunto: asunto,
          estado: 'INTENTADO' 
      };

      await logEmailAttempt(logData);

      // 3. Disparar el mailto:
      const mailtoLink = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoPlano)}`;
      window.location.href = mailtoLink;
      
      return { success: true, message: `Mailto a ${mailType.toUpperCase()} disparado.` };
  }


  const saveReport = async () => {
    try {
      formState.mensaje_inicio = MENSAJE_INICIO_DEFAULT;
      
      if (!formState.fecha_envio) {
        formState.fecha_envio = getTodayDateString();
      }
      
      const reportDataToSave = { ...formState };
      delete reportDataToSave.email_cliente;
      delete reportDataToSave.id; // Aseguramos que el ID no se use en un INSERT

      const { data, error } = await supabase.from('reportes').insert([reportDataToSave]).select()
      if (error) throw error
      
      // Guardamos el ID del reporte en el formState para que esté disponible para el log
      formState.id = data[0].id; 
      
      await Promise.all([
        saveSugerencia('medico', formState.medico),
        saveSugerencia('instrumentador', formState.instrumentador),
        saveSugerencia('lugar_cirugia', formState.lugar_cirugia)
      ])
      return true
    } catch (error) {
      console.error('Error al guardar el reporte:', error.message)
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
        formState.mensaje_inicio = MENSAJE_INICIO_DEFAULT;
        formState.id = data.id; // Cargamos el ID para futuras auditorías
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
      }
    } catch (error) {
      console.error('Error al cargar el último reporte:', error.message)
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
          ? `${valorActual}\n${data.material.trim()}`
          : data.material.trim()
      }
    } catch (error) {
      console.error('Error al cargar el último material:', error.message)
    }
  }

  const resetForm = () => {
    formState.mensaje_inicio = MENSAJE_INICIO_DEFAULT
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
    formState.id = null; // Limpiamos el ID del reporte

    Object.keys(validationErrors).forEach(key => {
      validationErrors[key] = null
    })
  }

  return {
    formState,
    sugerencias,
    validationErrors,
    actionTrigger,
    triggerGeneratePreview,
    triggerSaveReport,
    triggerSolicitarPedido,
    triggerShare,
    triggerSendAuditableMail,
    sendAuditableMail,
    logEmailAttempt,
    clearActionTrigger,
    initializeForm,
    saveReport,
    resetForm,
    loadLastReport,
    loadLastMaterial,
    validateField,
    validateForm
  }
})