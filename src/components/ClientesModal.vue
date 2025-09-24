<!-- src/components/ClientesModal.vue -->
<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Seleccionar Cliente"
  >
    <template #body>
      <!-- Campo de búsqueda -->
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Buscar cliente..."
        class="w-full p-2 border border-gray-300 rounded-md mb-4 sticky top-0 bg-white"
      />

      <!-- Lista de clientes -->
      <ul class="space-y-1">
        <!-- Iteramos sobre la lista filtrada de clientes -->
        <li v-for="cliente in filteredClientes" :key="cliente.id">
          <!-- Al hacer clic, se selecciona el cliente y se cierra el modal -->
          <div
            @click="handleSelect(cliente)"
            class="p-2 rounded-md cursor-pointer hover:bg-blue-100 text-gray-800"
          >
            {{ cliente.nombre }}
          </div>
        </li>
      </ul>
    </template>

    <template #footer>
      <!-- Botón para cerrar el modal sin seleccionar nada -->
      <button @click="$emit('update:modelValue', false)" class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
        Cancelar
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import { useClientesStore } from '../stores/clientesStore'

// Definimos las props y emits del componente.
defineProps({
  modelValue: { type: Boolean, required: true }
})
const emit = defineEmits(['update:modelValue', 'confirmar'])

// Instanciamos el store para acceder a la lista de clientes.
const clientesStore = useClientesStore()

// --- ESTADO LOCAL ---
const searchTerm = ref('')

// --- LÓGICA DE FILTRADO ---
// Propiedad computada que filtra la lista de clientes.
const filteredClientes = computed(() => {
  const term = searchTerm.value.toLowerCase()
  if (!term) return clientesStore.clientes

  return clientesStore.clientes.filter(
    cliente => cliente.nombre.toLowerCase().includes(term)
  )
})

// --- ACCIÓN DE SELECCIÓN ---
// Se ejecuta al hacer clic en un cliente de la lista.
const handleSelect = (cliente) => {
  // Emite el evento 'confirmar' con el nombre del cliente.
  emit('confirmar', cliente.nombre)
  // Cierra el modal.
  emit('update:modelValue', false)
}
</script>