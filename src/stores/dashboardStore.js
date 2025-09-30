// src/stores/dashboardStore.js

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue' // Añadimos 'reactive'
import { supabase } from '../supabase'

// --- Función para reproducir sonidos de notificación ---
const playNotificationSound = () => {
  // Usamos la Web Audio API para un control más fino.
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine'; // Tipo de onda
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime); // Frecuencia en Hz
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volumen

  oscillator.start();
  // El sonido se detiene solo después de un corto tiempo.
  oscillator.stop(audioContext.currentTime + 0.2); 
}

export const useDashboardStore = defineStore('dashboard', () => {
  // --- ESTADO ---
  const todasLasCirugias = ref([]); // Almacena TODAS las cirugías sin filtrar.
  const loading = ref(false);
  const error = ref(null);

  // NUEVO: Estado reactivo para los filtros activos.
  const filtros = reactive({
    medico: '',
    lugar: '',
  });

  // --- GETTERS (Propiedades Computadas) ---

  // NUEVO: 'cirugiasFiltradas' aplica los filtros antes de agrupar.
  const cirugiasFiltradas = computed(() => {
    return todasLasCirugias.value.filter(cirugia => {
      const matchMedico = !filtros.medico || cirugia.medico === filtros.medico;
      const matchLugar = !filtros.lugar || cirugia.lugar_cirugia === filtros.lugar;
      return matchMedico && matchLugar;
    });
  });

  // 'cirugiasPorEstado' ahora trabaja sobre la lista ya filtrada.
  const cirugiasPorEstado = computed(() => {
    const agrupadas = {
      pendientes: [],
      'en-proceso': [],
      'en-transito': [],
      completados: [],
    };
    // Usamos 'cirugiasFiltradas' en lugar de 'todasLasCirugias'
    cirugiasFiltradas.value.forEach(cirugia => {
      if (agrupadas[cirugia.estado]) {
        agrupadas[cirugia.estado].push(cirugia);
      }
    });
    return agrupadas;
  });

  // --- ACCIONES ---

  // 1. Obtiene los reportes iniciales de la base de datos.
  const fetchCirugias = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Solo traemos reportes cuya fecha de cirugía sea hoy o en el futuro.
      const today = new Date().toISOString().split('T')[0];
      const { data, error: fetchError } = await supabase
        .from('reportes')
        .select('*')
        .gte('fecha_cirugia', today) // gte = greater than or equal
        .order('fecha_cirugia', { ascending: true });

      if (fetchError) throw fetchError;
      todasLasCirugias.value = data; // Guardamos en la lista maestra.
    } catch (e) {
      error.value = 'Error al cargar las cirugías.';
      console.error(error.value, e);
    } finally {
      loading.value = false;
    }
  };

  // 2. Actualiza el estado de una cirugía (cuando se arrastra y suelta).
  const updateCirugiaStatus = async (cirugiaId, nuevoEstado) => {
    // Actualización optimista: movemos la tarjeta en la UI inmediatamente.
    const index = todasLasCirugias.value.findIndex(c => c.id === cirugiaId);
    if (index !== -1) {
      const estadoOriginal = todasLasCirugias.value[index].estado;
      todasLasCirugias.value[index].estado = nuevoEstado;

      // Ahora, intentamos actualizar en Supabase.
      const { error: updateError } = await supabase
        .from('reportes')
        .update({ estado: nuevoEstado })
        .eq('id', cirugiaId);

      // Si hay un error, revertimos el cambio en la UI y notificamos.
      if (updateError) {
        todasLasCirugias.value[index].estado = estadoOriginal; // Revertir
        console.error('Error al actualizar el estado:', updateError);
        // Aquí podríamos usar un toast para notificar el error.
      }
    }
  };

  // 3. Se suscribe a los cambios en tiempo real de la tabla 'reportes'.
  const subscribeToChanges = () => {
    supabase
      .channel('reportes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reportes' }, (payload) => {
        console.log('Cambio recibido de Supabase:', payload);
        
        // Si se inserta un nuevo reporte
        if (payload.eventType === 'INSERT') {
          todasLasCirugias.value.push(payload.new);
          playNotificationSound(); // ¡Reproducimos un sonido!
        }

        // Si se actualiza un reporte existente
        if (payload.eventType === 'UPDATE') {
          const index = todasLasCirugias.value.findIndex(c => c.id === payload.new.id);
          if (index !== -1) {
            todasLasCirugias.value[index] = { ...todasLasCirugias.value[index], ...payload.new };
          }
        }
      })
      .subscribe();
  };

  return {
    // Exponemos los nuevos elementos
    todasLasCirugias, // Para poblar los filtros
    filtros, // Para v-model
    cirugiasFiltradas, // Para la vista
    // El resto sigue igual
    loading,
    error,
    cirugiasPorEstado,
    fetchCirugias,
    updateCirugiaStatus,
    subscribeToChanges,
  };
});