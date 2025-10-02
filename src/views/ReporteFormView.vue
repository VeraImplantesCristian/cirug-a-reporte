<!-- src/views/ReporteFormView.vue -->
<template>
  <!-- 
    Añadimos un div contenedor y 'pb-24' para dejar espacio al footer fijo 
    SOLO en esta vista.
  -->
  <div class="pb-24">
    <div class="space-y-[var(--gap)]">
      
      <header class="text-center mb-4">
        <h1 class="text-3xl font-bold text-[var(--text)]">Generador de Reportes de Cirugía</h1>
        <p class="text-[var(--muted)] mt-1">Complete los datos para crear un nuevo reporte.</p>
      </header>

      <div class="flex justify-end gap-4">
        <button 
          type="button" 
          @click="formStore.loadLastReport()" 
          class="text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 font-semibold transition-colors"
        >
          🔄 Cargar Último Reporte Completo
        </button>
      </div>

      <form id="report-form" @submit.prevent="handleGeneratePreview" class="grid grid-cols-1 lg:grid-cols-2 gap-[var(--gap)]">
        
        <!-- === SECCIÓN 1: DATOS PRINCIPALES === -->
        <div class="card-style lg:col-span-1">
          <h3 class="card-header">Datos Principales</h3>
          <div class="space-y-4">
            <!-- Cliente (AHORA CON DATALIST DE AUTOCOMPLETADO) -->
            <div class="form-group">
              <label for="cliente">👤 Cliente (*)</label>
              <div class="relative">
                <input 
                  id="cliente" 
                  type="text" 
                  v-model="formStore.formState.cliente" 
                  required 
                  list="clientesList"
                  @blur="handleClienteBlur"
                  :class="{'border-red-500': formStore.validationErrors.cliente}" 
                  class="form-input" 
                  placeholder="Ej: Hospital Central"
                />
                <datalist id="clientesList">
                  <!-- Iteramos sobre la lista completa de clientes -->
                  <option v-for="c in clientesStore.allClients" :key="c.id" :value="c.nombre"></option>
                </datalist>
                <button @click="isClientesModalVisible = true" type="button" class="input-button">Seleccionar</button>
              </div>
              <p v-if="formStore.validationErrors.cliente" class="form-error">{{ formStore.validationErrors.cliente }}</p>
            </div>
            
            <!-- Paciente -->
            <div class="form-group">
              <label for="paciente">👤 Paciente (*)</label>
              <input id="paciente" type="text" v-model="formStore.formState.paciente" required @blur="formStore.validateField('paciente')" :class="{'border-red-500': formStore.validationErrors.paciente}" class="form-input" placeholder="Ingrese apellido y nombre"/>
              <p v-if="formStore.validationErrors.paciente" class="form-error">{{ formStore.validationErrors.paciente }}</p>
            </div>
            
            <!-- Médico -->
            <div class="form-group">
              <label for="medico">🩺 Médico (*)</label>
              <input id="medico" type="text" v-model="formStore.formState.medico" required list="medicosList" @blur="formStore.validateField('medico')" :class="{'border-red-500': formStore.validationErrors.medico}" class="form-input" placeholder="Escriba para autocompletar..."/>
              <datalist id="medicosList"><option v-for="m in formStore.sugerencias.medicos" :key="m" :value="m"></option></datalist>
              <p v-if="formStore.validationErrors.medico" class="form-error">{{ formStore.validationErrors.medico }}</p>
            </div>
            
            <!-- Instrumentador -->
            <div class="form-group">
              <label for="instrumentador">🧑‍⚕️ Instrumentador</label>
              <input id="instrumentador" type="text" v-model="formStore.formState.instrumentador" list="instrumentadoresList" class="form-input" placeholder="Escriba para autocompletar..."/>
              <datalist id="instrumentadoresList"><option v-for="i in formStore.sugerencias.instrumentadores" :key="i" :value="i"></option></datalist>
            </div>
          </div>
        </div>

        <!-- === SECCIÓN 2: DETALLES DE LA CIRUGÍA (FECHAS REORDENADAS) === -->
        <div class="card-style lg:col-span-1">
          <h3 class="card-header">Detalles de la Cirugía</h3>
          <div class="space-y-4">
            
            <!-- Fecha de Envío (AHORA VA ARRIBA) -->
            <div class="form-group">
              <label for="fechaEnvio">✉️ Fecha de Envío</label>
              <input id="fechaEnvio" type="date" v-model="formStore.formState.fecha_envio" class="form-input bg-cyan-50 border-cyan-200"/>
            </div>

            <!-- Fecha de Cirugía (AHORA VA ABAJO) -->
            <div class="form-group">
              <label for="fechaCirugia">🗓️ Fecha de Cirugía (*)</label>
              <input id="fechaCirugia" type="date" v-model="formStore.formState.fecha_cirugia" required @blur="formStore.validateField('fecha_cirugia')" :class="{'border-red-500': formStore.validationErrors.fecha_cirugia}" class="form-input"/>
              <p v-if="formStore.validationErrors.fecha_cirugia" class="form-error">{{ formStore.validationErrors.fecha_cirugia }}</p>
            </div>
            
            <!-- Lugar -->
            <div class="form-group">
              <label for="lugarCirugia">🏥 Lugar de Cirugía</label>
              <input id="lugarCirugia" type="text" v-model="formStore.formState.lugar_cirugia" list="lugaresList" class="form-input" placeholder="Escriba para autocompletar..."/>
              <datalist id="lugaresList"><option v-for="l in formStore.sugerencias.lugaresCirugia" :key="l" :value="l"></option></datalist>
            </div>
            
            <!-- Tipo de Cirugía (AHORA CON DATALIST DE AUTOCOMPLETADO) -->
            <div class="form-group">
              <label for="tipoCirugia">🔪 Tipo de Cirugía</label>
              <div class="relative">
                <input 
                  id="tipoCirugia" 
                  type="text" 
                  v-model="formStore.formState.tipo_cirugia" 
                  list="tiposCirugiaList"
                  class="form-input" 
                  placeholder="Ej: Artroscopia de rodilla"
                />
                <datalist id="tiposCirugiaList">
                  <!-- Iteramos sobre la lista completa de tipos de cirugía -->
                  <option v-for="t in tiposCirugiaStore.allTiposCirugia" :key="t.id" :value="t.nombre"></option>
                </datalist>
                <button @click="isTiposCirugiaModalVisible = true" type="button" class="input-button">Seleccionar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- === SECCIÓN 3: MATERIAL REQUERIDO === -->
        <div class="card-style lg:col-span-2">
          <div class="flex justify-between items-center border-b pb-3 mb-4">
            <h3 class="card-header !p-0 !border-0 !m-0">📦 Material Requerido</h3>
            <button @click="formStore.loadLastMaterial()" type="button" class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors">
              🔄 Cargar del último reporte
            </button>
          </div>
          <div class="relative">
            <textarea id="material" v-model="formStore.formState.material" rows="5" class="form-input !h-auto" placeholder="Ingrese un ítem por línea o use el botón 'Seleccionar'..."></textarea>
            <button @click="isMaterialesModalVisible = true" type="button" class="input-button absolute top-2 right-2">Seleccionar</button>
          </div>
        </div>

        <!-- === SECCIÓN 4: DATOS ADICIONALES === -->
        <div class="card-style lg:col-span-2">
          <h3 class="card-header">📝 Datos Adicionales</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-[var(--gap)]">
            <div class="form-group">
              <label for="observaciones">Observaciones</label>
              <textarea id="observaciones" v-model="formStore.formState.observaciones" rows="4" class="form-input !h-auto" placeholder="Alergias, condiciones especiales, etc."></textarea>
            </div>
            <div class="form-group">
              <label for="infoAdicional">Información Adicional</label>
              <textarea id="infoAdicional" v-model="formStore.formState.info_adicional" rows="4" class="form-input !h-auto" placeholder="Contacto alternativo, prepaga, etc."></textarea>
            </div>
          </div>
        </div>
        
      </form>
    </div>

    <!-- FooterBar ahora vive aquí, dentro de la vista del formulario -->
    <FooterBar />

    <Teleport to="#modals-container">
      <ClientesModal v-model="isClientesModalVisible" @confirmar="handleClienteConfirm" />
      <MaterialesModal v-model="isMaterialesModalVisible" @confirmar="handleMaterialesConfirm" />
      <TiposCirugiaModal v-model="isTiposCirugiaModalVisible" @confirmar="handleTipoCirugiaConfirm" />
      <SolicitudPedidoModal v-model="isSolicitudModalVisible" @confirmar-pedido="handleConfirmarPedido" />
      <ReportePreviewDrawer v-model="isPreviewVisible" :reporte-data="formStore.formState" />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import html2canvas from 'html2canvas'
