<!-- src/components/ReportePreviewDrawer.vue -->
<template>
  <Transition name="drawer">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <!-- Fondo oscuro semitransparente que cierra el drawer al hacer clic fuera -->
      <div
        class="absolute inset-0 bg-black bg-opacity-50"
        @click="$emit('update:modelValue', false)"
      ></div>

      <!-- Panel deslizante (Drawer) -->
      <div class="absolute top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col">
        <!-- Cabecera del Drawer -->
        <header class="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 class="text-xl font-semibold text-gray-800">Vista Previa del Reporte</h2>
          <button @click="$emit('update:modelValue', false)" class="text-2xl hover:text-red-500">&times;</button>
        </header>

        <!-- Contenido del Reporte (renderizado con v-html) -->
        <section class="p-6 overflow-y-auto flex-grow" v-html="formattedReportHTML"></section>

        <!-- --- FOOTER CON BOTONES DE ACCIÓN MEJORADOS --- -->
        <footer class="p-4 border-t bg-gray-50 flex flex-wrap justify-end gap-3 items-center">
          <!-- Grupo de botones de copiado -->
          <div class="flex flex-col items-end gap-2">
            <div class="flex gap-2">
              <!-- Botón para copiar el reporte como texto plano -->
              <button @click="handleCopiarTextoPlano" class="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600 flex items-center gap-1">
                📋 Texto Plano
              </button>
              <!-- Botón para copiar el reporte como HTML para email -->
              <button @click="handleCopiarHtmlEmail" class="bg-purple-600 text-white text-sm px-3 py-1 rounded-md hover:bg-purple-700 flex items-center gap-1">
                📧 Copiar HTML
              </button>
            </div>
            <!-- Pequeño texto de ayuda para los botones de copiado -->
            <small class="text-gray-500 text-xs text-right">
              HTML para clientes de correo avanzados (Gmail, Outlook web). Use texto plano para WhatsApp/Mailto.
            </small>
          </div>
          
          <!-- Botón "Abrir Mail del Cliente" con Toast -->
          <button 
            v-if="props.reporteData.email_cliente"
            @click="handleAbrirMailCliente" 
            class="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 flex items-center gap-1"
          >
            ✉️ Abrir Mail Cliente
          </button>
          
          <!-- Botón para cerrar el Drawer -->
          <button @click="$emit('update:modelValue', false)" class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
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

const formatTextForHTML = (text) => text ? text.replace(/\n/g, '<br>') : '<span style="color: #888; font-style: italic;">No especificado.</span>';

// --- FUNCIONES PARA GENERAR EL CONTENIDO DEL REPORTE EN TEXTO PLANO Y HTML ---

const generarTextoPlanoCompleto = (datos) => {
  console.log('generarTextoPlanoCompleto: Generando texto plano con datos:', datos);
  const fechaCirugiaFormateada = formatearFecha(datos.fecha_cirugia) || 'No especificada'
  const fechaEnvioFormateada = formatearFecha(datos.fecha_envio)
  const emailClienteTexto = datos.email_cliente
    ? `\n- *Email Cliente:* ${datos.email_cliente}` 
    : '';

  const generatedText = `
- Reporte de Cirugía
${datos.mensaje_inicio || 'Detalles de la cirugía programada:'}
- Cliente: ${datos.cliente || 'No especificado'}${emailClienteTexto}
- Paciente: ${datos.paciente || 'No especificado'}
- Médico: ${datos.medico || 'No especificado'}
- Instrumentador: ${datos.instrumentador || 'No especificado'}
- Fecha de Cirugía: ${fechaCirugiaFormateada}
- Lugar: ${datos.lugar_cirugia || 'No especificado'}
- Tipo de Cirugía: ${datos.tipo_cirugia || 'No especificado'}
${fechaEnvioFormateada ? `-* Fecha de Envío: ${fechaEnvioFormateada}` : ''}

*Material Requerido:*
${(datos.material || '').split('\n').filter(l => l.trim() !== '').map(l => `- ${l.trim()}`).join('\n') || '- No especificado'}

${datos.observaciones ? `Observaciones:\n${datos.observaciones}\n` : ''}
${datos.info_adicional ? `Info Adicional:\n${datos.info_adicional}\n` : ''}

Saludos, quedo al pendiente. Equipo de Coordinación Districorr.
  `.trim();
  console.log('generarTextoPlanoCompleto: Texto plano generado:', generatedText);
  return generatedText;
}

