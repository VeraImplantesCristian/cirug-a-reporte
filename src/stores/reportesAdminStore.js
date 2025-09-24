// src/stores/reportesAdminStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

// Definimos el store con un nombre único: 'reportesAdmin'.
export const useReportesAdminStore = defineStore('reportesAdmin', () => {
  // --- STATE ---
  // 'reportes' es una variable reactiva que contendrá la lista de todos los reportes.
  const reportes = ref([])
  // 'isLoading' nos ayudará a mostrar un indicador de carga en la interfaz.
  const isLoading = ref(false)

  // --- ACTIONS ---

  // Acción para obtener los reportes de la base de datos.
  const fetchReportes = async () => {
    // Ponemos isLoading en true al empezar la carga.
    isLoading.value = true
    try {
      // Usamos el cliente de Supabase para hacer una consulta a la tabla 'reportes'.
      // .select('*') trae todas las columnas.
      // .order('created_at', { ascending: false }) ordena del más nuevo al más viejo.
      // .limit(50) para no traer toda la base de datos de golpe, solo los últimos 50.
      const { data, error } = await supabase
        .from('reportes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      // Si hay un error en la consulta, lo lanzamos para que sea capturado por el catch.
      if (error) throw error

      // Si la consulta es exitosa, actualizamos nuestro estado con los datos.
      reportes.value = data
    } catch (error) {
      console.error('Error al obtener los reportes:', error.message)
      // En caso de error, dejamos la lista vacía.
      reportes.value = []
    } finally {
      // Al finalizar (con éxito o error), ponemos isLoading en false.
      isLoading.value = false
    }
  }

  // Exponemos el estado y las acciones para que los componentes puedan usarlos.
  return {
    reportes,
    isLoading,
    fetchReportes
  }
})