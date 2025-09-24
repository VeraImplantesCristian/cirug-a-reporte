<!-- src/components/ReportePreviewDrawer.vue -->
<template>
  <Transition name="drawer">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <!-- Fondo oscuro semitransparente que cierra el drawer al hacer clic -->
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

        <!-- Pie de página con acciones -->
        <footer class="p-4 border-t bg-gray-50 flex justify-end">
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

// Definimos las propiedades que el componente recibe del componente padre.
const props = defineProps({
  modelValue: { type: Boolean, required: true }, // Para v-model
  reporteData: { type: Object, default: () => ({}) } // Los datos del formulario
})

// Definimos los eventos que el componente puede emitir al padre.
defineEmits(['update:modelValue'])

// Función auxiliar para formatear fechas de 'YYYY-MM-DD' a 'DD/MM/YYYY'.
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return null
  const [year, month, day] = fechaISO.split('-')
  return `${day}/${month}/${year}`
}

// Propiedad computada que genera el HTML del reporte cada vez que los datos cambian.
const formattedReportHTML = computed(() => {
  const datos = props.reporteData
  // Si no hay datos de paciente, muestra un mensaje por defecto.
  if (!datos || !datos.paciente) return '<p>No hay datos para mostrar. Complete el formulario y genere la vista previa.</p>'

  const fechaCirugiaFormateada = formatearFecha(datos.fecha_cirugia) || 'No especificada'
  const fechaEnvioFormateada = formatearFecha(datos.fecha_envio)

  const formatText = (text) => text ? text.replace(/\n/g, '<br>') : 'No especificado';
  const materialHTML = (datos.material || 'No especificado').split('\n').filter(l => l.trim() !== '').map(l => `<li>${l.trim()}</li>`).join('') || '<li>No especificado</li>';

  // Construimos el HTML final usando un template string.
  return `
    <div class="reporte-box p-4 text-base font-sans">
      <h3 class="text-center text-blue-800 font-bold mb-4 text-xl">📝 Reporte de Cirugía</h3>
      
      <p class="mb-4">${datos.mensaje_inicio || 'Detalles de la cirugía programada:'}</p>

      <ul class="list-none space-y-2">
        <li><strong>Cliente:</strong> ${datos.cliente || 'No especificado'}</li>
        <!-- --- LÍNEA AÑADIDA PARA MOSTRAR EL EMAIL DEL CLIENTE --- -->
        ${datos.email_cliente ? `<li><strong>Email Cliente:</strong> ${datos.email_cliente}</li>` : ''}
        <li><strong>Paciente:</strong> ${datos.paciente || 'No especificado'}</li>
        <li><strong>Médico:</strong> ${datos.medico || 'No especificado'}</li>
        <li><strong>Instrumentador:</strong> ${datos.instrumentador || 'No especificado'}</li>
        <li><strong>Fecha de Cirugía:</strong> ${fechaCirugiaFormateada}</li>
        <li><strong>Lugar:</strong> ${datos.lugar_cirugia || 'No especificado'}</li>
        <li><strong>Tipo de Cirugía:</strong> ${datos.tipo_cirugia || 'No especificado'}</li>
        ${fechaEnvioFormateada ? `<li><strong>Fecha de Envío:</strong> ${fechaEnvioFormateada}</li>` : ''}
      </ul>

      <h4 class="font-bold mt-5 mb-2">Material Requerido:</h4>
      <ul class="list-disc list-inside pl-2">${materialHTML}</ul>
      ${datos.observaciones ? `<h4 class="font-bold mt-5 mb-2">Observaciones:</h4><p class="text-gray-700">${formatText(datos.observaciones)}</p>` : ''}
      ${datos.info_adicional ? `<h4 class="font-bold mt-5 mb-2">Info Adicional:</h4><p class="text-gray-700">${formatText(datos.info_adicional)}</p>` : ''}

      <p class="mt-5">Saludos, quedo al pendiente.</p>
    </div>
  `
})
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