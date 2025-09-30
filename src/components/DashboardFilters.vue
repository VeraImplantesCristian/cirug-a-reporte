<!-- src/components/DashboardFilters.vue -->
<template>
  <div class="bg-white p-4 rounded-lg shadow-md mb-8">
    <h3 class="text-lg font-semibold mb-4 text-gray-700">Filtros de Priorización</h3>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
      
      <!-- Filtro por Médico -->
      <div>
        <label for="filtro-medico" class="block text-sm font-medium text-gray-600 mb-1">Médico</label>
        <select 
          id="filtro-medico"
          :value="modelValue.medico"
          @change="$emit('update:modelValue', { ...modelValue, medico: $event.target.value })"
          class="form-input"
        >
          <option value="">Todos</option>
          <option v-for="medico in medicosUnicos" :key="medico" :value="medico">{{ medico }}</option>
        </select>
      </div>

      <!-- Filtro por Lugar (Zona) -->
      <div>
        <label for="filtro-lugar" class="block text-sm font-medium text-gray-600 mb-1">Lugar (Zona)</label>
        <select 
          id="filtro-lugar"
          :value="modelValue.lugar"
          @change="$emit('update:modelValue', { ...modelValue, lugar: $event.target.value })"
          class="form-input"
        >
          <option value="">Todos</option>
          <option v-for="lugar in lugaresUnicos" :key="lugar" :value="lugar">{{ lugar }}</option>
        </select>
      </div>

      <!-- NUEVO: Filtro Rápido de Fecha -->
      <div>
        <label for="filtro-fecha-rapido" class="block text-sm font-medium text-gray-600 mb-1">Rango de Fecha</label>
        <select 
          id="filtro-fecha-rapido"
          :value="modelValue.rango_rapido"
          @change="handleRangoRapidoChange($event.target.value)"
          class="form-input"
        >
          <option value="activo">Activas (desde hoy)</option>
          <option value="semana">Próxima Semana</option>
          <option value="personalizado">Personalizado...</option>
        </select>
      </div>

      <!-- NUEVO: Filtro Personalizado - Fecha Desde -->
      <div>
        <label for="fecha-desde" class="block text-sm font-medium text-gray-600 mb-1">Desde</label>
        <input 
          id="fecha-desde"
          type="date"
          :disabled="modelValue.rango_rapido !== 'personalizado'"
          :value="modelValue.fecha_desde"
          @change="$emit('update:modelValue', { ...modelValue, fecha_desde: $event.target.value })"
          class="form-input"
        />
      </div>

      <!-- Botón para limpiar filtros -->
      <div>
        <label class="block text-sm font-medium text-transparent mb-1">Acción</label>
        <button 
          @click="handleLimpiarFiltros"
          class="w-full h-[var(--field-h)] bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
        >
          Limpiar Filtros
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  cirugias: { type: Array, required: true },
  modelValue: { type: Object, required: true } // { medico, lugar, rango_rapido, fecha_desde }
});

defineEmits(['update:modelValue']);

// Función para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

const handleRangoRapidoChange = (rango) => {
    let fecha_desde = '';
    
    if (rango === 'activo') {
        fecha_desde = getTodayDateString();
    } else if (rango === 'semana') {
        // Lógica para obtener la fecha de hace 7 días (o hoy)
        const d = new Date();
        d.setDate(d.getDate() - 7);
        fecha_desde = d.toISOString().split('T')[0];
    }
    
    // Emitir el cambio del rango rápido y la fecha_desde calculada
    emit('update:modelValue', { ...props.modelValue, rango_rapido: rango, fecha_desde });
};

const handleLimpiarFiltros = () => {
    // La opción 'activo' es el filtro por defecto (desde hoy)
    emit('update:modelValue', { medico: '', lugar: '', rango_rapido: 'activo', fecha_desde: getTodayDateString() });
};


const medicosUnicos = computed(() => {
  const medicos = props.cirugias.map(c => c.medico).filter(Boolean);
  return [...new Set(medicos)].sort();
});

const lugaresUnicos = computed(() => {
  const lugares = props.cirugias.map(c => c.lugar_cirugia).filter(Boolean);
  return [...new Set(lugares)].sort();
});
</script>