import { useFormStore } from '../stores/formStore'
import { useClientesStore } from '../stores/clientesStore'
import { useConfigStore } from '../stores/configStore'
import { useReportGenerator } from '../composables/useReportGenerator' 
import { useTiposCirugiaStore } from '../stores/tiposCirugiaStore' 

import ClientesModal from '../components/ClientesModal.vue'
import MaterialesModal from '../components/MaterialesModal.vue'
import TiposCirugiaModal from '../components/TiposCirugiaModal.vue'
import SolicitudPedidoModal from '../components/SolicitudPedidoModal.vue'
import ReportePreviewDrawer from '../components/ReportePreviewDrawer.vue'
import { useToastStore } from '../stores/toastStore'
import FooterBar from '../components/FooterBar.vue'

const formStore = useFormStore()
const clientesStore = useClientesStore()
const configStore = useConfigStore()
const tiposCirugiaStore = useTiposCirugiaStore() 
const toastStore = useToastStore()

const { generarTextoPlano, formatearFecha } = useReportGenerator() 

const isClientesModalVisible = ref(false)
const isMaterialesModalVisible = ref(false)
const isTiposCirugiaModalVisible = ref(false)
const isSolicitudModalVisible = ref(false) 
const isPreviewVisible = ref(false)

const clienteSeleccionado = computed(() => {
  const nombreCliente = formStore.formState.cliente
  if (!nombreCliente) return null
  return clientesStore.allClients.find(c => c.nombre === nombreCliente)
})

