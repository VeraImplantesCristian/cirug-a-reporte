<!-- src/components/MaterialesModal.vue -->
<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Seleccionar Materiales"
  >
    <template #body>
      <!-- Campo de búsqueda -->
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Buscar por código o descripción..."
        class="w-full p-2 border border-gray-300 rounded-md mb-4 sticky top-0 bg-white"
      />

      <!-- Lista de materiales agrupados por categoría -->
      <div class="space-y-4">
        <div v-for="(materiales, categoria) in filteredMateriales" :key="categoria">
          <h4 class="font-semibold text-blue-700 border-b pb-1 mb-2">{{ categoria }}</h4>
          <ul class="space-y-2">
            <li v-for="material in materiales" :key="material.code">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  :value="material"
                  @change="toggleSelection(material)"
                  class="h-4 w-4"
                />
                <span>
                  <span class="font-mono text-sm text-gray-600">{{ material.code }}</span> -
                  <span class="text-gray-800">{{ material.description }}</span>
                </span>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <template #footer>
      <!-- Botones del pie del modal -->
      <button @click="$emit('update:modelValue', false)" class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
        Cancelar
      </button>
      <button @click="handleConfirm" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
        Añadir Seleccionados
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import { useMaterialesStore } from '../stores/materialesStore'

// Definimos las props y emits del componente.
defineProps({
  modelValue: { type: Boolean, required: true }
})
const emit = defineEmits(['update:modelValue', 'confirmar'])

// Instanciamos el store para acceder a los materiales.
const materialesStore = useMaterialesStore()

// --- ESTADO LOCAL ---
const searchTerm = ref('')
// Usamos un Set para guardar los objetos de material seleccionados, es más eficiente.
const selectedMaterials = ref(new Set())

// --- LÓGICA DE FILTRADO ---
// Propiedad computada que filtra los materiales según el término de búsqueda.
const filteredMateriales = computed(() => {
  const term = searchTerm.value.toLowerCase()
  if (!term) return materialesStore.materiales // Si no hay búsqueda, devuelve todo.

  const resultado = {}
  for (const categoria in materialesStore.materiales) {
    const materialesFiltrados = materialesStore.materiales[categoria].filter(
      m => m.code.toLowerCase().includes(term) || m.description.toLowerCase().includes(term)
    )
    if (materialesFiltrados.length > 0) {
      resultado[categoria] = materialesFiltrados
    }
  }
  return resultado
})

// --- MANEJO DE SELECCIÓN ---
// Añade o quita un material del Set de seleccionados.
const toggleSelection = (material) => {
  if (selectedMaterials.value.has(material)) {
    selectedMaterials.value.delete(material)
  } else {
    selectedMaterials.value.add(material)
  }
}

// --- ACCIÓN DE CONFIRMACIÓN ---
// Se ejecuta al hacer clic en "Añadir Seleccionados".
const handleConfirm = () => {
  // Convierte el Set de objetos a un string formateado.
  const textoMateriales = Array.from(selectedMaterials.value)
    .map(m => `${m.code} - ${m.description}`)
    .join('\n')
  
  // Emite el evento 'confirmar' con el texto generado.
  emit('confirmar', textoMateriales)
  // Cierra el modal.
  emit('update:modelValue', false)
  // Limpia la selección para la próxima vez que se abra.
  selectedMaterials.value.clear()
  searchTerm.value = ''
}
</script>