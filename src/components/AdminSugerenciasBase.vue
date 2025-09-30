<!-- src/components/AdminSugerenciasBase.vue -->
<template>
  <div class="p-4 md:p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">
      Gestión de Sugerencias: {{ displayTypeName }}
    </h1>

    <!-- Formulario para añadir/editar una sugerencia -->
    <div class="bg-white p-6 rounded-lg shadow-md border mb-8">
      <h3 class="text-lg font-semibold mb-4">Añadir Nueva Sugerencia</h3>
      <form @submit.prevent="handleAddSugerencia" class="flex gap-4">
        <input
          type="text"
          v-model="newSugerenciaValue"
          :placeholder="`Nombre del ${displayTypeNameSingular}`"
          required
          class="flex-grow p-2 border rounded-md"
        />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          ➕ Añadir
        </button>
      </form>
    </div>

    <!-- Lista de sugerencias existentes -->
    <div class="bg-white rounded-lg shadow-md border overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left font-semibold">Sugerencia</th>
            <th class="p-3 text-center font-semibold" style="width: 150px;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sugerenciasStore.isLoading">
            <td colspan="2" class="p-3 text-center text-gray-500">Cargando sugerencias...</td>
          </tr>
          <tr v-else-if="sugerenciasStore.sugerencias.length === 0">
            <td colspan="2" class="p-3 text-center text-gray-500">No hay sugerencias para este campo.</td>
          </tr>
          <tr v-for="sugerencia in sugerenciasStore.sugerencias" :key="sugerencia.id" class="border-t">
            <td class="p-3">{{ sugerencia.valor }}</td>
            <td class="p-3 text-center space-x-2">
              <button @click="handleEditSugerencia(sugerencia)" class="text-yellow-600 hover:underline text-xs">Editar</button>
              <button @click="handleDeleteSugerencia(sugerencia)" class="text-red-600 hover:underline text-xs">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useSugerenciasGeneralesStore } from '../stores/sugerenciasGeneralesStore'
import { useToastStore } from '../stores/toastStore' // Para notificaciones

// Definimos las props que recibe el componente.
const props = defineProps({
  sugerenciaType: {
    type: String, // Ej: 'medico', 'instrumentador', 'lugar_cirugia'
    required: true
  }
})

const sugerenciasStore = useSugerenciasGeneralesStore()
const toastStore = useToastStore()

const newSugerenciaValue = ref('')

// Propiedad computada para mostrar nombres más amigables en la UI
const displayTypeName = computed(() => {
  switch (props.sugerenciaType) {
    case 'medico': return 'Médicos'
    case 'instrumentador': return 'Instrumentadores'
    case 'lugar_cirugia': return 'Nosocomios (Lugares de Cirugía)'
    default: return 'Sugerencias'
  }
})

const displayTypeNameSingular = computed(() => {
  switch (props.sugerenciaType) {
    case 'medico': return 'médico'
    case 'instrumentador': return 'instrumentador'
    case 'lugar_cirugia': return 'nosocomio'
    default: return 'sugerencia'
  }
})

// Cargar sugerencias al montar el componente o cuando cambia el tipo.
onMounted(() => {
  sugerenciasStore.fetchSugerencias(props.sugerenciaType)
})

watch(() => props.sugerenciaType, (newType) => {
  sugerenciasStore.fetchSugerencias(newType)
})

// --- MANEJADORES DE ACCIONES CRUD ---

const handleAddSugerencia = async () => {
  if (!newSugerenciaValue.value.trim()) {
    toastStore.showToast('La sugerencia no puede estar vacía.', 'warning')
    return
  }
  await sugerenciasStore.addSugerencia(props.sugerenciaType, newSugerenciaValue.value)
  newSugerenciaValue.value = ''
  toastStore.showToast('Sugerencia añadida (o ya existía).', 'success')
}

const handleEditSugerencia = async (sugerencia) => {
  const nuevoValor = prompt(`Editar sugerencia para ${displayTypeNameSingular.value}:`, sugerencia.valor)
  if (nuevoValor !== null && nuevoValor.trim() !== '' && nuevoValor.trim() !== sugerencia.valor) {
    await sugerenciasStore.updateSugerencia(sugerencia.id, nuevoValor.trim())
    toastStore.showToast('Sugerencia actualizada.', 'success')
  } else if (nuevoValor === null) {
    toastStore.showToast('Edición cancelada.', 'info')
  } else if (nuevoValor.trim() === '') {
    toastStore.showToast('El valor no puede estar vacío.', 'warning')
  }
}

const handleDeleteSugerencia = async (sugerencia) => {
  if (confirm(`¿Está seguro de que desea eliminar la sugerencia "${sugerencia.valor}"?`)) {
    await sugerenciasStore.deleteSugerencia(sugerencia.id)
    toastStore.showToast('Sugerencia eliminada.', 'success')
  } else {
    toastStore.showToast('Eliminación cancelada.', 'info')
  }
}
</script>