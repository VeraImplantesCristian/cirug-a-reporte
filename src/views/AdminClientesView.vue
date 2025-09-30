<!-- src/views/AdminClientesView.vue -->
<template>
  <div class="p-4 md:p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Gestión de Clientes</h1>

    <!-- Formulario para añadir/editar un cliente -->
    <div class="bg-white p-6 rounded-lg shadow-md border mb-8">
      <h3 class="text-lg font-semibold mb-4">{{ clienteEnEdicion ? 'Editando Cliente' : 'Añadir Nuevo Cliente' }}</h3>
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          v-model="formData.nombre"
          placeholder="Nombre del cliente"
          required
          class="md:col-span-1 p-2 border rounded-md"
        />
        <input
          type="email"
          v-model="formData.email"
          placeholder="Email (opcional)"
          class="md:col-span-1 p-2 border rounded-md"
        />
        <div class="flex gap-2">
          <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            {{ clienteEnEdicion ? 'Guardar Cambios' : 'Añadir' }}
          </button>
          <button v-if="clienteEnEdicion" @click="cancelarEdicion" type="button" class="w-full bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Tabla de clientes existentes -->
    <div class="bg-white rounded-lg shadow-md border overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-left font-semibold">Nombre</th>
            <th class="p-3 text-left font-semibold">Email</th>
            <th class="p-3 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in store.clientes" :key="cliente.id" class="border-t">
            <td class="p-3">{{ cliente.nombre }}</td>
            <td class="p-3 text-gray-600">{{ cliente.email || '-' }}</td>
            <td class="p-3 text-center space-x-2">
              <button @click="iniciarEdicion(cliente)" class="text-yellow-600 hover:underline text-xs">Editar</button>
              <button @click="handleDelete(cliente.id)" class="text-red-600 hover:underline text-xs">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Controles de Paginación -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-600">
        Mostrando {{ store.clientes.length }} de {{ store.totalClientes }} clientes
      </span>
      <div class="flex gap-2">
        <button @click="paginaAnterior" :disabled="store.currentPage === 1" class="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50">
          Anterior
        </button>
        <span class="px-3 py-1">Página {{ store.currentPage }} de {{ totalPaginas }}</span>
        <button @click="siguientePagina" :disabled="store.currentPage === totalPaginas" class="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50">
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useClientesStore } from '../stores/clientesStore'

const store = useClientesStore()

// Estado para el formulario de añadir/editar
const formData = ref({
  nombre: '',
  email: ''
})
const clienteEnEdicion = ref(null)

// Cargar la primera página de clientes al montar el componente.
onMounted(() => {
  store.fetchClientes(1)
})

// Propiedad computada para calcular el total de páginas.
const totalPaginas = computed(() => {
  return Math.ceil(store.totalClientes / store.rowsPerPage)
})

// Lógica de paginación
const siguientePagina = () => {
  if (store.currentPage < totalPaginas.value) {
    store.fetchClientes(store.currentPage + 1)
  }
}
const paginaAnterior = () => {
  if (store.currentPage > 1) {
    store.fetchClientes(store.currentPage - 1)
  }
}

// Lógica del formulario
const handleSubmit = () => {
  if (clienteEnEdicion.value) {
    // Estamos editando
    store.updateCliente(clienteEnEdicion.value.id, formData.value)
  } else {
    // Estamos añadiendo
    store.addCliente(formData.value)
  }
  cancelarEdicion() // Limpia el formulario
}

const handleDelete = (idCliente) => {
  if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
    store.deleteCliente(idCliente)
  }
}

// Lógica de edición
const iniciarEdicion = (cliente) => {
  clienteEnEdicion.value = cliente
  formData.value.nombre = cliente.nombre
  formData.value.email = cliente.email
}

const cancelarEdicion = () => {
  clienteEnEdicion.value = null
  formData.value = { nombre: '', email: '' }
}
</script>