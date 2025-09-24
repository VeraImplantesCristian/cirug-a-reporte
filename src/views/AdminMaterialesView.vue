<!-- src/views/AdminMaterialesView.vue -->
<template>
  <!-- Contenedor principal con padding y centrado -->
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Gestión de Materiales</h1>

    <!-- Formulario para añadir un nuevo material -->
    <form @submit.prevent="handleSubmit" class="mb-8 p-4 bg-gray-50 rounded-lg border">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Input para el Código -->
        <input
          type="text"
          v-model="nuevoMaterial.code"
          placeholder="Código"
          class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <!-- Input para la Descripción (obligatorio) -->
        <input
          type="text"
          v-model="nuevoMaterial.description"
          placeholder="Descripción del material"
          required
          class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <!-- Input para la Categoría -->
        <input
          type="text"
          v-model="nuevoMaterial.categoria"
          placeholder="Categoría"
          class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        class="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Añadir Material
      </button>
    </form>

    <!-- Lista de materiales existentes -->
    <ul class="space-y-3">
      <!-- Iteramos sobre el array 'materiales' del store -->
      <li
        v-for="material in materialesStore.materiales"
        :key="material.id"
        class="grid grid-cols-4 gap-4 items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <span class="text-gray-600 font-mono text-sm">{{ material.code }}</span>
        <span class="col-span-2 text-gray-800">{{ material.description }}</span>
        <div class="flex items-center justify-end gap-2">
          <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{{ material.categoria }}</span>
          <button
            @click="handleDelete(material.id)"
            class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
// --- LÓGICA DEL COMPONENTE ---

import { ref, onMounted } from 'vue'
import { useMaterialesStore } from '../stores/materialesStore'

// Instanciamos el store de materiales.
const materialesStore = useMaterialesStore()

// Creamos un objeto reactivo para los campos del formulario.
const nuevoMaterial = ref({
  code: '',
  description: '',
  categoria: ''
})

// Cuando el componente se monta, llamamos a la acción para cargar los materiales.
onMounted(() => {
  materialesStore.fetchMateriales()
})

// Función que se ejecuta al enviar el formulario.
const handleSubmit = () => {
  // Verificación simple para asegurar que la descripción no esté vacía.
  if (nuevoMaterial.value.description.trim() === '') return

  // Llamamos a la acción 'addMaterial' del store, pasando el objeto completo.
  materialesStore.addMaterial(nuevoMaterial.value)

  // Reseteamos el objeto del formulario para limpiar los inputs.
  nuevoMaterial.value = { code: '', description: '', categoria: '' }
}

// Función para manejar la eliminación de un material.
const handleDelete = (idMaterial) => {
  if (confirm('¿Estás seguro de que quieres eliminar este material?')) {
    // Llamamos a la acción 'deleteMaterial' del store con el ID correspondiente.
    materialesStore.deleteMaterial(idMaterial)
  }
}
</script>