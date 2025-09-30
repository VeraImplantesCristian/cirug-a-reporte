<!-- src/components/ReportePreviewDrawer.vue -->
<template>
  <Transition name="drawer">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <!-- Fondo oscuro semitransparente -->
      <div
        class="absolute inset-0 bg-black bg-opacity-50"
        @click="$emit('update:modelValue', false)"
      ></div>

      <!-- Panel deslizante (Drawer) -->
      <div class="absolute top-0 right-0 h-full w-full max-w-2xl bg-[var(--card)] shadow-xl flex flex-col">
        
        <!-- Cabecera del Drawer -->
        <header class="p-4 border-b border-gray-200/80 flex justify-between items-center">
          <h2 class="text-xl font-bold text-[var(--text)]">Vista Previa del Reporte</h2>
          <button @click="$emit('update:modelValue', false)" class="text-gray-500 hover:text-red-500 text-2xl transition-colors">&times;</button>
        </header>

        <!-- Contenido del Reporte -->
        <section class="p-6 overflow-y-auto flex-grow reporte-box" v-html="formattedReportHTML"></section>

        <!-- Footer con botones de acción -->
        <footer class="p-4 border-t border-gray-200/80 flex flex-wrap justify-between gap-3 items-center">
          <div class="flex items-center gap-2 flex-wrap">
            <button @click="handleCopiarTextoPlano" class="btn-secondary bg-blue-600">📋 Texto Plano</button>
            <button @click="handleCopiarHtmlEmail" class="btn-secondary bg-purple-600">📧 Copiar HTML</button>
            <!-- BOTÓN ACTUALIZADO con el nuevo emoji -->
            <button 
              v-if="props.reporteData.email_cliente"
              @click="handleAbrirMailCliente" 
              class="btn-secondary bg-teal-500"
            >
              📃 Abrir Mail Cliente
            </button>
          </div>
          
          <button @click="$emit('update:modelValue', false)" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 font-semibold transition-colors">
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { copyHtmlToClipboard } from '../utils/clipboard'
import { useToastStore } from '../stores/toastStore'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  reporteData: { type: Object, default: () => ({}) }
})

defineEmits(['update:modelValue'])

const toastStore = useToastStore()

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return null
  const [year, month, day] = fechaISO.split('-')
  return `${day}/${month}/${year}`
}

const formatTextForHTML = (text) => text ? text.replace(/\n/g, '<br>') : '<span style="color: #9ca3af;">No especificado</span>';

// --- TEXTO PLANO MEJORADO para máxima compatibilidad y legibilidad ---
const generarTextoPlanoCompleto = (datos) => {
  const fechaCirugiaFormateada = formatearFecha(datos.fecha_cirugia) || 'N/E'
  const fechaEnvioFormateada = formatearFecha(datos.fecha_envio)
  
  const seccionTexto = (titulo, contenido) => {
    if (!contenido) return ''
    return `\n\n--- ${titulo.toUpperCase()} ---\n${contenido}`
  }

  const materialTexto = (datos.material || '')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => `- ${l.trim()}`)
    .join('\n') || '- No especificado'

  return `
================================
REPORTE DE CIRUGÍA
================================

${datos.mensaje_inicio || ''}

--- DATOS PRINCIPALES ---
Cliente: ${datos.cliente || 'N/E'}
${datos.email_cliente ? `Email Cliente: ${datos.email_cliente}` : ''}
Paciente: ${datos.paciente || 'N/E'}
Médico: ${datos.medico || 'N/E'}
Instrumentador: ${datos.instrumentador || 'N/E'}
Fecha de Cirugía: ${fechaCirugiaFormateada}
Lugar: ${datos.lugar_cirugia || 'N/E'}
Tipo de Cirugía: ${datos.tipo_cirugia || 'N/E'}
${fechaEnvioFormateada ? `Fecha de Envío: ${fechaEnvioFormateada}` : ''}

--- MATERIAL REQUERIDO ---
${materialTexto}
${seccionTexto('Observaciones', datos.observaciones)}
${seccionTexto('Información Adicional', datos.info_adicional)}

Saludos cordiales.
  `.trim().replace(/\n\n\n/g, '\n\n'); // Limpia saltos de línea extra
}


