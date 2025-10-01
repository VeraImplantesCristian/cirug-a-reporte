// src/stores/materialesStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase'

export const useMaterialesStore = defineStore('materiales', () => {
  // --- STATE ---
  const todosMateriales = ref([]) // Lista maestra de todos los materiales
  const loading = ref(false)
  const searchQuery = ref('')
  
  // Estado de Paginación (para la vista de administración)
  const currentPage = ref(1)
  const rowsPerPage = ref(15) // Pagina por 15 ítems en la tabla de administración

  // --- GETTERS ---
  
  // Lista de materiales filtrados por el término de búsqueda
  const materialesFiltrados = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) {
      return todosMateriales.value 
    }
    return todosMateriales.value.filter(material => 
      material.code?.toLowerCase().includes(query) ||
      material.description?.toLowerCase().includes(query) ||
      material.categoria?.toLowerCase().includes(query)
    )
  })

  // Agrupa los materiales (paginados/filtrados) por categoría. USADO POR EL ADMIN
  const materialesAgrupados = computed(() => {
    const startIndex = (currentPage.value - 1) * rowsPerPage.value
    const endIndex = startIndex + rowsPerPage.value
    
    // Aplicamos paginación y agrupamos el subconjunto.
    const paginatedAndFiltered = materialesFiltrados.value.slice(startIndex, endIndex)

    const matAgrupados = {}
    paginatedAndFiltered.forEach(item => {
      const categoria = item.categoria || 'Sin Categoría'
      if (!matAgrupados[categoria]) {
        matAgrupados[categoria] = []
      }
      matAgrupados[categoria].push(item)
    })
    return matAgrupados
  })
  
  const totalMateriales = computed(() => materialesFiltrados.value.length)
  const totalPaginas = computed(() => Math.ceil(totalMateriales.value / rowsPerPage.value))


  // --- ACTIONS ---

  /**
   * Carga *todos* los materiales sin paginación (es la lista maestra).
   */
  const fetchMateriales = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('materiales')
        .select('id, code, description, categoria')
        .order('categoria', { ascending: true })

      if (error) throw error
      todosMateriales.value = data
    } catch (error) {
      console.error('Error al obtener los materiales:', error.message)
      throw error 
    } finally {
      loading.value = false
    }
  }

  /**
   * Añade o Edita un material.
   */
  const saveMaterial = async (materialData) => {
    try {
      const isUpdate = materialData.id;
      const dataToSave = { 
          code: materialData.code, 
          description: materialData.description, 
          categoria: materialData.categoria 
      };

      let query = supabase.from('materiales');
      
      if (isUpdate) {
        query = query.update(dataToSave).eq('id', materialData.id);
      } else {
        query = query.insert(dataToSave);
      }

      const { error } = await query;
      if (error) throw error

      await fetchMateriales() // Recargar la lista maestra
    } catch (error) {
      console.error('Error al guardar el material:', error.message)
    }
  }

  /**
   * Elimina un material.
   */
  const deleteMaterial = async (idMaterial) => {
    try {
      const { error } = await supabase.from('materiales').delete().eq('id', idMaterial)
      if (error) throw error
      await fetchMateriales() // Recargar la lista maestra
    } catch (error) {
      console.error('Error al eliminar el material:', error.message)
    }
  }

  return {
    // Estado y Getters
    loading,
    searchQuery,
    currentPage,
    rowsPerPage,
    todosMateriales, // Usado por los Modales
    materialesAgrupados, // Usado por la Vista Admin
    totalMateriales,
    totalPaginas,
    // Acciones
    fetchMateriales,
    saveMaterial,
    deleteMaterial,
  }
})
