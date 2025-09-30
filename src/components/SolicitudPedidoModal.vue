<!-- src/components/SolicitudPedidoModal.vue -->
<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Solicitar Pedido de Material"
  >
    <template #body>
<<<<<<< HEAD
      <!-- Mostramos la información clave del reporte principal para el contexto -->
      <div class="text-sm bg-blue-50 p-3 rounded-md mb-4 border border-blue-200">
        <p><span class="font-semibold">Cliente (ART/Aseguradora):</span> {{ formStore.formState.cliente || 'N/E' }}</p>
        <p><span class="font-semibold">Institución (Lugar de Cirugía):</span> {{ formStore.formState.lugar_cirugia || 'N/E' }}</p>
        <p><span class="font-semibold">Paciente:</span> {{ formStore.formState.paciente || 'N/E' }}</p>
      </div>

      <p class="text-sm text-gray-600 mb-4">
        Añada los materiales que necesita solicitar. **Esta lista debe ser llenada con lo que se requiere pedir a DistriTrack, NO es una copia del reporte.**
=======
      <p class="text-sm text-gray-600 mb-4">
        Añada los materiales que necesita solicitar. La información del paciente, médico y cliente se tomará del formulario principal.
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
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
<<<<<<< HEAD
import { ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import { useFormStore } from '../stores/formStore' 

const formStore = useFormStore()

const props = defineProps({
=======
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

defineProps({
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
  modelValue: { type: Boolean, required: true }
})
const emit = defineEmits(['update:modelValue', 'confirmar-pedido'])

// Estado local para la lista de materiales y el formulario de añadir.
<<<<<<< HEAD
// La lista se mantiene vacía al inicio.
const materialesSolicitados = ref([])
const nuevoMaterial = ref({ description: '', quantity: 1 })

// Eliminamos la función precargarMateriales

// Observamos 'modelValue' para limpiar la lista CADA VEZ que se abre
watch(() => props.modelValue, (isOpening) => {
    if (isOpening) {
        // CORRECCIÓN: Limpiamos la lista al abrir para forzar un nuevo input de pedido.
        materialesSolicitados.value = [];
    }
});


=======
const materialesSolicitados = ref([])
const nuevoMaterial = ref({ description: '', quantity: 1 })

>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
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
<<<<<<< HEAD
    alert('Debe añadir al menos un material a la lista de pedido.')
=======
    alert('Debe añadir al menos un material a la lista.')
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
    return
  }
  // Emitir la lista de materiales al componente padre.
  emit('confirmar-pedido', materialesSolicitados.value)
  emit('update:modelValue', false)
}
</script>