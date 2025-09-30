<!-- src/views/DashboardView.vue -->
<template>
  <!-- Contenedor principal: h-full para el layout de columna y color de fondo -->
  <div class="flex flex-col h-full w-full bg-gray-100">
    
    <!-- Encabezado que se oculta en modo TV -->
    <header class="p-4 md:p-6 pb-0 transition-all duration-300" :class="{'hidden': isTV}">
      <div class="flex justify-between items-center mb-4">
        <!-- Título principal centrado -->
        <div class="flex-1 text-center">
          <h1 class="text-3xl font-bold text-gray-800 inline-flex items-center gap-3">
            📦 Centro de Comando de Preparación
          </h1>
        </div>
        <!-- Hora y Fecha actual y Toggle TV (a la derecha) -->
        <div class="text-xl font-mono text-gray-600 flex items-center gap-4 shrink-0">
          <span>{{ horaActual }}</span>
          <button @click="toggleTV" class="text-lg bg-gray-200 hover:bg-gray-300 p-2 rounded-md transition-colors">
            {{ isTV ? 'Salir Modo TV' : 'Modo TV' }}
          </button>
        </div>
      </div>
      <!-- Filtros de Priorización (Oculto en modo TV) -->
      <DashboardFilters 
        :cirugias="dashboardStore.todasLasCirugias"
        v-model="dashboardStore.filtros"
      />
    </header>
    
    <!-- Main que maneja el scroll (si es necesario) -->
    <main class="flex-grow p-4 md:p-6 pt-0 overflow-y-auto">

      <!-- INDICADOR DE CARGA GLOBAL -->
      <div v-if="dashboardStore.loading" class="text-center p-12 text-xl text-gray-500">
        Cargando datos del Centro de Comando... 🔄
      </div>
      
      <div v-else-if="esVacio" class="text-center p-12 text-xl text-gray-500 bg-white rounded-lg shadow-lg">
        <p>🎉 ¡Felicidades! No hay cirugías que coincidan con los filtros.</p>
        <p class="text-lg mt-2">Revise el rango de fechas o los filtros de médico/lugar.</p>
      </div>

      <!-- VISTA PRINCIPAL: Contenedor de columnas con layout responsive -->
      <!-- Usamos flexbox para las columnas y altura dinámica para el scroll -->
      <div v-else :class="[
        'flex flex-row gap-4',
        isTV ? 'h-[calc(100vh-140px)] px-4' // Más alto en modo TV
             : 'h-[calc(100vh-220px)]' // Menos alto en modo PC para dejar espacio
      ]">
        
        <!-- Columnas del Tablero -->
        <!-- Las columnas usan flex-1, min-w-0 y basis-0 para repartir el ancho de forma uniforme -->
        <section v-for="(columna, estado) in dashboardStore.cirugiasPorEstado" :key="estado" class="flex flex-col rounded-xl shadow-xl min-w-0 basis-0 flex-1">
          
          <!-- Encabezado de Columna (Estilos y Escala Dinámica) -->
          <h3 
            class="font-bold text-3xl p-4 shrink-0 text-white text-center transition-colors duration-300 rounded-t-xl" 
            :class="[columnaHeaderClass(estado)]"
          >
            <!-- Título con círculo indicador (Diseño Limpio) -->
            <span class="flex items-center justify-center gap-2">
                <span class="w-4 h-4 rounded-full border-2 bg-transparent" :class="[columnaIndicatorClass(estado)]"></span>
                <span class="uppercase">{{ estado.replace('-', ' ') }}</span>
                <span class="text-2xl font-normal">({{ columna.length }})</span>
            </span>
          </h3>
          
          <!-- Lista de tarjetas con scroll interno y fondo BLANCO (Homogéneo) -->
          <ul class="overflow-y-auto flex-grow space-y-4 p-4 rounded-b-xl" :class="[columnaBgClass(estado)]">
            <li v-for="cirugia in columna" :key="cirugia.id">
              <SurgeryCard :tv="isTV" :cirugia="cirugia" />
            </li>
            <!-- Mensaje si la columna está vacía -->
            <li v-if="columna.length === 0" class="text-center text-sm text-gray-500 p-8 italic">
              No hay cirugías en este estado.
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, watch, computed, ref, onBeforeUnmount } from 'vue';
import { useDashboardStore } from '../stores/dashboardStore';
import SurgeryCard from '../components/SurgeryCard.vue';
import DashboardFilters from '../components/DashboardFilters.vue';
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'; 

const dashboardStore = useDashboardStore();
const isTV = ref(false); // Estado para el modo TV (kiosk)
const horaActual = ref('');
let timer;

function toggleTV() { 
  isTV.value = !isTV.value; 
  // Ocultamos la barra de navegación de App.vue al ir a FullScreen
  document.querySelector('header.print\\:hidden')?.classList.toggle('hidden', isTV.value);
  // Opcional: Ocultar el scroll del HTML/Body en modo TV
  document.documentElement.style.overflow = isTV.value ? 'hidden' : 'auto';
}

const updateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
  const time = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  horaActual.value = `${date} ${time}`;
};

// Lógica de Clases de Columna (Colores de tu imagen)
const columnaHeaderClass = (estado) => {
  switch (estado) {
    case 'pendientes': return 'bg-gray-700'; // Gris oscuro
    case 'en-proceso': return 'bg-yellow-500 text-gray-800'; // Amarillo (con texto oscuro)
    case 'en-transito': return 'bg-red-600'; // Rojo
    case 'completados': return 'bg-green-600'; // Verde
    default: return 'bg-gray-500';
  }
};

// Fondos de Columna (Homogéneo: Blanco)
const columnaBgClass = (estado) => {
    // Usamos bg-white para la lista, para que se funda con la card (que también es bg-white)
    return 'bg-white';
}

// Clase para el círculo indicador
const columnaIndicatorClass = (estado) => {
    switch (estado) {
        case 'pendientes': return 'border-white';
        case 'en-proceso': return 'border-gray-800'; // Borde oscuro si el fondo es claro
        case 'en-transito': return 'border-white';
        case 'completados': return 'border-white bg-white'; // Círculo blanco para completado
        default: return 'border-white';
    }
}

const esVacio = computed(() => {
  return dashboardStore.cirugiasFiltradas.length === 0 && !dashboardStore.loading;
});

// Lógica de Drag and Drop (mantener para que compile)
const [parent, values] = useDragAndDrop(
  dashboardStore.cirugiasPorEstado, 
  { group: 'cirugias' }
);

watch(() => dashboardStore.cirugiasPorEstado, (newValues) => {
  values.value = newValues;
}, { deep: true });

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  
  // Opcional: Activar modo TV por defecto en pantallas muy grandes
  if (window.innerWidth >= 1600) {
      //isTV.value = true; // Se mantiene manual por si se usa en un monitor de PC grande
  }

  dashboardStore.fetchCirugias();
  dashboardStore.subscribeToChanges();
  
  dashboardStore.filtros.rango_rapido = 'activo';
  dashboardStore.filtros.fecha_desde = new Date().toISOString().split('T')[0];
});

onBeforeUnmount(() => {
  clearInterval(timer);
  // Restauramos el scroll del HTML al salir del componente si estábamos en modo TV
  if (isTV.value) {
      document.querySelector('header.print\\:hidden')?.classList.remove('hidden');
      document.documentElement.style.overflow = 'auto';
  }
});
</script>