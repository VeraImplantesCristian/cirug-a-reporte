<!-- src/views/PackingListView.vue -->
<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- Header compacto -->
    <header class="p-3 flex items-center gap-3 bg-white shadow">
      <h1 class="text-xl font-bold">Lista de Preparación (Depósito)</h1>
      <input v-model="q" placeholder="Buscar paciente / ART / médico"
             class="flex-1 h-10 px-3 rounded border" />
      <select v-model="filtroDia" class="h-10 px-2 rounded border">
        <option value="hoy">Hoy</option>
        <option value="prox">Próx. 3 días</option>
        <option value="todas">Todas</option>
      </select>
      <button @click="toggleFull" class="h-10 px-3 rounded bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg">Pantalla completa</button>
    </header>

    <!-- Lista -->
    <main class="flex-1 overflow-auto">
      <ul class="max-w-6xl mx-auto p-3 space-y-3">
        <li v-for="c in filtradas" :key="c.id">
          <button @click="abrirDetalle(c)"
            class="w-full text-left bg-white hover:bg-gray-50 border rounded-xl shadow-sm p-4 flex items-start gap-4 transition-colors duration-150">
            
            <!-- Estado (Pastilla) -->
            <span :class="estadoClase(c.estado)" class="px-3 py-1 text-sm font-semibold rounded-full mt-1 shrink-0">
              {{ etiquetaEstado(c.estado) }}
            </span>

            <!-- Texto del Reporte -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold truncate">{{ c.paciente }}</h3>
                <span class="text-sm text-gray-600 flex items-center gap-1">📅 {{ fechaCorta(c.fecha_cirugia) }}</span>
              </div>
              <p class="text-sm text-gray-700 truncate">
                🏥 {{ c.cliente || 'N/E' }} · 👨‍⚕️ {{ c.medico || 'N/E' }}
              </p>

              <!-- Material Solicitado (Top 3) -->
              <div class="mt-2 text-sm text-gray-800">
                <p class="font-semibold">Material:</p>
                <ul class="list-disc ml-5">
                  <li v-for="(m,i) in topMaterial(c.material)" :key="i">{{ m }}</li>
                </ul>
                <span v-if="tieneMas(c.material)" class="text-xs text-gray-500">+ ver todo ({{ materialCount(c.material) }} ítems)</span>
              </div>
            </div>

            <!-- Acciones -->
            <div class="flex flex-col gap-2 shrink-0">
              <!-- Cambia a En Proceso -->
              <button 
                v-if="c.estado !== 'en-proceso' && c.estado !== 'completados'"
                @click.stop="cambiarEstado(c,'en-proceso')" 
                class="px-3 py-2 rounded bg-yellow-100 text-yellow-800 border font-semibold hover:bg-yellow-200"
              >
                Iniciar
              </button>
              <!-- Cambia a Completado -->
              <button 
                v-else-if="c.estado === 'en-proceso'"
                @click.stop="cambiarEstado(c,'completados')" 
                class="px-3 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
              >
                Completar
              </button>
               <!-- Si ya está completado -->
              <span v-else class="px-3 py-2 text-green-700 font-semibold">✅ Listo</span>
            </div>
          </button>
        </li>

        <li v-if="!filtradas.length" class="text-center text-gray-500 py-16">
          No hay cirugías para mostrar.
        </li>
      </ul>
    </main>
    
    <!-- FUTURO: Panel lateral de detalle -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDashboardStore } from '../stores/dashboardStore' // Tu store
import { useToastStore } from '../stores/toastStore'

const dashboardStore = useDashboardStore()
const toastStore = useToastStore()

// --- ESTADO LOCAL Y FILTROS ---
const q = ref(''); 
const filtroDia = ref('hoy')
const loading = ref(false)
let refreshTimer;

// --- UTILERIAS DE FORMATO Y LÓGICA DE TIEMPO ---
const normaliza = s => (s || '').toLowerCase()
const fechaCorta = s => new Date(s).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'})
const esHoy = s => {
  const d = new Date(s), hoy = new Date()
  d.setHours(0,0,0,0); hoy.setHours(0,0,0,0); return d.getTime()===hoy.getTime()
}
const dentroProx3 = s => {
  const d = new Date(s), hoy = new Date(), lim = new Date(); lim.setDate(hoy.getDate()+3)
  d.setHours(0,0,0,0); hoy.setHours(0,0,0,0); lim.setHours(0,0,0,0)
  return d >= hoy && d <= lim
}
const materialCount = (txt='') => txt.split('\n').filter(Boolean).length

// --- COMPUTED FILTRADO Y ORDENADO ---
const filtradas = computed(()=>{
  const term = normaliza(q.value)
  
  // Usamos todas las cirugías del dashboard store como fuente de datos
  return dashboardStore.todasLasCirugias 
    .filter(c => {
      // Filtro por Estado (Ocultar Completados en vista rápida)
      if (c.estado === 'completados') return false; 
      
      // Filtro por Fecha
      if (filtroDia.value==='hoy' && !esHoy(c.fecha_cirugia)) return false
      if (filtroDia.value==='prox' && !dentroProx3(c.fecha_cirugia)) return false
      
      // Filtro por Búsqueda (Paciente, Cliente, Médico)
      const hay = [c.paciente,c.cliente,c.medico].some(v=>normaliza(v).includes(term))
      return hay
    })
    .sort((a,b)=> new Date(a.fecha_cirugia)-new Date(b.fecha_cirugia)) // Ordenar por fecha de cirugía
})

// --- LÓGICA DE VISUALIZACIÓN DE MATERIAL ---
const topMaterial = (txt='') => txt.split('\n').filter(Boolean).slice(0,3)
const tieneMas = (txt='') => txt.split('\n').filter(Boolean).length>3

// --- LÓGICA DE ESTADOS Y CLASES ---
const etiquetaEstado = e => ({'pendientes':'Pendiente','en-proceso':'En proceso','en-transito':'En tránsito','completados':'Completado'}[e]||'Pendiente')
const estadoClase = e => ({
  'pendientes':'bg-gray-200 text-gray-800 border border-gray-400',
  'en-proceso':'bg-yellow-200 text-yellow-900 border border-yellow-400',
  'en-transito':'bg-red-200 text-red-900 border border-red-400',
  'completados':'bg-green-200 text-green-900 border border-green-400'
}[e] || 'bg-gray-200 text-gray-800')

// --- ACCIONES DE LA VISTA ---
function abrirDetalle(c){ 
    // Aquí se abriría el panel lateral o modal para ver el detalle completo de la cirugía.
    console.log('Abrir detalle de cirugía:', c.id);
    toastStore.showToast(`Detalle de ${c.paciente} (PENDIENTE DE IMPLEMENTAR VISTA).`, 'info');
}

async function cambiarEstado(c, nuevoEstado){ 
    loading.value = true;
    await dashboardStore.updateCirugiaStatus(c.id, nuevoEstado);
    toastStore.showToast(`Estado de ${c.paciente} cambiado a ${etiquetaEstado(nuevoEstado)}.`, 'success');
    loading.value = false;
}

function toggleFull(){
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// --- HOOKS DE VUE ---
onMounted(() => { 
    // Aseguramos que los datos estén cargados al entrar a la vista.
    dashboardStore.fetchCirugias() 
    dashboardStore.subscribeToChanges()
    
    // Auto-refresh del tablero (opcional, si no confías totalmente en Realtime)
    refreshTimer = setInterval(dashboardStore.fetchCirugias, 2 * 60 * 1000); // Cada 2 minutos
})
</script>