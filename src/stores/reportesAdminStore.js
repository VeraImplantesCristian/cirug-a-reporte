// src/stores/reportesAdminStore.js

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue' // Importamos 'reactive' para los filtros
import { supabase } from '../supabase'

export const useReportesAdminStore = defineStore('reportesAdmin', () => {
  // --- STATE ---
  const reportes = ref([])
  const isLoading = ref(false)

  // --- ESTADO PARA FILTROS Y PAGINACIÓN ---
  const filters = reactive({
    searchTerm: '', // Búsqueda general por cliente, paciente, médico
    fechaDesde: '',
    fechaHasta: '',
    clienteFiltro: '',
    medicoFiltro: '',
  })
  const currentPage = ref(1)
  const rowsPerPage = ref(10) // 10 reportes por página
  const totalReports = ref(0)

  // --- ESTADO PARA OPCIONES DE FILTRO (para selectores dinámicos) ---
  const availableClients = ref([])
  const availableDoctors = ref([])
  const availableTypes = ref([])

  // --- GETTERS (PROPIEDADES COMPUTADAS) ---
  const totalPages = computed(() => Math.ceil(totalReports.value / rowsPerPage.value))

  // --- ACTIONS ---

  // Acción para obtener opciones únicas para los filtros (clientes, médicos, tipos)
  const fetchFilterOptions = async () => {
    try {
      // Optenemos todos los reportes para extraer las opciones únicas
      const { data, error } = await supabase
        .from('reportes')
        .select('cliente, medico, tipo_cirugia');

      if (error) throw error;

      // Extraemos y ordenamos valores únicos
      availableClients.value = [...new Set(data.map(r => r.cliente).filter(Boolean))].sort();
      availableDoctors.value = [...new Set(data.map(r => r.medico).filter(Boolean))].sort();
      availableTypes.value = [...new Set(data.map(r => r.tipo_cirugia).filter(Boolean))].sort();

    } catch (error) {
      console.error('Error fetching filter options:', error.message);
      availableClients.value = [];
      availableDoctors.value = [];
      availableTypes.value = [];
    }
  }


  // Acción principal para obtener los reportes con filtros y paginación
  const fetchReportes = async () => {
    isLoading.value = true
    try {
      let query = supabase.from('reportes').select('*', { count: 'exact' })

      // Aplicar filtros
      if (filters.searchTerm) {
        // Búsqueda insensible a mayúsculas/minúsculas y parcial (ilike)
        query = query.or(
          `cliente.ilike.%${filters.searchTerm}%,paciente.ilike.%${filters.searchTerm}%,medico.ilike.%${filters.searchTerm}%`
        )
      }
      if (filters.fechaDesde) {
        query = query.gte('fecha_cirugia', filters.fechaDesde)
      }
      if (filters.fechaHasta) {
        query = query.lte('fecha_cirugia', filters.fechaHasta)
      }
      if (filters.clienteFiltro) {
        query = query.eq('cliente', filters.clienteFiltro)
      }
      if (filters.medicoFiltro) {
        query = query.eq('medico', filters.medicoFiltro)
      }

      // Ordenar y paginar
      const from = (currentPage.value - 1) * rowsPerPage.value
      const to = from + rowsPerPage.value - 1

      query = query
        .order('fecha_cirugia', { ascending: false }) // Ordenar por fecha de cirugía (más reciente primero)
        .order('created_at', { ascending: false }) // Desempate por fecha de creación
        .range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      reportes.value = data
      totalReports.value = count || 0 // Asegurar que count no sea null
    } catch (error) {
      console.error('Error al obtener los reportes:', error.message)
      reportes.value = []
      totalReports.value = 0
    } finally {
      isLoading.value = false
    }
  }

  // Acción para cambiar de página
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
      fetchReportes() // Volver a cargar con la nueva página
    }
  }

  // Acción para volver a la página anterior
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
      fetchReportes() // Volver a cargar con la nueva página
    }
  }

  // Acción para resetear todos los filtros
  const resetFilters = () => {
    filters.searchTerm = ''
    filters.fechaDesde = ''
    filters.fechaHasta = ''
    filters.clienteFiltro = ''
    filters.medicoFiltro = ''
    currentPage.value = 1 // Volver a la primera página al resetear
    fetchReportes()
  }

  // Exponemos todo lo necesario
  return {
    reportes,
    isLoading,
    filters,
    currentPage,
    rowsPerPage,
    totalReports,
    totalPages,
    availableClients,
    availableDoctors,
    availableTypes,
    fetchReportes,
    fetchFilterOptions,
    nextPage,
    prevPage,
    resetFilters,
  }
})