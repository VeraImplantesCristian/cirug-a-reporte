// src/stores/clientesStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useClientesStore = defineStore('clientes', () => {
  // --- STATE ---
  const clientes = ref([])
  // --- NUEVO ESTADO PARA PAGINACIÓN ---
  const currentPage = ref(1)
  const rowsPerPage = ref(10) // Mostraremos 10 clientes por página
  const totalClientes = ref(0)

  // --- ACTIONS ---

  // Acción para obtener los clientes de una página específica.
  const fetchClientes = async (page = 1) => {
    try {
      currentPage.value = page
      const from = (page - 1) * rowsPerPage.value
      const to = from + rowsPerPage.value - 1

      // Hacemos la consulta a Supabase con rango y conteo.
      const { data, error, count } = await supabase
        .from('clientes')
        .select('id, nombre, email', { count: 'exact' }) // Pedimos el conteo total
        .order('nombre', { ascending: true })
        .range(from, to) // Pedimos solo el rango de la página actual

      if (error) throw error

      clientes.value = data
      // Guardamos el conteo total de clientes.
      totalClientes.value = count
    } catch (error) {
      console.error('Error al obtener los clientes:', error.message)
    }
  }

  // Las acciones de añadir, actualizar y eliminar ahora llaman a fetchClientes
  // para recargar la página actual y mantener la consistencia.
  const addCliente = async (clienteData) => {
    try {
      const { error } = await supabase.from('clientes').insert(clienteData)
      if (error) throw error
      // Recargamos la primera página para ver el nuevo cliente.
      await fetchClientes(1)
    } catch (error) {
      console.error('Error al añadir el cliente:', error.message)
    }
  }

  const updateCliente = async (idCliente, updateData) => {
    try {
      const { error } = await supabase.from('clientes').update(updateData).eq('id', idCliente)
      if (error) throw error
      // Recargamos la página actual para ver los cambios.
      await fetchClientes(currentPage.value)
    } catch (error) {
      console.error('Error al actualizar el cliente:', error.message)
    }
  }

  const deleteCliente = async (idCliente) => {
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', idCliente)
      if (error) throw error
      // Recargamos la página actual.
      await fetchClientes(currentPage.value)
    } catch (error) {
      console.error('Error al eliminar el cliente:', error.message)
    }
  }

  return {
    clientes,
    currentPage,
    rowsPerPage,
    totalClientes,
    fetchClientes,
    addCliente,
    updateCliente,
    deleteCliente,
  }
})