const generarHTMLReporteCompleto = (datos) => {
  const fechaCirugiaFormateada = formatearFecha(datos.fecha_cirugia) || '<span style="color: #9ca3af;">N/E</span>'
  const fechaEnvioFormateada = formatearFecha(datos.fecha_envio)

  let materialListItems = (datos.material || '')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => `<li style="margin-bottom: 5px;">${l.trim()}</li>`)
    .join('');
  if (!materialListItems) materialListItems = `<li style="color: #9ca3af;">No especificado.</li>`;

  const seccionHTML = (titulo, contenido) => {
    if (!contenido) return ''
    return `
      <div style="margin-top: 20px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px;">
          ${titulo}
        </h3>
        <div style="font-size: 15px; color: #374151;">${formatTextForHTML(contenido)}</div>
      </div>
    `
  }

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #374151; line-height: 1.6;">
      <h2 style="font-size: 24px; font-weight: 700; color: #111827; text-align: center; margin-bottom: 24px;">
        Reporte de Cirugía
      </h2>
      <p style="margin-bottom: 24px; color: #4b5563;">${datos.mensaje_inicio || ''}</p>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 24px; border: 1px solid #e5e7eb; padding: 16px; border-radius: 12px; background-color: #f9fafb;">
        <div><strong>Cliente:</strong> ${datos.cliente || '<span style="color: #9ca3af;">N/E</span>'}</div>
        ${datos.email_cliente ? `<div><strong>Email:</strong> ${datos.email_cliente}</div>` : ''}
        <div><strong>Paciente:</strong> ${datos.paciente || '<span style="color: #9ca3af;">N/E</span>'}</div>
        <div><strong>Médico:</strong> ${datos.medico || '<span style="color: #9ca3af;">N/E</span>'}</div>
        <div><strong>Instrumentador:</strong> ${datos.instrumentador || '<span style="color: #9ca3af;">N/E</span>'}</div>
        <div><strong>Fecha Cirugía:</strong> ${fechaCirugiaFormateada}</div>
        <div><strong>Lugar:</strong> ${datos.lugar_cirugia || '<span style="color: #9ca3af;">N/E</span>'}</div>
        <div><strong>Tipo Cirugía:</strong> ${datos.tipo_cirugia || '<span style="color: #9ca3af;">N/E</span>'}</div>
        ${fechaEnvioFormateada ? `<div><strong>Fecha Envío:</strong> ${fechaEnvioFormateada}</div>` : ''}
      </div>

      <div style="margin-top: 20px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px;">
          Material Requerido
        </h3>
        <ul style="list-style-position: inside; padding-left: 10px;">${materialListItems}</ul>
      </div>

      ${seccionHTML('Observaciones', datos.observaciones)}
      ${seccionHTML('Información Adicional', datos.info_adicional)}

      <p style="margin-top: 24px; color: #4b5563;">Saludos cordiales.</p>
    </div>
  `;
}

const formattedReportHTML = computed(() => generarHTMLReporteCompleto(props.reporteData))

const handleCopiarTextoPlano = async () => {
  try {
    await navigator.clipboard.writeText(generarTextoPlanoCompleto(props.reporteData))
    toastStore.showToast('Reporte copiado como texto plano.', 'success')
  } catch (error) {
    toastStore.showToast('Error al copiar el reporte.', 'error')
  }
}

const handleCopiarHtmlEmail = async () => {
  try {
    await copyHtmlToClipboard(
      generarHTMLReporteCompleto(props.reporteData),
      generarTextoPlanoCompleto(props.reporteData)
    )
    toastStore.showToast('Reporte copiado como HTML para email.', 'success')
  } catch (error) {
    toastStore.showToast('Error al copiar el reporte como HTML.', 'error')
  }
}

const handleAbrirMailCliente = () => {
  const datos = props.reporteData
  if (datos.email_cliente) {
    const asunto = `Reporte Cirugía: ${datos.cliente} - ${datos.paciente}`
    // Usamos el texto plano mejorado para el cuerpo del mailto
    const mailtoLink = `mailto:${datos.email_cliente}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(generarTextoPlanoCompleto(datos))}`
    window.location.href = mailtoLink
    toastStore.showToast('Abriendo cliente de correo.', 'info') 
  } else {
    toastStore.showToast('Este cliente no tiene un email registrado.', 'warning')
  }
}
</script>

<style scoped>
/* Animación para el drawer (sin cambios) */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-active .absolute.top-0.right-0,
.drawer-leave-active .absolute.top-0.right-0 {
  transition: transform 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .absolute.top-0.right-0,
.drawer-leave-to .absolute.top-0.right-0 {
  transform: translateX(100%);
}
</style>
