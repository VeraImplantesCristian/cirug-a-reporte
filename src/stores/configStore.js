// src/stores/configStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useConfigStore = defineStore('config', () => {
  // 'mensajes' almacenará los mensajes clave/valor de la tabla de configuración
  // Ejemplo: { 'asunto_base': 'Reporte Cirugía: {CLIENTE} - {PACIENTE}', ... }
  const mensajes = ref({});
  const loading = ref(false);
  const error = ref(null);

  // Carga todos los mensajes de la tabla 'configuracion'
  const fetchMensajes = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Solo necesitamos las columnas 'clave' y 'valor'
      const { data, error: fetchError } = await supabase
        .from('configuracion')
        .select('clave, valor');

      if (fetchError) throw fetchError;
      
      // Transformamos el array de objetos en un objeto simple { clave: valor }
      const mensajesObjeto = data.reduce((acc, item) => {
        acc[item.clave] = item.valor;
        return acc;
      }, {});

      mensajes.value = mensajesObjeto;
      
    } catch (e) {
      error.value = 'Error al cargar los mensajes de configuración.';
      console.error(error.value, e);
    } finally {
      loading.value = false;
    }
  };

  // Función para reemplazar variables en un texto (ej. {PACIENTE} por el valor real)
  const replaceVariables = (text, data) => {
    let result = text;
    if (!text) return '';
    
    // Reemplaza {CLIENTE}, {PACIENTE}, {MEDICO}, etc.
    Object.keys(data).forEach(key => {
        // La clave en el texto es la misma que en el objeto, pero en mayúsculas y entre llaves
        const placeholder = new RegExp(`{${key.toUpperCase()}}`, 'g');
        result = result.replace(placeholder, data[key] || 'N/E'); // Usa 'N/E' si el valor es null/undefined
    });
    
    return result;
  };

  return {
    mensajes,
    loading,
    error,
    fetchMensajes,
    replaceVariables,
  };
});