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
      <!-- Usamos justify-between para asegurar que los botones de acción queden a la izquierda y el de Cerrar a la derecha -->
      <div class="flex justify-between w-full"> 
        
        <!-- Grupo de Acciones (Izquierda) -->
        <div class="flex flex-col items-start gap-2">
            <div class="flex gap-2 flex-wrap">
              <!-- Botón Solicitar Pedido (NUEVO) -->
              <button @click="handleSolicitarPedido" class="bg-yellow-500 text-gray-800 px-4 py-2 rounded-md hover:bg-yellow-600 font-bold flex items-center gap-1 text-sm">
                📧 Solicitar Pedido
              </button>
              <!-- Botón para copiar el reporte como texto plano -->
              <button @click="handleCopiarTextoPlano" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-1 text-sm">
                📋 Texto Plano
              </button>
              <!-- Botón para copiar el reporte como HTML para email -->
              <button @click="handleCopiarHtmlEmail" class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-1 text-sm">
                📧 Copiar HTML
              </button>
            </div>
            
            <!-- Pequeño texto de ayuda para los botones de copiado -->
            <small class="text-gray-500 text-xs text-left">
              HTML para Gmail/Outlook web. Texto plano para WhatsApp/Mailto.
            </small>
        </div>

        <!-- Botón para cerrar el modal (Derecha) -->
        <button @click="$emit('update:modelValue', false)" class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
          Cerrar
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import { copyHtmlToClipboard } from '../utils/clipboard'
import { useToastStore } from '../stores/toastStore'
import { useFormStore } from '../stores/formStore' // Importamos el formStore

// Definimos las propiedades que este componente puede recibir de su padre.
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  reporteData: { type: Object, default: () => ({}) } // Los datos del reporte a mostrar
})

// Definimos los eventos que este componente puede emitir a su padre.
const emit = defineEmits(['update:modelValue'])

// Instanciamos los stores
const toastStore = useToastStore()
const formStore = useFormStore()


// --- FUNCIONES PARA GENERAR EL CONTENIDO DEL REPORTE (AQUÍ DEBERÍA USARSE EL COMPOSABLE) ---

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return null
  const [year, month, day] = fechaISO.split('-')
  return `${day}/${month}/${year}`
}

const formatTextForHTML = (text) => text ? text.replace(/\n/g, '<br>') : '<span style="color: #888; font-style: italic;">No especificado.</span>';

