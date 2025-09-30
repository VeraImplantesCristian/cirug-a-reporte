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
        placeholder="Buscar cliente por nombre o email..."
        class="w-full p-2 border border-gray-300 rounded-md mb-4 sticky top-0 bg-white"
      />

      <!-- Lista de clientes -->
      <ul class="space-y-1">
        <!-- Iteramos sobre la lista filtrada de clientes -->
        <li v-for="cliente in filteredClientes" :key="cliente.id">
          <!-- Al hacer clic, se selecciona el cliente y se cierra el modal -->
          <div
            @click="handleSelect(cliente)"
            class="p-2 rounded-md cursor-pointer hover:bg-blue-100 text-gray-800 flex justify-between items-center"
          >
            <span>{{ cliente.nombre }}</span>
            <span v-if="cliente.email" class="text-xs text-gray-500 ml-2">({{ cliente.email }})</span>
          </div>
        </li>
        <li v-if="filteredClientes.length === 0" class="p-2 text-gray-500 text-center">
          No se encontraron clientes.
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

// Definimos las props que el componente puede recibir del padre.
defineProps({
  modelValue: { type: Boolean, required: true } // Controla la visibilidad con v-model
})
// Definimos los eventos que el componente puede emitir al padre.
// 'confirmar' ahora emite el objeto completo del cliente.
const emit = defineEmits(['update:modelValue', 'confirmar'])

// Instanciamos el store de clientes para acceder a la lista.
const clientesStore = useClientesStore()

// --- ESTADO LOCAL ---
const searchTerm = ref('') // Para el input de búsqueda dentro del modal

// --- LÓGICA DE FILTRADO ---
// Propiedad computada que filtra la lista de clientes en tiempo real.
const filteredClientes = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  // Si no hay término de búsqueda, devuelve *todos* los clientes cargados en allClients.
  if (!term) return clientesStore.allClients 

  // Filtra la lista completa por nombre o email.
  return clientesStore.allClients.filter(
    cliente => 
      cliente.nombre.toLowerCase().includes(term) || 
      (cliente.email && cliente.email.toLowerCase().includes(term))
  )
})

// --- ACCIÓN DE SELECCIÓN ---
/**
 * Se ejecuta cuando el usuario hace clic en un cliente de la lista.
 * Emite el objeto completo del cliente seleccionado y cierra el modal.
 * @param {Object} cliente - El objeto del cliente seleccionado.
 */
const handleSelect = (cliente) => {
  // Emitimos el objeto completo del cliente seleccionado.
  emit('confirmar', cliente) 
  // Cerramos el modal.
  emit('update:modelValue', false)
  // Limpiamos el término de búsqueda para la próxima vez que se abra el modal.
  searchTerm.value = ''
}
</script>