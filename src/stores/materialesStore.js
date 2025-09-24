// src/stores/materialesStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useMaterialesStore = defineStore('materiales', () => {
  // --- STATE ---
  // 'materiales' ahora contendrá un objeto con los materiales agrupados por categoría.
  const materiales = ref({})

  // --- ACTIONS ---

  // Acción para obtener y agrupar todos los materiales.
  const fetchMateriales = async () => {
    try {
      const { data, error } = await supabase
        .from('materiales')
        .select('code, description, categoria')
        .order('categoria')
        .order('description', { ascending: true })

      if (error) throw error

      // --- LÓGICA DE AGRUPACIÓN CORREGIDA ---
      // Creamos un nuevo objeto para agrupar los materiales.
      const matAgrupados = {}
      data.forEach(item => {
        // Si un material no tiene categoría, lo asignamos a "Sin Categoría".
        const categoria = item.categoria || 'Sin Categoría'
        // Si la categoría no existe aún en nuestro objeto, la creamos como un array vacío.
        if (!matAgrupados[categoria]) {
          matAgrupados[categoria] = []
        }
        // Añadimos el material al array de su categoría.
        matAgrupados[categoria].push(item)
      })

      // Asignamos el objeto agrupado a nuestro estado reactivo.
      materiales.value = matAgrupados

    } catch (error) {
      console.error('Error al obtener los materiales:', error.message)
      materiales.value = {} // En caso de error, reseteamos a un objeto vacío.
    }
  }

  // Acción para añadir un nuevo material.
  const addMaterial = async (material) => {
    try {
      const { data, error } = await supabase
        .from('materiales')
        .insert(material)
        .select()

      if (error) throw error
      
      // Después de añadir, volvemos a llamar a fetchMateriales para recargar y reagrupar todo.
      // Esto asegura que la lista siempre esté actualizada y ordenada.
      await fetchMateriales()

    } catch (error) {
      console.error('Error al añadir el material:', error.message)
    }
  }

  // Acción para eliminar un material por su ID.
  const deleteMaterial = async (idMaterial) => {
    try {
      const { error } = await supabase
        .from('materiales')
        .delete()
        .eq('id', idMaterial)

      if (error) throw error
      
      // Después de eliminar, también recargamos la lista.
      await fetchMateriales()

    } catch (error) {
      console.error('Error al eliminar el material:', error.message)
    }
  }

  return {
    materiales,
    fetchMateriales,
    addMaterial,
    deleteMaterial,
  }
})