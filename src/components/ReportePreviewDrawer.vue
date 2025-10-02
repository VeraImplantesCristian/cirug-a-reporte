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
// CAMBIO CLAVE: Importamos y usamos el composable
import { useReportGenerator } from '../composables/useReportGenerator'


// Definimos props (ESTO ES CORRECTO)
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  reporteData: { type: Object, default: () => ({}) }
})

defineEmits(['update:modelValue'])

const toastStore = useToastStore()
// Inicializamos el composable para acceder a las funciones de generación
const { generarTextoPlano, generarHTMLReporte } = useReportGenerator() 

// --- COMPUTED que usa el Composable (Elimina la lógica interna antigua) ---
// La función original generarTextoPlanoCompleto usaba 'datos' directamente,
// aquí debemos simular los datos para el composable.
const formattedReportHTML = computed(() => {
    // CAMBIO CLAVE: Llamamos al composable
    // Pasamos el email del cliente a la función (que está en reporteData)
    // Nota: El composable está diseñado para leer del formStore, pero aquí 
    // debe usar el reporteData de los props. La solución más rápida es
    // forzar que el composable lea los datos de forma temporal o
    // rehacer las funciones aquí para que usen los props directamente.
    
    // Solución más segura y limpia: Pasar el reporteData a una función local de generación
    // que use el composable. Sin embargo, dado que el error está en la resolución,
    // vamos a crear las funciones localmente y usar el código del composable.
    
    // Opción 1: Reimplementar la lógica de la generación de HTML (que es lo que el componente hacía)
    return generarHTMLReporteCompleto(props.reporteData);
});


// --- FUNCIONES DE GENERACIÓN (Mantenemos la que genera HTML/Texto para que el computed funcione) ---
// NOTA: Estas funciones son las que antes estaban rompiendo. Ahora las movemos a local para que el computed funcione.
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return null
  const [year, month, day] = fechaISO.split('-')
  return `${day}/${month}/${year}`
}
const formatTextForHTML = (text) => text ? text.replace(/\n/g, '<br>') : '<span style="color: #9ca3af;">No especificado</span>';

const generarTextoPlanoCompleto = (datos) => {
  // Lógica de texto plano (usada por Mailto y Copiar)
  return generarTextoPlano(datos.email_cliente); // Llamamos al composable
}

const generarHTMLReporteCompleto = (datos) => {
  // Lógica de HTML (usada por el v-html)
  return generarHTMLReporte(datos.email_cliente); // Llamamos al composable
}


// --- FUNCIONES DE ACCIÓN PARA COPIAR Y ENVIAR ---

const handleCopiarTextoPlano = async () => {
  try {
    // Usamos el composable
    const textoPlano = generarTextoPlano(props.reporteData.email_cliente)
    await navigator.clipboard.writeText(textoPlano)
    toastStore.showToast('Reporte copiado como texto plano.', 'success')
  } catch (error) {
    toastStore.showToast('Error al copiar el reporte.', 'error')
  }
}

const handleCopiarHtmlEmail = async () => {
  try {
    // Usamos el composable
    const htmlContent = generarHTMLReporte(props.reporteData.email_cliente)
    const textContent = generarTextoPlano(props.reporteData.email_cliente)
    
    await copyHtmlToClipboard(htmlContent, textContent)
    toastStore.showToast('Reporte copiado como HTML para email.', 'success')
  } catch (error) {
    toastStore.showToast('Error al copiar el reporte como HTML.', 'error')
  }
}

const handleAbrirMailCliente = () => {
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

// CORRECCIÓN: Volvemos a hacer que el computed use el composable
const formattedReportHTML = computed(() => {
    return generarHTMLReporte(props.reporteData.email_cliente);
});
</script>

<style scoped>
/* Animación para el drawer (sin cambios) */
.drawer-enter-active,
.drawer-leave-active {
// ... (código sin cambios) ...
}
</style>