// NOTA: Estas funciones son la lógica original. En un proyecto refactorizado, llamarían al useReportGenerator.
const generarTextoPlanoCompleto = (datos) => {
  const fechaCirugiaFormateada = formatearFecha(datos.fecha_cirugia) || 'No especificada'
  const fechaEnvioFormateada = formatearFecha(datos.fecha_envio)
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

const generarHTMLReporteCompleto = (datos) => {
  const fechaCirugiaFormateada = formatearFecha(datos.fecha_cirugia) || '<span style="color: #888; font-style: italic;">No especificada.</span>'
  const fechaEnvioFormateada = formatearFecha(datos.fecha_envio)

  // Función para añadir una línea de dato a la tabla (usada por el código original)
  const dataRow = (label, value) => `
      <tr>
          <td style="font-weight: 600; padding: 4px 10px; width: 140px; color: #1f2937;">${label}:</td>
          <td style="padding: 4px 10px; color: #374151;">${value || 'N/E'}</td>
      </tr>
  `;

  // Filas de datos principales (estructura de tabla)
  const datosPrincipalesHTML = `
      ${dataRow('Cliente', datos.cliente)}
      ${dataRow('Paciente', datos.paciente)}
      ${dataRow('Médico', datos.medico)}
      ${dataRow('Instrumentador', datos.instrumentador)}
      ${dataRow('Fecha Cirugía', fechaCirugiaFormateada)}
      ${dataRow('Lugar', datos.lugar_cirugia)}
      ${dataRow('Tipo de Cirugía', datos.tipo_cirugia)}
      ${dataRow('Fecha Envío', fechaEnvioFormateada)}
      ${datos.email_cliente ? dataRow('Email Cliente', datos.email_cliente) : ''}
  `;

  // Prepara la lista de materiales (HTML)
  let materialListItems = (datos.material || '')
    .split('\n')
    .filter(l => l.trim() !== '')
    .map(l => `<li style="margin-bottom: 4px;">${l.trim()}</li>`)
    .join('');
  if (!materialListItems) materialListItems = `<li style="margin-bottom: 4px; color: #888; font-style: italic;">No especificado.</li>`;

  // Bloque de observaciones
  const observacionesHTML = datos.observaciones ? `
      <tr>
        <td colspan="2" style="font-size: 16px; font-weight: bold; padding-top: 15px; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; color: #007bff;">
          Observaciones:
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding-top: 10px; padding-bottom: 20px;">
          <p style="margin: 0; font-size: 15px; color: #555;">${formatTextForHTML(datos.observaciones)}</p>
        </td>
      </tr>
  ` : '';
  
  // Retorna el template HTML con estilos inline.
  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 25px; background-color: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="color: #333;">
        <!-- Título -->
        <tr><td colspan="2" style="text-align: center; font-size: 20px; font-weight: bold; color: #1f2937; padding-bottom: 15px;">📝 Reporte de Cirugía</td></tr>
        <tr><td colspan="2" style="padding-bottom: 15px;"><p style="margin: 0; font-size: 15px; color: #555;">${datos.mensaje_inicio || 'Detalles de la cirugía programada:'}</p></td></tr>

        <!-- Datos Principales (Tabla) -->
        ${datosPrincipalesHTML}

        <!-- Material Requerido -->
        <tr>
          <td colspan="2" style="font-size: 16px; font-weight: bold; padding-top: 15px; padding-bottom: 8px; border-bottom: 1px solid #e0e0e0; color: #007bff;">
            Material Requerido:
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top: 10px; padding-bottom: 20px;">
            <ul style="list-style: disc; margin: 0; padding-left: 20px; font-size: 15px;">${materialListItems}</ul>
          </td>
        </tr>

        <!-- Observaciones -->
        ${observacionesHTML}

        <!-- Cierre -->
        <tr><td colspan="2" style="padding-top: 25px;"><p style="margin: 0; font-size: 15px; color: #555;">Saludos, quedo al pendiente.</p></td></tr>
      </table>
    </div>
  `;
}


// Propiedad computada que se usa para renderizar el HTML en el cuerpo del modal.
const formattedReportHTML = computed(() => generarHTMLReporteCompleto(props.reporteData))


// --- FUNCIONES DE ACCIÓN PARA COPIAR ---

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

const handleCopiarHtmlEmail = async () => {
  try {
    const htmlContent = generarHTMLReporteCompleto(props.reporteData)
    const textContent = generarTextoPlanoCompleto(props.reporteData) 
    
    await copyHtmlToClipboard(htmlContent, textContent)

    toastStore.showToast('Reporte copiado como HTML enriquecido para email.', 'success')
  } catch (error) {
    console.error('Error al copiar el reporte (HTML):', error)
    toastStore.showToast('Error al copiar el reporte como HTML.', 'error')
  }
}

// --- NUEVA FUNCIÓN: Dispara el modal de solicitud de pedido ---
const handleSolicitarPedido = () => {
    // Paso 1: Cargamos los datos del reporte a la vista principal
    // NOTA: Es crucial que el objeto reporteData tenga todos los campos del formState
    // para que el formulario principal no pierda contexto (ej: id del reporte).
    formStore.formState = { ...formStore.formState, ...props.reporteData };
    
    // Paso 2: Disparamos la acción de solicitud de pedido (que abre el modal en ReporteFormView.vue)
    formStore.triggerSolicitarPedido();
    
    // Paso 3: Cerramos este modal de detalle
    emit('update:modelValue', false);
    
    toastStore.showToast('Reporte cargado en formulario. Abra "Pedido" para finalizar.', 'info');
}
</script>
