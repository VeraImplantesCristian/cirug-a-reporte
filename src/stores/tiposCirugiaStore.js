// src/stores/tiposCirugiaStore.js

// Importamos las herramientas necesarias.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

// Definimos el store con un nombre único: 'tiposCirugia'.
export const useTiposCirugiaStore = defineStore('tiposCirugia', () => {
  // --- STATE ---
  // 'tiposCirugia' es la variable reactiva que contendrá el listado.
  const tiposCirugia = ref([])

  // --- ACTIONS ---

  // Acción para obtener todos los tipos de cirugía.
  const fetchTiposCirugia = async () => {
    try {
      // Hacemos una consulta a la tabla 'tipos_cirugia', ordenando por nombre.
      const { data, error } = await supabase
        .from('tipos_cirugia')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) throw error
      tiposCirugia.value = data
    } catch (error) {
      console.error('Error al obtener los tipos de cirugía:', error.message)
    }
  }

  // Acción para añadir un nuevo tipo de cirugía.
  const addTipoCirugia = async (tipoCirugia) => {
    try {
      // Insertamos el nuevo registro en la tabla 'tipos_cirugia'.
      const { data, error } = await supabase
        .from('tipos_cirugia')
        .insert(tipoCirugia)
        .select()

      if (error) throw error

      // Actualizamos el estado local para reflejar el cambio instantáneamente.
      if (data) {
        tiposCirugia.value.push(data[0])
        tiposCirugia.value.sort((a, b) => a.nombre.localeCompare(b.nombre));
      }
    } catch (error) {
      console.error('Error al añadir el tipo de cirugía:', error.message)
    }
  }

  // Acción para eliminar un tipo de cirugía por su ID.
  const deleteTipoCirugia = async (idTipoCirugia) => {
    try {
      // Eliminamos el registro correspondiente de la base de datos.
      const { error } = await supabase
        .from('tipos_cirugia')
        .delete()
        .eq('id', idTipoCirugia)

      if (error) throw error

      // Actualizamos el estado local eliminando el elemento del array.
      tiposCirugia.value = tiposCirugia.value.filter(t => t.id !== idTipoCirugia)
    } catch (error) {
      console.error('Error al eliminar el tipo de cirugía:', error.message)
    }
  }

  // Exponemos el estado y las acciones.
  return {
    tiposCirugia,
    fetchTiposCirugia,
    addTipoCirugia,
    deleteTipoCirugia,
  }
})