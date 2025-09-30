<!-- src/components/ReporteDetalleModal.vue -->
<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Detalle del Reporte"
  >
    <template #body>
      <!-- La sección del cuerpo simplemente renderiza el HTML generado -->
      <section class="p-2" v-html="formattedReportHTML"></section>
    </template>

    <template #footer>
      <!-- Contenedor flexible para los botones y texto de ayuda en el footer -->
      <div class="flex flex-col items-end gap-2">
        <div class="flex gap-2">
          <!-- Botón para copiar el reporte como texto plano -->
          <button @click="handleCopiarTextoPlano" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-1 text-sm">
            📋 Copiar Texto Plano
          </button>
          <!-- Botón para copiar el reporte como HTML para email -->
          <button @click="handleCopiarHtmlEmail" class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-1 text-sm">
            📧 Copiar HTML para Email
          </button>
        </div>
        <!-- Pequeño texto de ayuda para los botones de copiado -->
        <small class="text-gray-500 text-xs text-right">
          HTML para Gmail/Outlook web. Texto plano para WhatsApp/Mailto.
        </small>
      </div>
      <!-- Botón para cerrar el modal -->
      <button @click="$emit('update:modelValue', false)" class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
        Cerrar
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue' // Importa el componente base del modal
import { copyHtmlToClipboard } from '../utils/clipboard' // Importa la función auxiliar para copiar HTML
import { useToastStore } from '../stores/toastStore' // Importa el store de notificaciones

// Definimos las propiedades que este componente puede recibir de su padre.
const props = defineProps({
  modelValue: { type: Boolean, required: true }, // Controla la visibilidad del modal (v-model)
  reporteData: { type: Object, default: () => ({}) } // Los datos del reporte a mostrar
})

// Definimos los eventos que este componente puede emitir a su padre.
const emit = defineEmits(['update:modelValue'])

// Instancia del store de notificaciones para mostrar mensajes al usuario.
const toastStore = useToastStore()

// Función auxiliar para formatear una fecha de 'YYYY-MM-DD' a 'DD/MM/YYYY'.
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return null
  const [year, month, day] = fechaISO.split('-')
  return `${day}/${month}/${year}`
}

// Función auxiliar para formatear texto de un textarea a HTML (reemplaza saltos de línea con <br>).
// También maneja el caso de "No especificado" con estilo.
const formatTextForHTML = (text) => text ? text.replace(/\n/g, '<br>') : '<span style="color: #888; font-style: italic;">No especificado.</span>';

// --- FUNCIONES PARA GENERAR EL CONTENIDO DEL REPORTE ---

/**
 * Genera el reporte completo en formato de texto plano (Markdown básico).
 * Ideal para copiar a WhatsApp, correos via mailto, o editores de texto simple.
 * @param {Object} datos - Objeto con todos los campos del reporte.
 * @returns {string} El reporte formateado como texto plano.
 */
const generarTextoPlanoCompleto = (datos) => {
  const fechaCirugiaFormateada = formatearFecha(datos.fecha_cirugia) || 'No especificada'
  const fechaEnvioFormateada = formatearFecha(datos.fecha_envio)
  // Determina si hay email del cliente para incluirlo en el texto plano.
  const emailClienteTexto = datos.email_cliente
    ? `\n- *Email Cliente:* ${datos.email_cliente}` 
    : '';

  return `
*Reporte de Cirugía*
${datos.mensaje_inicio || 'Detalles de la cirugía programada:'}
- *Cliente:* ${datos.cliente || 'No especificado'}${emailClienteTexto}
- *Paciente:* ${datos.paciente || 'No especificado'}
- *Médico:* ${datos.medico || 'No especificado'}
- *Instrumentador:* ${datos.instrumentador || 'No especificado'}
- *Fecha de Cirugía:* ${fechaCirugiaFormateada}
- *Lugar:* ${datos.lugar_cirugia || 'No especificado'}
- *Tipo de Cirugía:* ${datos.tipo_cirugia || 'No especificado'}
${fechaEnvioFormateada ? `- *Fecha de Envío:* ${fechaEnvioFormateada}` : ''}

*Material Requerido:*
${(datos.material || '').split('\n').filter(l => l.trim() !== '').map(l => `- ${l.trim()}`).join('\n') || '- No especificado'}

${datos.observaciones ? `*Observaciones:*\n${datos.observaciones}\n` : ''}
${datos.info_adicional ? `*Info Adicional:*\n${datos.info_adicional}\n` : ''}

Saludos, quedo al pendiente.
  `.trim();
}

/**
 * Genera el reporte completo en formato HTML con estilos inline para alta compatibilidad en emails.
 * Ideal para copiar y pegar en clientes de correo avanzados (Gmail, Outlook web).
 * @param {Object} datos - Objeto con todos los campos del reporte.
 * @returns {string} El reporte formateado como HTML.
 */
