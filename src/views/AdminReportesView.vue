<!-- src/views/AdminReportesView.vue -->
<template>
  <div class="p-4 md:p-8 max-w-7xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Panel de Administración de Reportes</h1>
      <p class="text-gray-600">Visualiza, busca y filtra todos los reportes históricos.</p>
    </header>

    <!-- Sección de Filtros -->
    <div class="bg-white p-6 rounded-lg shadow-md border mb-8 filter-card">
      <h3 class="text-lg font-semibold text-gray-800 border-b pb-3 mb-6">Filtros de Búsqueda</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
        
        <!-- Ordenar Por -->
        <div class="form-group">
          <label for="orderBy" class="block text-sm font-medium text-gray-700 mb-1">Ordenar Por</label>
          <select
            id="orderBy"
            v-model="store.filters.orderBy"
            @change="store.fetchReportes"
            class="w-full p-2 border rounded-md"
          >
            <option value="fecha_cirugia">Fecha Cirugía</option>
            <option value="created_at">Fecha Emisión/Creación</option>
            <option value="paciente">Paciente (A-Z)</option>
          </select>
        </div>

        <!-- Dirección de Orden -->
        <div class="form-group">
          <label for="orderDirection" class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <select
            id="orderDirection"
            v-model="store.filters.orderDirection"
            @change="store.fetchReportes"
            class="w-full p-2 border rounded-md"
          >
            <option value="desc">Más Reciente Primero</option>
            <option value="asc">Más Antiguo Primero</option>
          </select>
        </div>

        <!-- Búsqueda General -->
        <div class="form-group">
          <label for="searchTerm" class="block text-sm font-medium text-gray-700 mb-1">Buscar (Cliente, Paciente, Médico)</label>
          <input
            type="text"
            id="searchTerm"
            v-model="store.filters.searchTerm"
            @input="debouncedFetchReportes"
            placeholder="Escriba para buscar..."
            class="w-full p-2 border rounded-md"
          />
        </div>

        <!-- Filtro por Cliente -->
        <div class="form-group">
          <label for="clienteFiltro" class="block text-sm font-medium text-gray-700 mb-1">Filtrar por Cliente</label>
          <select
            id="clienteFiltro"
            v-model="store.filters.clienteFiltro"
            @change="store.fetchReportes"
            class="w-full p-2 border rounded-md"
          >
            <option value="">Todos los Clientes</option>
            <option v-for="cliente in store.availableClients" :key="cliente" :value="cliente">{{ cliente }}</option>
          </select>
        </div>

        <!-- Filtro por Médico -->
        <div class="form-group">
          <label for="medicoFiltro" class="block text-sm font-medium text-gray-700 mb-1">Filtrar por Médico</label>
          <select
            id="medicoFiltro"
            v-model="store.filters.medicoFiltro"
            @change="store.fetchReportes"
            class="w-full p-2 border rounded-md"
          >
            <option value="">Todos los Médicos</option>
            <option v-for="medico in store.availableDoctors" :key="medico" :value="medico">{{ medico }}</option>
          </select>
        </div>

        <!-- Fecha Desde -->
        <div class="form-group">
          <label for="fechaDesde" class="block text-sm font-medium text-gray-700 mb-1">Fecha Cirugía Desde</label>
          <input
            type="date"
            id="fechaDesde"
            v-model="store.filters.fechaDesde"
            @change="store.fetchReportes"
            class="w-full p-2 border rounded-md"
          />
        </div>

        <!-- Fecha Hasta -->
        <div class="form-group">
          <label for="fechaHasta" class="block text-sm font-medium text-gray-700 mb-1">Fecha Cirugía Hasta</label>
          <input
            type="date"
            id="fechaHasta"
            v-model="store.filters.fechaHasta"
            @change="store.fetchReportes"
            class="w-full p-2 border rounded-md"
          />
        </div>
        
        <!-- Botón Limpiar Filtros -->
        <div class="flex items-end">
          <button @click="store.resetFilters" class="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Indicador de Carga -->
    <div v-if="store.isLoading" class="text-center py-10">
      <p class="text-lg text-gray-600">Cargando reportes...</p>
      <!-- Puedes añadir un spinner aquí si quieres -->
    </div>

    <!-- Tabla de Reportes -->
    <div v-else class="bg-white rounded-lg shadow-md border overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-700">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3">Fecha Cir.</th>
            <th scope="col" class="px-6 py-3">Cliente</th>
            <th scope="col" class="px-6 py-3">Paciente</th>
            <th scope="col" class="px-6 py-3">Médico</th>
            <th scope="col" class="px-6 py-3">Fecha Envío</th>
            <th scope="col" class="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.reportes.length === 0">
            <td colspan="6" class="text-center py-10 text-gray-500">No se encontraron reportes que coincidan con los filtros.</td>
          </tr>
          <tr v-for="reporte in store.reportes" :key="reporte.id" class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4">{{ formatearFecha(reporte.fecha_cirugia) }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ reporte.cliente }}</td>
            <td class="px-6 py-4">{{ reporte.paciente }}</td>
            <td class="px-6 py-4">{{ reporte.medico }}</td>
            <td class="px-6 py-4">{{ formatearFecha(reporte.fecha_envio) }}</td>
            <td class="px-6 py-4">
              <!-- Botón para abrir el modal de detalle -->
              <button @click="abrirModalDetalle(reporte)" class="font-medium text-blue-600 hover:underline">Ver Detalles</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Controles de Paginación -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-600">
        Mostrando {{ store.reportes.length }} de {{ store.totalReports }} reportes (Página {{ store.currentPage }} de {{ store.totalPages }})
      </span>
      <div class="flex gap-2">
        <button @click="store.prevPage" :disabled="store.currentPage === 1" class="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300">
          Anterior
        </button>
        <button @click="store.nextPage" :disabled="store.currentPage === store.totalPages || store.totalPages === 0" class="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300">
          Siguiente
        </button>
      </div>
    </div>
  </div>

  <!-- TELEPORT para el Modal de Detalles -->
  <Teleport to="#modals-container">
    <ReporteDetalleModal 
      v-model="isDetalleModalVisible" 
      :reporte-data="selectedReporte"
    />
  </Teleport>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useReportesAdminStore } from '../stores/reportesAdminStore'
