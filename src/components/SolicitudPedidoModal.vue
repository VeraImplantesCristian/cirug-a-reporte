<!-- src/components/SolicitudPedidoModal.vue -->
<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Solicitar Pedido de Material"
  >
    <template #body>
      <p class="text-sm text-gray-600 mb-4">
        Añada los materiales que necesita solicitar. La información del paciente, médico y cliente se tomará del formulario principal.
      </p>
      
      <!-- Formulario para añadir un nuevo material a la solicitud -->
      <form @submit.prevent="agregarMaterial" class="flex items-center gap-2 mb-4">
        <input
          v-model="nuevoMaterial.description"
          type="text"
          placeholder="Descripción del material"
          required
          class="flex-grow p-2 border rounded-md"
        />
        <input
          v-model.number="nuevoMaterial.quantity"
          type="number"
          min="1"
          required
          class="w-20 p-2 border rounded-md"
        />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">➕</button>
      </form>

      <!-- Tabla con los materiales solicitados -->
      <div class="border rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="p-2 text-left font-medium text-gray-600">Material</th>
              <th class="p-2 text-center font-medium text-gray-600 w-24">Cantidad</th>
              <th class="p-2 text-center font-medium text-gray-600 w-24">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="materialesSolicitados.length === 0">
              <td colspan="3" class="p-4 text-center text-gray-500">No hay materiales añadidos.</td>
            </tr>
            <tr v-for="(item, index) in materialesSolicitados" :key="index" class="border-t">
              <td class="p-2">{{ item.description }}</td>
              <td class="p-2 text-center">{{ item.quantity }}</td>
              <td class="p-2 text-center">
                <button @click="eliminarMaterial(index)" class="text-red-500 hover:text-red-700">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template #footer>
      <button @click="$emit('update:modelValue', false)" class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
        Cancelar
      </button>
      <button @click="handleConfirmar" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
        Enviar Email y Crear Pedido
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

defineProps({
  modelValue: { type: Boolean, required: true }
})
const emit = defineEmits(['update:modelValue', 'confirmar-pedido'])

// Estado local para la lista de materiales y el formulario de añadir.
const materialesSolicitados = ref([])
const nuevoMaterial = ref({ description: '', quantity: 1 })

const agregarMaterial = () => {
  if (nuevoMaterial.value.description.trim() && nuevoMaterial.value.quantity > 0) {
    materialesSolicitados.value.push({ ...nuevoMaterial.value })
    // Resetear formulario
    nuevoMaterial.value.description = ''
    nuevoMaterial.value.quantity = 1
  }
}

const eliminarMaterial = (index) => {
  materialesSolicitados.value.splice(index, 1)
}

const handleConfirmar = () => {
  if (materialesSolicitados.value.length === 0) {
    alert('Debe añadir al menos un material a la lista.')
    return
  }
  // Emitir la lista de materiales al componente padre.
  emit('confirmar-pedido', materialesSolicitados.value)
  emit('update:modelValue', false)
}
</script>