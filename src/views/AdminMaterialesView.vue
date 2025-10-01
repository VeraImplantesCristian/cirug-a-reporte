<!-- src/views/AdminMaterialesView.vue -->
<template>
  <!-- Contenedor principal con padding y centrado -->
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Gestión de Materiales</h1>

    <!-- Formulario para añadir un nuevo material -->
    <form @submit.prevent="handleSubmit" class="mb-8 p-4 bg-gray-50 rounded-lg border">
      <h3 class="text-lg font-semibold mb-3">Añadir Nuevo Material</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          class="md:col-span-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

    <!-- Barra de Búsqueda y Resultados -->
    <div class="mb-6 p-4 bg-white rounded-lg shadow-md border">
        <h3 class="text-lg font-semibold mb-3">Buscar Materiales</h3>
        <input
            type="text"
            v-model="materialesStore.searchQuery"
            placeholder="Buscar por Código, Descripción o Categoría..."
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <p class="text-sm text-gray-600 mt-2">
            Mostrando {{ materialesStore.totalMateriales }} materiales que coinciden con la búsqueda.
        </p>
    </div>

    <!-- Indicador de Carga -->
    <div v-if="materialesStore.loading" class="text-center py-10 text-xl text-gray-500">
      Cargando listado de materiales...
    </div>
    
    <!-- Contenido Principal: Lista de materiales agrupados -->
    <div v-else>
        <!-- Iteración sobre las categorías -->
        <div v-for="(materiales, categoria) in materialesStore.materialesAgrupados" :key="categoria">
            <h2 class="text-xl font-bold mt-6 mb-3 text-gray-700">{{ categoria }} ({{ materiales.length }})</h2>
            <ul class="space-y-3">
              <!-- Iteración sobre los materiales de CADA categoría -->
              <li
                v-for="material in materiales"
                :key="material.id"
                class="grid grid-cols-4 gap-4 items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <span class="text-gray-600 font-mono text-sm">{{ material.code }}</span>
                <span class="col-span-2 text-gray-800">{{ material.description }}</span>
                <div class="flex items-center justify-end gap-2">
                  <span class="text-xs text-gray-700 px-2 py-1 rounded-full">ID: {{ material.id }}</span>
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
        
        <!-- Mensaje si no hay resultados -->
        <div v-if="materialesStore.totalMateriales === 0" class="text-center py-10 text-gray-50-500 bg-white rounded-lg shadow-md border">
            No hay materiales registrados o no hay coincidencias con la búsqueda.
        </div>
    </div>


    <!-- Controles de Paginación -->
    <div v-if="materialesStore.totalPaginas > 1" class="flex justify-between items-center mt-6">
      <span class="text-sm text-gray-600">
        Página {{ materialesStore.currentPage }} de {{ materialesStore.totalPaginas }}
      </span>
      <div class="flex gap-2">
        <button 
            @click="materialesStore.currentPage--" 
            :disabled="materialesStore.currentPage === 1" 
            class="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Anterior
        </button>
        <button 
            @click="materialesStore.currentPage++" 
            :disabled="materialesStore.currentPage === materialesStore.totalPaginas" 
            class="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMaterialesStore } from '../stores/materialesStore'

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
  if (nuevoMaterial.value.description.trim() === '') return

  // Llamamos a la acción 'saveMaterial' del store, que maneja añadir o editar.
  materialesStore.saveMaterial(nuevoMaterial.value)

  // Reseteamos el objeto del formulario para limpiar los inputs.
  nuevoMaterial.value = { code: '', description: '', categoria: '' }
}

// Función para manejar la eliminación de un material.
const handleDelete = (idMaterial) => {
  if (confirm('¿Estás seguro de que quieres eliminar este material?')) {
    materialesStore.deleteMaterial(idMaterial)
  }
}
</script>