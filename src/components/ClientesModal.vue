<!-- src/components/ClientesModal.vue -->
<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Seleccionar Cliente"
  >
    <template #body>
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Buscar cliente..."
        class="w-full p-2 border border-gray-300 rounded-md mb-4 sticky top-0 bg-white"
      />

      <ul class="space-y-1">
        <!-- CAMBIO CLAVE: Iteramos sobre allClients -->
        <li v-for="cliente in filteredClientes" :key="cliente.id">
          <div
            @click="handleSelect(cliente)"
            class="p-2 rounded-md cursor-pointer hover:bg-blue-100 text-gray-800"
          >
            {{ cliente.nombre }}
            <span v-if="cliente.email" class="text-xs text-gray-500 ml-2">({{ cliente.email }})</span>
          </div>
        </li>
      </ul>
    </template>

    <template #footer>
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

defineProps({
  modelValue: { type: Boolean, required: true }
})
const emit = defineEmits(['update:modelValue', 'confirmar'])

const clientesStore = useClientesStore()
const searchTerm = ref('')

const filteredClientes = computed(() => {
  const term = searchTerm.value.toLowerCase()
  // CAMBIO CLAVE: Filtramos sobre allClients
  if (!term) return clientesStore.allClients 

  return clientesStore.allClients.filter(
    cliente => cliente.nombre.toLowerCase().includes(term) || (cliente.email && cliente.email.toLowerCase().includes(term))
  )
})

const handleSelect = (cliente) => {
  emit('confirmar', cliente.nombre)
  emit('update:modelValue', false)
  searchTerm.value = '' // Limpiamos el término de búsqueda al seleccionar
}
</script>