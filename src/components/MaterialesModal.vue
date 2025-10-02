<!-- src/components/MaterialesModal.vue -->
<template>
  <!-- Asumimos que BaseModal es un componente funcional que maneja el backdrop y el slot -->
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Seleccionar Materiales"
  >
    <template #body>
      <!-- Barra de Búsqueda -->
      <div class="mb-4">
        <input 
          v-model="searchQuery" 
          placeholder="Buscar por código o descripción..." 
          class="w-full p-2 border rounded-md"
        />
      </div>

      <!-- Lista de Materiales Agrupados -->
      <div class="h-80 overflow-y-auto border rounded-md p-2">
        <div v-if="materialesStore.loading" class="text-center py-4 text-gray-500">Cargando materiales...</div>
        <div v-else-if="Object.keys(materialesAgrupados).length === 0" class="text-center py-4 text-gray-500">No se encontraron materiales.</div>
        
        <div v-for="(materiales, categoria) in materialesAgrupados" :key="categoria" class="mb-4">
          <h3 class="font-semibold text-sm bg-gray-100 p-2 rounded-t-md sticky top-0">{{ categoria }} ({{ materiales.length }})</h3>
          
          <!-- Lista de Checkboxes -->
          <ul class="space-y-1 pt-1">
            <li v-for="material in materiales" :key="material.id" class="flex items-center justify-between p-1 hover:bg-blue-50/50 cursor-pointer">
              <label :for="`mat-${material.id}`" class="flex-1 cursor-pointer flex items-center">
                <input 
                  type="checkbox" 
                  :id="`mat-${material.id}`" 
                  :value="material"
                  v-model="materialesSeleccionados" 
                  class="mr-2 rounded text-blue-600 focus:ring-blue-500"
                />
                <div class="min-w-0">
                    <span class="font-mono text-xs text-gray-600 block">{{ material.code }}</span>
                    <span class="ml-2 text-sm text-gray-800 block">{{ material.description }}</span>
                </div>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <template #footer>
      <button @click="$emit('update:modelValue', false)" class="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">
        Cancelar
      </button>
      <button @click="handleConfirmar" :disabled="materialesSeleccionados.length === 0" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
        Añadir Seleccionados ({{ materialesSeleccionados.length }})
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import { useMaterialesStore } from '../stores/materialesStore';

const materialesStore = useMaterialesStore();

// --- PROPS & EMITS ---
defineProps({
  modelValue: { type: Boolean, required: true }
});
const emit = defineEmits(['update:modelValue', 'confirmar']);

// --- ESTADO LOCAL ---
const searchQuery = ref('');
const materialesSeleccionados = ref([]);

// --- COMPUTED / FILTRADO ---

// Filtra la lista maestra del store antes de agrupar.
const materialesFiltrados = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return materialesStore.todosMateriales;

  return materialesStore.todosMateriales.filter(m => 
    m.code?.toLowerCase().includes(query) || m.description?.toLowerCase().includes(query)
  );
});

// Agrupa la lista filtrada por categoría
const materialesAgrupados = computed(() => {
  const matAgrupados = {};
  materialesFiltrados.value.forEach(item => {
    const categoria = item.categoria || 'Sin Categoría';
    if (!matAgrupados[categoria]) {
      matAgrupados[categoria] = [];
    }
    matAgrupados[categoria].push(item);
  });
  return matAgrupados;
});

// --- LÓGICA DE EVENTOS ---

// Limpia las selecciones al abrir/cerrar el modal
watch(() => props.modelValue, (isOpening) => {
    if (isOpening) {
        materialesSeleccionados.value = [];
        searchQuery.value = '';
    }
});

const handleConfirmar = () => {
  // Concatena el código y la descripción de los materiales seleccionados, separados por nueva línea.
  const materialesTexto = materialesSeleccionados.value
    .map(m => `${m.code ? m.code + ' - ' : ''}${m.description}`)
    .join('\n');
    
  emit('confirmar', materialesTexto);
  emit('update:modelValue', false);
};
</script>