import { debounce } from 'lodash'; 

// Importamos el modal de detalles
import ReporteDetalleModal from '../components/ReporteDetalleModal.vue'

const store = useReportesAdminStore()

// --- ESTADO LOCAL PARA EL MODAL DE DETALLES ---
const isDetalleModalVisible = ref(false)
const selectedReporte = ref(null)

// Función auxiliar para formatear la fecha en un formato legible.
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'N/A'
  const [year, month, day] = fechaISO.split('-')
  return `${day}/${month}/${year}`
}

// Función para abrir el modal de detalles
const abrirModalDetalle = (reporte) => {
  // Cuando abrimos el modal, le pasamos una COPIA del reporte
  // para evitar modificar el objeto original si se hace alguna edición local
  selectedReporte.value = { ...reporte }; 
  isDetalleModalVisible.value = true
}

// Observar cambios en los filtros para recargar la primera página.
// Usamos watch en los filtros individuales para asegurar que se dispare el fetch
watch(() => store.filters.clienteFiltro, () => {
  store.currentPage = 1;
  store.fetchReportes();
});
watch(() => store.filters.medicoFiltro, () => {
  store.currentPage = 1;
  store.fetchReportes();
});
watch(() => store.filters.fechaDesde, () => {
  store.currentPage = 1;
  store.fetchReportes();
});
watch(() => store.filters.fechaHasta, () => {
  store.currentPage = 1;
  store.fetchReportes();
});
// Observar cambios en el ordenamiento
watch(() => store.filters.orderBy, () => {
  store.currentPage = 1;
  store.fetchReportes();
});
watch(() => store.filters.orderDirection, () => {
  store.currentPage = 1;
  store.fetchReportes();
});


// Para el campo de búsqueda general, usamos un debounce para no disparar muchas peticiones.
const debouncedFetchReportes = debounce(() => {
  store.currentPage = 1; // Siempre ir a la primera página al buscar
  store.fetchReportes();
}, 500); // Espera 500ms antes de ejecutar la búsqueda

// Cuando el componente se monta, cargamos las opciones de filtro y los reportes.
onMounted(() => {
  store.fetchFilterOptions()
  store.fetchReportes()
})
</script>

<style scoped>
/* Estilos para las tarjetas de filtro */
.filter-card .form-group label {
  font-weight: 500;
}
.filter-card input, .filter-card select {
  font-size: 0.9rem;
}
</style>
