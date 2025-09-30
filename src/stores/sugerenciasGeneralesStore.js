// src/stores/sugerenciasGeneralesStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useSugerenciasGeneralesStore = defineStore('sugerenciasGenerales', () => {
  // Estado para la lista de sugerencias del campo activo
  const sugerencias = ref([])
  const isLoading = ref(false)
  const currentField = ref('') // Para saber qué campo estamos gestionando ('medico', 'instrumentador', etc.)

  // --- ACTIONS ---

  /**
   * Carga las sugerencias para un campo específico (ej. 'medico').
   * @param {string} campo - El nombre del campo cuyas sugerencias se quieren cargar.
   */
  const fetchSugerencias = async (campo) => {
    isLoading.value = true
    currentField.value = campo // Establecemos el campo actual
    try {
      const { data, error } = await supabase
        .from('sugerencias')
        .select('*')
        .eq('campo', campo) // Filtra por el campo específico
        .order('valor', { ascending: true }) // Ordena por el valor de la sugerencia

      if (error) throw error
      sugerencias.value = data
    } catch (error) {
      console.error(`Error al obtener sugerencias para ${campo}:`, error.message)
      sugerencias.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Añade una nueva sugerencia para un campo específico.
   * @param {string} campo - El nombre del campo.
   * @param {string} valor - El valor de la nueva sugerencia.
   */
  const addSugerencia = async (campo, valor) => {
    if (!valor || valor.trim() === '') return
    const valorLimpio = valor.trim()
    try {
      // Usamos upsert para evitar duplicados si ya existe la sugerencia para ese campo.
      const { error } = await supabase
        .from('sugerencias')
        .upsert(
          { campo: campo, valor: valorLimpio },
          { onConflict: 'campo, valor', ignoreDuplicates: true }
        )
      if (error) throw error
      await fetchSugerencias(campo) // Recargar la lista para mostrar el nuevo/existente.
    } catch (error) {
      console.error(`Error al añadir sugerencia para ${campo}:`, error.message)
    }
  }

  /**
   * Actualiza una sugerencia existente.
   * @param {number} id - ID de la sugerencia a actualizar.
   * @param {string} nuevoValor - El nuevo valor de la sugerencia.
   */
  const updateSugerencia = async (id, nuevoValor) => {
    if (!nuevoValor || nuevoValor.trim() === '') return
    const valorLimpio = nuevoValor.trim()
    try {
      const { error } = await supabase
        .from('sugerencias')
        .update({ valor: valorLimpio })
        .eq('id', id)
      if (error) throw error
      await fetchSugerencias(currentField.value) // Recargar la lista.
    } catch (error) {
      console.error('Error al actualizar sugerencia:', error.message)
    }
  }

  /**
   * Elimina una sugerencia por su ID.
   * @param {number} id - ID de la sugerencia a eliminar.
   */
  const deleteSugerencia = async (id) => {
    try {
      const { error } = await supabase
        .from('sugerencias')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchSugerencias(currentField.value) // Recargar la lista.
    } catch (error) {
      console.error('Error al eliminar sugerencia:', error.message)
    }
  }

  return {
    sugerencias,
    isLoading,
    currentField,
    fetchSugerencias,
    addSugerencia,
    updateSugerencia,
    deleteSugerencia,
  }
})