const generarHTMLReporteCompleto = (datos) => {
  // Formatea fechas, mostrando un estilo diferente si no están especificadas.
  const fechaCirugiaFormateada = formatearFecha(datos.fecha_cirugia) || '<span style="color: #888; font-style: italic;">No especificada.</span>'
  const fechaEnvioFormateada = formatearFecha(datos.fecha_envio)

  // Prepara la lista de materiales, aplicando estilos y manejo de "No especificado".
  let materialListItems = (datos.material || '')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => `<li style="margin-bottom: 4px;">${l.trim()}</li>`)
    .join('');
  if (!materialListItems) materialListItems = `<li style="margin-bottom: 4px; color: #888; font-style: italic;">No especificado.</li>`;

  // Retorna el template HTML con estilos inline.
  return `
    <div style="font-family: 'Roboto', 'Arial', sans-serif; font-size: 14px; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 25px; background-color: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="color: #333;">
        <tr>
          <td style="text-align: center; font-size: 22px; font-weight: bold; color: #0056b3; padding-bottom: 20px;">
            📝 Reporte de Cirugía
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 15px;">
            <p style="margin: 0; font-size: 15px; color: #555;">${datos.mensaje_inicio || 'Detalles de la cirugía programada:'}</p>
          </td>
        </tr>
        <tr>
          <td>
            <ul style="list-style: none; padding: 0; margin: 0 0 20px 0; font-size: 15px;">
              <li style="margin-bottom: 7px;"><strong>Cliente:</strong> ${datos.cliente || '<span style="color: #888; font-style: italic;">No especificado.</span>'}</li>
              ${datos.email_cliente ? `<li style="margin-bottom: 7px;"><strong>Email Cliente:</strong> ${datos.email_cliente}</li>` : ''}
              <li style="margin-bottom: 7px;"><strong>Paciente:</strong> ${datos.paciente || '<span style="color: #888; font-style: italic;">No especificado.</span>'}</li>
              <li style="margin-bottom: 7px;"><strong>Médico:</strong> ${datos.medico || '<span style="color: #888; font-style: italic;">No especificado.</span>'}</li>
              <li style="margin-bottom: 7px;"><strong>Instrumentador:</strong> ${datos.instrumentador || '<span style="color: #888; font-style: italic;">No especificado.</span>'}</li>
              <li style="margin-bottom: 7px;"><strong>Fecha de Cirugía:</strong> ${fechaCirugiaFormateada}</li>
              <li style="margin-bottom: 7px;"><strong>Lugar:</strong> ${datos.lugar_cirugia || '<span style="color: #888; font-style: italic;">No especificado.</span>'}</li>
              <li style="margin-bottom: 7px;"><strong>Tipo de Cirugía:</strong> ${datos.tipo_cirugia || '<span style="color: #888; font-style: italic;">No especificado.</span>'}</li>
              ${fechaEnvioFormateada ? `<li style="margin-bottom: 7px;"><strong>Fecha de Envío:</strong> ${fechaEnvioFormateada}</li>` : ''}
            </ul>
          </td>
        </tr>
        <tr>
          <td style="font-size: 16px; font-weight: bold; padding-top: 15px; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; color: #007bff;">
            Material Requerido:
          </td>
        </tr>
        <tr>
          <td style="padding-top: 10px; padding-bottom: 20px;">
            <ul style="list-style: disc; margin: 0; padding-left: 20px; font-size: 15px;">${materialListItems}</ul>
          </td>
        </tr>
        ${datos.observaciones ? `
        <tr>
          <td style="font-size: 16px; font-weight: bold; padding-top: 15px; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; color: #007bff;">
            Observaciones:
          </td>
        </tr>
        <tr>
          <td style="padding-top: 10px; padding-bottom: 20px;">
            <p style="margin: 0; font-size: 15px; color: #555;">${formatTextForHTML(datos.observaciones)}</p>
          </td>
        </tr>` : ''}
        ${datos.info_adicional ? `
        <tr>
          <td style="font-size: 16px; font-weight: bold; padding-top: 15px; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; color: #007bff;">
            Información Adicional:
          </td>
        </tr>
        <tr>
          <td style="padding-top: 10px; padding-bottom: 20px;">
            <p style="margin: 0; font-size: 15px; color: #555;">${formatTextForHTML(datos.info_adicional)}</p>
          </td>
        </tr>` : ''}
        <tr>
          <td style="padding-top: 25px;">
            <p style="margin: 0; font-size: 15px; color: #555;">Saludos, quedo al pendiente.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

// Propiedad computada que se usa para renderizar el HTML en el cuerpo del modal.
// Se actualiza automáticamente cada vez que 'props.reporteData' cambia.
const formattedReportHTML = computed(() => generarHTMLReporteCompleto(props.reporteData))

// --- FUNCIONES DE ACCIÓN PARA COPIAR ---

/**
 * Maneja el evento de clic para copiar el reporte como texto plano al portapapeles.
 * Muestra un toast de éxito o error.
 */
const handleCopiarTextoPlano = async () => {
  try {
    const textoPlano = generarTextoPlanoCompleto(props.reporteData)
    await navigator.clipboard.writeText(textoPlano)
    toastStore.showToast('Reporte copiado como texto plano al portapapeles.', 'success')
  } catch (error) {
    console.error('Error al copiar el reporte (texto plano):', error)
    toastStore.showToast('Error al copiar el reporte como texto plano.', 'error')
  }
}

/**
 * Maneja el evento de clic para copiar el reporte como HTML enriquecido al portapapeles.
 * Utiliza la función auxiliar 'copyHtmlToClipboard' y muestra un toast de éxito o error.
 */
const handleCopiarHtmlEmail = async () => {
  try {
    const htmlContent = generarHTMLReporteCompleto(props.reporteData)
    const textContent = generarTextoPlanoCompleto(props.reporteData) // Se incluye fallback de texto plano
    
    await copyHtmlToClipboard(htmlContent, textContent)

    toastStore.showToast('Reporte copiado como HTML enriquecido para email.', 'success')
  } catch (error) {
    console.error('Error al copiar el reporte (HTML):', error)
    toastStore.showToast('Error al copiar el reporte como HTML.', 'error')
  }
}
</script>