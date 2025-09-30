// src/stores/clientesStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useClientesStore = defineStore('clientes', () => {
  // --- STATE ---
  // 'clientes' para la paginación en el admin
  const clientes = ref([])
  // --- NUEVO ESTADO: 'allClients' para la lista completa (para modales, etc.) ---
  const allClients = ref([]) 

  // Estado para paginación
  const currentPage = ref(1)
  const rowsPerPage = ref(10)
  const totalClientes = ref(0)

  // --- ACTIONS ---

  /**
   * Carga una página específica de clientes con paginación.
   * Utilizado principalmente por la vista de administración.
   * @param {number} page - El número de página a cargar.
   */
  const fetchClientes = async (page = 1) => {
    try {
      currentPage.value = page
      const from = (page - 1) * rowsPerPage.value
      const to = from + rowsPerPage.value - 1

      const { data, error, count } = await supabase
        .from('clientes')
        .select('id, nombre, email', { count: 'exact' })
        .order('nombre', { ascending: true })
        .range(from, to)

      if (error) throw error

      clientes.value = data
      totalClientes.value = count || 0
    } catch (error) {
      console.error('Error al obtener los clientes paginados:', error.message)
    }
  }

  /**
   * Carga *todos* los clientes sin paginación.
   * Utilizado principalmente por los modales de selección en el formulario principal.
   */
  const fetchAllClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nombre, email')
        .order('nombre', { ascending: true }) // Aseguramos que la lista completa también esté ordenada

      if (error) throw error
      allClients.value = data
    } catch (error) {
      console.error('Error al obtener todos los clientes:', error.message)
    }
  }

  /**
   * Añade un nuevo cliente y recarga ambas listas.
   * @param {Object} clienteData - Datos del nuevo cliente (nombre, email).
   */
  const addCliente = async (clienteData) => {
    try {
      const { error } = await supabase.from('clientes').insert(clienteData)
      if (error) throw error
      await fetchClientes(currentPage.value) // Recargar la página actual paginada
      await fetchAllClients() // Recargar la lista completa
    } catch (error) {
      console.error('Error al añadir el cliente:', error.message)
    }
  }

  /**
   * Actualiza un cliente existente y recarga ambas listas.
   * @param {number} idCliente - ID del cliente a actualizar.
   * @param {Object} updateData - Datos a actualizar.
   */
  const updateCliente = async (idCliente, updateData) => {
    try {
      const { error } = await supabase.from('clientes').update(updateData).eq('id', idCliente)
      if (error) throw error
      await fetchClientes(currentPage.value) // Recargar la página actual paginada
      await fetchAllClients() // Recargar la lista completa
    } catch (error) {
      console.error('Error al actualizar el cliente:', error.message)
    }
  }

  /**
   * Elimina un cliente y recarga ambas listas.
   * @param {number} idCliente - ID del cliente a eliminar.
   */
  const deleteCliente = async (idCliente) => {
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', idCliente)
      if (error) throw error
      await fetchClientes(currentPage.value) // Recargar la página actual paginada
      await fetchAllClients() // Recargar la lista completa
    } catch (error) {
      console.error('Error al eliminar el cliente:', error.message)
    }
  }

  return {
    clientes,
    allClients, // --- EXPONEMOS allClients ---
    currentPage,
    rowsPerPage,
    totalClientes,
    fetchClientes,
    fetchAllClients, // --- EXPONEMOS fetchAllClients ---
    addCliente,
    updateCliente,
    deleteCliente,
  }
})