onMounted(() => {
  configStore.fetchMensajes() 
  formStore.initializeForm()
})

const handleClienteConfirm = (cliente) => {
  formStore.formState.cliente = cliente.nombre
  formStore.formState.email_cliente = cliente.email
  formStore.validateField('cliente')
}

// FUNCIÓN: Maneja el evento blur del input Cliente para cargar el email si es autocompletado
const handleClienteBlur = () => {
    const clienteEncontrado = clientesStore.allClients.find(c => c.nombre === formStore.formState.cliente);
    if (clienteEncontrado) {
        formStore.formState.email_cliente = clienteEncontrado.email;
    } else {
        formStore.formState.email_cliente = null;
    }
    formStore.validateField('cliente');
}

const handleMaterialesConfirm = (materialesTexto) => {
  const valorActual = formStore.formState.material.trim()
  formStore.formState.material = valorActual ? `${valorActual}\n${materialesTexto}` : materialesTexto
  isMaterialesModalVisible.value = false;
}

const handleTipoCirugiaConfirm = (tipoCirugiaNombre) => {
  formStore.formState.tipo_cirugia = tipoCirugiaNombre
}

const handleConfirmarPedido = (materiales) => {
  if (!formStore.validateForm()) {
    toastStore.showToast('Complete los campos requeridos (*) del formulario principal antes de solicitar.', 'warning')
    return
  }
  
  const datos = formStore.formState
  
  // --- PARTE 1: MAILTO a Compras ---
  const EMAIL_DESTINO = 'comprasimplantes@districorr.com.ar'
  const asunto = `Solicitud Material: ${datos.paciente} - ${datos.cliente}`
  const materialesTexto = materiales.map(m => `- ${m.description} (Cantidad: ${m.quantity})`).join('\n')
  const cuerpo = `Estimados,\nSe solicita el siguiente material para la cirugía del paciente ${datos.paciente}.\n\nDetalles:\n- Paciente: ${datos.paciente}\n- Cliente: ${datos.cliente}\n- Médico: ${datos.medico}\n- Fecha Cirugía: ${formatearFecha(datos.fecha_cirugia)}\n\nMaterial Solicitado:\n${materialesTexto}\n\nSaludos cordiales.`.trim()
  
  window.location.href = `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`

  // --- PARTE 2: DISTRITRACK URL MAPPING (CORREGIDO PARA ERD Y CODIFICACIÓN) ---
  const DISTRITRACK_URL = 'https://distri-track.vercel.app/dashboard/new-surgery'
  const params = new URLSearchParams()
  
  params.append('patient_name', datos.paciente)
  params.append('doctor_name', datos.medico)
  params.append('client', datos.cliente) // Mapeamos 'cliente' a client (ART/Aseguradora)
  params.append('institution', datos.lugar_cirugia) // Mapeamos 'lugar_cirugia' a institution (Hospital/Clínica)
  params.append('surgery_date', datos.fecha_cirugia)
  
  const materialesParaAPI = materiales.map(item => ({
    type: "note", 
    description: item.description,
    quantity: item.quantity
  }))

  const materialesJSONString = JSON.stringify(materialesParaAPI);
  params.append('materiales', materialesJSONString);

  const urlFinalDistriTrack = `${DISTRITRACK_URL}?${params.toString()}`

  setTimeout(() => window.open(urlFinalDistriTrack, '_blank'), 500)
}

const handleEnviarACliente = () => {
  if (!formStore.validateForm()) {
    toastStore.showToast('Corrija los errores en el formulario antes de enviar.', 'warning')
    return
  }
  if (clienteSeleccionado.value?.email) {
    const textoPlano = generarTextoPlano(clienteSeleccionado.value.email)
    const asunto = configStore.replaceVariables(configStore.mensajes.asunto_base, formStore.formState)
    window.location.href = `mailto:${clienteSeleccionado.value.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoPlano)}`
    toastStore.showToast('Abriendo cliente de correo.', 'info')
  } else {
    toastStore.showToast('El cliente seleccionado no tiene un email registrado.', 'warning')
  }
}

