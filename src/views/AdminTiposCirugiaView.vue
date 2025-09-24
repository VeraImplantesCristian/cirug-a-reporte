<!-- src/views/AdminTiposCirugiaView.vue -->
<template>
  <!-- Contenedor principal con padding y centrado -->
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Gestión de Tipos de Cirugía</h1>

    <!-- Formulario para añadir un nuevo tipo de cirugía -->
    <form @submit.prevent="handleSubmit" class="mb-8 flex items-center gap-4">
      <input
        type="text"
        v-model="nuevoTipoCirugiaNombre"
        placeholder="Nombre del tipo de cirugía"
        required
        class="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Añadir Tipo
      </button>
    </form>

    <!-- Lista de tipos de cirugía existentes -->
    <ul class="space-y-3">
      <!-- Iteramos sobre el array 'tiposCirugia' del store -->
      <li
        v-for="tipo in tiposCirugiaStore.tiposCirugia"
        :key="tipo.id"
        class="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <span class="text-gray-700">{{ tipo.nombre }}</span>
        <button
          @click="handleDelete(tipo.id)"
          class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
        >
          Eliminar
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
// --- LÓGICA DEL COMPONENTE ---

import { ref, onMounted } from 'vue'
import { useTiposCirugiaStore } from '../stores/tiposCirugiaStore'

// Instanciamos el store de tipos de cirugía.
const tiposCirugiaStore = useTiposCirugiaStore()

// Variable reactiva para el input del formulario.
const nuevoTipoCirugiaNombre = ref('')

// Al montar el componente, cargamos los datos iniciales.
onMounted(() => {
  tiposCirugiaStore.fetchTiposCirugia()
})

// Función para manejar el envío del formulario.
const handleSubmit = () => {
  if (nuevoTipoCirugiaNombre.value.trim() === '') return

  // Llamamos a la acción del store para añadir el nuevo registro.
  tiposCirugiaStore.addTipoCirugia({ nombre: nuevoTipoCirugiaNombre.value })

  // Limpiamos el input.
  nuevoTipoCirugiaNombre.value = ''
}

// Función para manejar la eliminación.
const handleDelete = (idTipoCirugia) => {
  if (confirm('¿Estás seguro de que quieres eliminar este tipo de cirugía?')) {
    // Llamamos a la acción del store para eliminar el registro.
    tiposCirugiaStore.deleteTipoCirugia(idTipoCirugia)
  }
}
</script>