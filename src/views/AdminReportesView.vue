<!-- src/views/AdminReportesView.vue -->
<template>
  <div class="container max-w-7xl mx-auto p-4 md:p-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Panel de Administración de Reportes</h1>
      <p class="text-gray-600">Visualiza, busca y filtra todos los reportes históricos.</p>
    </header>

    <!-- Futura sección para filtros -->
    <div class="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <p class="text-center text-gray-500">-- Próximamente: Filtros de búsqueda y fecha --</p>
    </div>

    <!-- Indicador de Carga -->
    <div v-if="store.isLoading" class="text-center py-10">
      <p class="text-lg text-gray-600">Cargando reportes...</p>
    </div>

    <!-- Tabla de Reportes -->
    <div v-else class="bg-white rounded-lg shadow-md border overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-700">
        <thead class="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3">Fecha Cirugía</th>
            <th scope="col" class="px-6 py-3">Cliente</th>
            <th scope="col" class="px-6 py-3">Paciente</th>
            <th scope="col" class="px-6 py-3">Médico</th>
            <th scope="col" class="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="reportes.length === 0">
            <td colspan="5" class="text-center py-10 text-gray-500">No se encontraron reportes.</td>
          </tr>
          <tr v-for="reporte in reportes" :key="reporte.id" class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4">{{ formatearFecha(reporte.fecha_cirugia) }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ reporte.cliente }}</td>
            <td class="px-6 py-4">{{ reporte.paciente }}</td>
            <td class="px-6 py-4">{{ reporte.medico }}</td>
            <td class="px-6 py-4">
              <button class="font-medium text-blue-600 hover:underline">Ver Detalles</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useReportesAdminStore } from '../stores/reportesAdminStore'

// Instanciamos el store.
const store = useReportesAdminStore()

// Creamos una propiedad computada para acceder a la lista de reportes.
// Esto asegura que la vista se actualice automáticamente cuando los datos cambien.
const reportes = computed(() => store.reportes)

// Cuando el componente se monta, llamamos a la acción para cargar los datos.
onMounted(() => {
  store.fetchReportes()
})

// Función auxiliar para formatear la fecha en un formato legible.
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'N/A'
  const [year, month, day] = fechaISO.split('-')
  return `${day}/${month}/${year}`
}
</script>