const handleGeneratePreview = async () => {
  if (!formStore.validateForm()) {
    toastStore.showToast('Corrija los errores en los campos requeridos (*).', 'warning')
    return
  }
  
  // Lógica de Guardado Implícito: Si no tiene ID (es nuevo), lo guardamos.
  if (!formStore.formState.id) {
      toastStore.showToast('Guardando reporte...', 'info');
      const success = await formStore.saveReport();
      if (!success) {
          // El store ya lanzó el toast de error.
          return; 
      }
  }
  
  formStore.formState.email_cliente = clienteSeleccionado.value?.email || null
  isPreviewVisible.value = true
}

const handleSaveReport = async () => {
  if (!formStore.validateForm()) {
    toastStore.showToast('Corrija los errores en el formulario antes de guardar.', 'warning')
    return
  }
  if (await formStore.saveReport()) {
    toastStore.showToast('Reporte guardado con éxito!', 'success')
  } else {
    toastStore.showToast('Error al guardar el reporte.', 'error')
  }
}

const handleWhatsApp = () => {
  const textoPlano = generarTextoPlano(clienteSeleccionado.value?.email)
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textoPlano)}`, '_blank')
}

const handleEmail = () => {
  const asunto = configStore.replaceVariables(configStore.mensajes.asunto_base, formStore.formState)
  const textoPlano = generarTextoPlano(clienteSeleccionado.value?.email)
  window.location.href = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoPlano)}`
}

const handleLimpiar = () => {
  formStore.resetForm()
  isPreviewVisible.value = false
  toastStore.showToast('Formulario limpiado.', 'info')
}

const handleImprimir = () => {
  toastStore.showToast("Función de impresión en desarrollo.", 'info')
}

const handleGuardarImagen = async () => {
  isPreviewVisible.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const drawerContent = document.querySelector('.reporte-box')
  if (!drawerContent) {
    toastStore.showToast('Error: Contenedor de vista previa no encontrado.', 'error')
    return
  }

  try {
    const canvas = await html2canvas(drawerContent, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
    const link = document.createElement('a')
    link.download = `reporte_${formStore.formState.cliente || 'sinc'}_${formStore.formState.paciente || 'sinp'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    toastStore.showToast('Imagen del reporte descargada.', 'success')
  } catch (error) {
    console.error('Error al generar la imagen:', error)
    toastStore.showToast('Ocurrió un error al generar la imagen.', 'error')
  }
}

// --- NUEVA FUNCIÓN: Maneja el envío auditable ---
const handleSendAuditableMail = async (mailType) => {
    if (!formStore.validateForm()) {
        toastStore.showToast('Corrija los errores en el formulario antes de enviar.', 'warning')
        return
    }

    if (!formStore.formState.id) {
        toastStore.showToast('Guardando reporte antes de enviar para garantizar el registro...', 'info')
        const success = await formStore.saveReport()
        if (!success) {
            toastStore.showToast('Error al guardar el reporte. No se puede auditar el envío.', 'error')
            return
        }
    }

    const textoPlano = generarTextoPlano(clienteSeleccionado.value?.email)
    const result = await formStore.sendAuditableMail(mailType, textoPlano)
    
    if (result.success) {
        toastStore.showToast(`Abriendo cliente de correo para ${mailType.toUpperCase()}.`, 'info')
    } else {
        toastStore.showToast(`Error de Envío: ${result.error}`, 'error')
    }
}

// --- WATCH para el Action Trigger (ACTUALIZADO) ---
watch(() => formStore.actionTrigger, (trigger) => {
  if (trigger) {
    switch (trigger.name) {
      case 'generatePreview': // 'Guardar y Ver'
        handleGeneratePreview(); // Esta función ahora guarda implícitamente
        break;
      case 'saveReport':
        handleSaveReport(); // Si el botón explícito de Guardar es presionado
        break;
      case 'solicitarPedido':
        isSolicitudModalVisible.value = true;
        break;
      case 'share':
        if (trigger.payload.id === 'whatsapp') handleWhatsApp();
        if (trigger.payload.id === 'email') handleEmail();
        if (trigger.payload.id === 'print') handleImprimir();
        if (trigger.payload.id === 'image') handleGuardarImagen();
        break;
      case 'sendAuditableMail':
          handleSendAuditableMail(trigger.payload.mailType);
          break;
      case 'resetForm': // <--- CONECTAMOS EL RESET
          handleLimpiar();
          break;
    }
    formStore.clearActionTrigger();
  }
}, { deep: true });
</script>

<style>
/* Este bloque está vacío porque los estilos están en src/style.css */
</style>
