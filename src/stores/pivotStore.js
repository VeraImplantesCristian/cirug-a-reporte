// src/stores/pivotStore.js

import { defineStore } from 'pinia';
// Importamos 'ref' y 'reactive' de Vue.
import { ref, reactive } from 'vue';
import { supabase } from '../supabase.js';

// Definimos el store 'pivot'.
export const usePivotStore = defineStore('pivot', () => {
  
  // --- STATE ---
  const loading = ref(false);
  const error = ref(null);

  // NUEVO ESTADO: Usamos 'reactive' para agrupar las listas de sugerencias.
  // Esto es más organizado que tener un 'ref' separado para cada lista.
  const sugerencias = reactive({
    clientes: [],
    nosocomios: [],
    doctores: []
  });

  // --- ACTIONS ---

  /**
   * NUEVA ACCIÓN: Carga todas las listas de sugerencias desde Supabase.
   * Llama a la función RPC 'get_sugerencias_por_campo' para cada tipo de dato.
   */
  const cargarSugerencias = async () => {
    // No queremos que el spinner principal de "Guardando..." se active aquí.
    // Esta carga es en segundo plano. Si quisiéramos un spinner, usaríamos un 'loading' separado.
    error.value = null;
    try {
      // Para ser eficientes, ejecutamos todas las peticiones a la vez en paralelo.
      // Promise.all espera a que todas las promesas se resuelvan.
      const [clientesRes, nosocomiosRes, doctoresRes] = await Promise.all([
        supabase.rpc('get_sugerencias_por_campo', { p_campo_filter: 'cliente' }),
        supabase.rpc('get_sugerencias_por_campo', { p_campo_filter: 'nosocomio' }),
        supabase.rpc('get_sugerencias_por_campo', { p_campo_filter: 'doctor' })
      ]);

      // Verificamos si alguna de las llamadas falló.
      if (clientesRes.error) throw clientesRes.error;
      if (nosocomiosRes.error) throw nosocomiosRes.error;
      if (doctoresRes.error) throw doctoresRes.error;

      // Si todo fue exitoso, actualizamos nuestro estado con los datos recibidos.
      // Usamos '|| []' como medida de seguridad por si la data viniera nula.
      sugerencias.clientes = clientesRes.data || [];
      sugerencias.nosocomios = nosocomiosRes.data || [];
      sugerencias.doctores = doctoresRes.data || [];
      
      console.log('Sugerencias cargadas correctamente.');

    } catch (e) {
      console.error('Error al cargar las sugerencias:', e.message);
      error.value = 'No se pudieron cargar las sugerencias de autocompletado.';
    }
  };

  /**
   * Guarda los datos del formulario como sugerencias en la base de datos.
   */
  const guardarSugerencias = async (formData) => {
    loading.value = true;
    error.value = null;

    try {
      const camposAGuardar = ['cliente', 'nosocomio', 'doctor', 'paciente'];
      const sugerenciasParaEnviar = camposAGuardar
        .map(campo => ({
          campo: campo,
          valor: formData[campo]?.trim()
        }))
        .filter(sugerencia => sugerencia.valor);

      if (sugerenciasParaEnviar.length === 0) {
        return;
      }

      const { error: rpcError } = await supabase.rpc('add_sugerencias_batch', {
        p_sugerencias: sugerenciasParaEnviar
      });

      if (rpcError) {
        throw rpcError;
      }

      console.log('Sugerencias guardadas con éxito en Supabase.');

    } catch (e) {
      console.error('Error al guardar sugerencias:', e.message);
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  // Exponemos el nuevo estado y la nueva acción para que los componentes puedan usarlos.
  return {
    loading,
    error,
    sugerencias, // <-- Nuevo estado disponible
    guardarSugerencias,
    cargarSugerencias // <-- Nueva acción disponible
  };
});