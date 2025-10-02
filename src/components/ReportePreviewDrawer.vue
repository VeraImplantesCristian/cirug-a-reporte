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
              v-if="reporteData.email_cliente"
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
import { useReportGenerator } from '../composables/useReportGenerator'


// Definimos props
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  reporteData: { type: Object, default: () => ({}) }
})

defineEmits(['update:modelValue'])

const toastStore = useToastStore()
// Inicializamos el composable para acceder a las funciones de generación
const { generarTextoPlano, generarHTMLReporte } = useReportGenerator() 


// --- COMPUTED que usa el Composable (CORREGIDO) ---
// El getter debe ser una función simple.
const formattedReportHTML = computed(() => {
    // Registramos que se está generando el HTML
    console.log('PreviewDrawer: Generando HTML para el reporte.'); 
    // LLAMAMOS AL COMPOSABLE para obtener el HTML con los datos de los props
    return generarHTMLReporte(props.reporteData.email_cliente);
});


// --- FUNCIONES DE ACCIÓN PARA COPIAR Y ENVIAR ---

const handleCopiarTextoPlano = async () => {
  console.log('PreviewDrawer: Copiando Texto Plano...');
  try {
    // Usamos el composable
    const textoPlano = generarTextoPlano(props.reporteData.email_cliente)
    await navigator.clipboard.writeText(textoPlano)
    toastStore.showToast('Reporte copiado como texto plano.', 'success')
  } catch (error) {
    console.error('Error al copiar el texto plano:', error);
    toastStore.showToast('Error al copiar el reporte.', 'error')
  }
}

const handleCopiarHtmlEmail = async () => {
  console.log('PreviewDrawer: Copiando HTML...');
  try {
    // Usamos el composable
    const htmlContent = generarHTMLReporte(props.reporteData.email_cliente)
    const textContent = generarTextoPlano(props.reporteData.email_cliente)
    
    await copyHtmlToClipboard(htmlContent, textContent)
    toastStore.showToast('Reporte copiado como HTML para email.', 'success')
  } catch (error) {
    console.error('Error al copiar el HTML:', error);
    toastStore.showToast('Error al copiar el reporte como HTML.', 'error')
  }
}

const handleAbrirMailCliente = () => {
  console.log('PreviewDrawer: Abriendo Mail Cliente...');
  const datos = props.reporteData
  if (datos.email_cliente) {
    // Usamos el composable
    const textoPlano = generarTextoPlano(datos.email_cliente)
    const asunto = `Reporte Cirugía: ${datos.cliente} - ${datos.paciente}`
    const mailtoLink = `mailto:${datos.email_cliente}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoPlano)}`
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
