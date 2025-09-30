<!-- src/components/SurgeryCard.vue -->
<template>
  <div 
    class="bg-white rounded-xl shadow-lg transition-all duration-300 relative border-l-4" 
    :class="[borderColor, { 'is-urgent': isUrgent }, props.tv ? 'p-4 md:p-6 space-y-3' : 'p-3 md:p-4 space-y-2']"
  >
    <!-- Ícono de Urgencia -->
    <span v-if="isUrgent" class="absolute top-1 right-2" :class="[props.tv ? 'text-4xl' : 'text-3xl']">⏰</span>
    
    <!-- Encabezado: Paciente y Fecha -->
    <div class="mb-2 flex justify-between items-start border-b pb-2">
      <!-- Paciente: Enorme y sin 'truncate' forzado -->
      <h4 :class="[props.tv ? 'text-[clamp(22px,1.8vw,32px)]' : 'text-xl', 'font-bold text-gray-800 break-words pr-2 leading-tight']">
        {{ cirugia.paciente }}
      </h4>
      <!-- Fecha: Escalamiento de fuente con clamp() -->
      <div :class="[props.tv ? 'text-[clamp(18px,1.2vw,24px)]' : 'text-base', 'font-semibold text-gray-600 shrink-0 mt-1 flex items-center gap-1']">
        <span :class="[props.tv ? 'text-3xl' : 'text-xl']">📅</span> {{ formattedDate }}
      </div>
    </div>

    <!-- Detalles Clave -->
    <div :class="[props.tv ? 'text-[clamp(16px,1.1vw,20px)] space-y-1' : 'text-sm space-y-0.5']">
      <div class="flex items-center gap-2 min-w-0">
        <span :class="[props.tv ? 'text-2xl' : 'text-xl']">👨‍⚕️</span> <span class="font-semibold w-24 shrink-0">Médico:</span>
        <span class="text-gray-700 truncate min-w-0">{{ cirugia.medico || 'N/E' }}</span>
      </div>
      <div class="flex items-center gap-2 min-w-0">
        <span :class="[props.tv ? 'text-2xl' : 'text-xl']">💳</span> <span class="font-semibold w-24 shrink-0">Cliente:</span>
        <span class="text-gray-700 truncate min-w-0">{{ cirugia.cliente || 'N/E' }}</span>
      </div>
    </div>
    
    <!-- Material Requerido (El área problemática) -->
    <div :class="[props.tv ? 'text-[clamp(14px,1vw,18px)] mt-3 pt-3' : 'text-xs mt-2 pt-2', 'border-t']">
      <p class="font-semibold mb-1">Material Requerido:</p>
      <!-- CORRECCIÓN CLAVE: El list-disc (ul) ahora tiene un estilo para forzar el quiebre de palabras -->
      <ul class="list-disc ml-4 space-y-0.5 min-w-0">
        <li v-for="(m, i) in materialList.slice(0, props.tv ? 6 : 4)" 
            :key="i" 
            class="material-item-break">
            {{ m }}
        </li>
      </ul>
    </div>

    <!-- Botones de Cambio de Estado (Círculos) -->
    <div class="flex justify-around items-center pt-3 border-t" :class="[props.tv ? 'mt-4' : 'mt-2']">
      <button 
        v-for="estado in estadosDisponibles" :key="estado.value"
        @click="dashboardStore.updateCirugiaStatus(cirugia.id, estado.value)"
        class="rounded-full border-4 transition-all duration-150 flex items-center justify-center"
        :class="[estado.class, { 'ring-4 ring-offset-2': cirugia.estado === estado.value }, props.tv ? 'w-12 h-12' : 'w-8 h-8']"
        :title="`Cambiar a ${estado.label}`"
      >
        <span v-if="cirugia.estado === estado.value" class="w-3 h-3 rounded-full bg-current"></span>
        <span v-else></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useDashboardStore } from '../stores/dashboardStore';

const dashboardStore = useDashboardStore();

const props = defineProps({
  cirugia: { type: Object, required: true },
  tv: { type: Boolean, default: false } // Indica si está en modo TV
});

const estadosDisponibles = [
    { value: 'pendientes', label: 'Pendientes', class: 'border-yellow-500 text-yellow-500' },
    { value: 'en-proceso', label: 'En Proceso', class: 'border-red-600 text-red-600' },
    { value: 'en-transito', label: 'En Tránsito', class: 'border-green-600 text-green-600' },
    { value: 'completados', label: 'Completados', class: 'border-gray-500 text-gray-500' },
];

const isUrgent = computed(() => {
  if (!props.cirugia.fecha_cirugia) return false;
  const fechaCirugia = new Date(props.cirugia.fecha_cirugia);
  const ahora = new Date();
  const limiteUrgencia = new Date(ahora.getTime() + (24 * 60 * 60 * 1000));
  return fechaCirugia > ahora && fechaCirugia < limiteUrgencia;
});

const formattedDate = computed(() => {
  if (!props.cirugia.fecha_cirugia) return 'N/A';
  // Formato para mostrar solo Día/Mes (ej: 30/09)
  const fecha = new Date(props.cirugia.fecha_cirugia);
  return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
});

const borderColor = computed(() => {
  if (isUrgent.value) return 'border-red-600';
  switch (props.cirugia.estado) {
    case 'pendientes': return 'border-gray-700';
    case 'en-proceso': return 'border-yellow-500';
    case 'en-transito': return 'border-red-600';
    case 'completados': return 'border-green-600';
    default: return 'border-gray-300';
  }
});

const materialList = computed(() => {
  if (!props.cirugia.material) return ['No especificado.'];
  const items = props.cirugia.material.split('\n').filter(line => line.trim().length > 0);
  return items.slice(0, props.tv ? 6 : 4); // Límite de 6 en TV, 4 en PC
});
</script>

<style scoped>
/* 
  Estilo para forzar el salto de línea en palabras largas dentro de la lista de material. 
  Esto es CRÍTICO para el layout de columna.
*/
.material-item-break {
  overflow-wrap: break-word; 
  word-wrap: break-word; 
  word-break: break-all;
}
</style>