const generarHTMLReporteCompleto = (datos) => {
  console.log('generarHTMLReporteCompleto: Generando HTML con datos:', datos);
  const fechaCirugiaFormateada = formatearFecha(datos.fecha_cirugia) || '<span style="color: #888; font-style: italic;">No especificada.</span>'
  const fechaEnvioFormateada = formatearFecha(datos.fecha_envio)

  let materialListItems = (datos.material || '')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => `<li style="margin-bottom: 4px;">${l.trim()}</li>`)
    .join('');
  if (!materialListItems) materialListItems = `<li style="margin-bottom: 4px; color: #888; font-style: italic;">No especificado.</li>`;

  const generatedHtml = `
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
  console.log('generarHTMLReporteCompleto: HTML generado:', generatedHtml);
  return generatedHtml;
}

const formattedReportHTML = computed(() => generarHTMLReporteCompleto(props.reporteData))

// --- FUNCIONES DE ACCIÓN PARA COPIAR Y ENVIAR ---

const handleCopiarTextoPlano = async () => {
  console.log('handleCopiarTextoPlano: Botón "Copiar Texto Plano" clickeado.');
  try {
    const textoPlano = generarTextoPlanoCompleto(props.reporteData)
    await navigator.clipboard.writeText(textoPlano)
    toastStore.showToast('Reporte copiado como texto plano.', 'success')
    console.log('handleCopiarTextoPlano: Copiado exitoso.');
  } catch (error) {
    console.error('handleCopiarTextoPlano: Error al copiar el reporte (texto plano):', error)
    toastStore.showToast('Error al copiar el reporte como texto plano.', 'error')
  }
}

const handleCopiarHtmlEmail = async () => {
  console.log('handleCopiarHtmlEmail: Botón "Copiar HTML para Email" clickeado.');
  try {
    const htmlContent = generarHTMLReporteCompleto(props.reporteData)
    const textContent = generarTextoPlanoCompleto(props.reporteData)
    
    await copyHtmlToClipboard(htmlContent, textContent)
    toastStore.showToast('Reporte copiado como HTML enriquecido para email.', 'success')
    console.log('handleCopiarHtmlEmail: Copiado HTML exitoso.');
  } catch (error) {
    console.error('handleCopiarHtmlEmail: Error al copiar el reporte (HTML):', error)
    toastStore.showToast('Error al copiar el reporte como HTML.', 'error')
  }
}

const handleAbrirMailCliente = () => {
  console.log('handleAbrirMailCliente: Botón "Abrir Mail Cliente" clickeado.');
  const datos = props.reporteData
  if (datos.email_cliente) {
    const textoPlano = generarTextoPlanoCompleto(datos)
    const asunto = `Reporte Cirugía: ${datos.cliente} - ${datos.paciente}`
    const mailtoLink = `mailto:${datos.email_cliente}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoPlano)}`
    
    toastStore.showToast('Abriendo cliente de correo. Verifique los datos.', 'info') 
    window.location.href = mailtoLink
    console.log('handleAbrirMailCliente: Mailto abierto.');
  } else {
    toastStore.showToast('Este cliente no tiene un email registrado para enviar.', 'warning')
    console.log('handleAbrirMailCliente: Cliente sin email.');
  }
}
</script>

<style scoped>
/* Animación para el drawer */
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
