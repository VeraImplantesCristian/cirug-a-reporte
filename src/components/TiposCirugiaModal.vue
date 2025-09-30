<!-- src/components/TiposCirugiaModal.vue -->
<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Seleccionar Tipo de Cirugía"
  >
    <template #body>
      <!-- Campo de búsqueda -->
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Buscar tipo de cirugía..."
        class="w-full p-2 border border-gray-300 rounded-md mb-4 sticky top-0 bg-white"
      />

      <!-- Lista de tipos de cirugía -->
      <ul class="space-y-1">
        <!-- Iteramos sobre la lista filtrada -->
        <li v-for="tipo in filteredTiposCirugia" :key="tipo.id">
          <!-- Al hacer clic, llamamos a handleSelect para confirmar y cerrar -->
          <div
            @click="handleSelect(tipo)"
            class="p-2 rounded-md cursor-pointer hover:bg-blue-100 text-gray-800"
          >
            {{ tipo.nombre }}
          </div>
        </li>
      </ul>
    </template>

    <template #footer>
      <!-- Solo necesitamos un botón para cancelar, ya que la selección es directa -->
      <button @click="$emit('update:modelValue', false)" class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
        Cancelar
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import { useTiposCirugiaStore } from '../stores/tiposCirugiaStore'

// Definimos las props y emits del componente.
defineProps({
  modelValue: { type: Boolean, required: true }
})
const emit = defineEmits(['update:modelValue', 'confirmar'])

// Instanciamos el store para acceder a los tipos de cirugía.
const tiposCirugiaStore = useTiposCirugiaStore()

// --- ESTADO LOCAL ---
const searchTerm = ref('')

// --- LÓGICA DE FILTRADO ---
// Propiedad computada que filtra la lista.
const filteredTiposCirugia = computed(() => {
  const term = searchTerm.value.toLowerCase()
  if (!term) return tiposCirugiaStore.tiposCirugia

  return tiposCirugiaStore.tiposCirugia.filter(
    tipo => tipo.nombre.toLowerCase().includes(term)
  )
})

// --- ACCIÓN DE SELECCIÓN ---
// Se ejecuta al hacer clic en un elemento de la lista.
const handleSelect = (tipo) => {
  // Emite el evento 'confirmar' con el nombre del tipo seleccionado.
  emit('confirmar', tipo.nombre)
  // Cierra el modal.
  emit('update:modelValue', false)
}
</script>