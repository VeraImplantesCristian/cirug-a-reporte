<template>
  <!-- Contenedor principal con un fondo sutil para resaltar las tarjetas -->
  <div class="bg-gray-50 min-h-screen font-sans p-4">
    <div class="max-w-lg mx-auto">
      
      <!-- Título de la sección -->
      <h1 class="text-3xl font-bold text-gray-800 mb-2 text-center">Herramienta Pivot</h1>
      <p class="text-gray-600 mb-6 text-center">Generá mensajes de forma rápida y eficiente.</p>

      <!-- Formulario encapsulado en una tarjeta -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <form @submit.prevent="generarMensajes" class="space-y-5">
          
          <!-- Campo Cliente con Autocompletado -->
          <div class="relative">
            <label for="cliente" class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-6">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <!-- El atributo 'list' conecta este input con el <datalist> de abajo -->
            <input v-model="formData.cliente" type="text" id="cliente" list="clientes-list" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Ej: OSDE">
            <!-- DATALIST: Contiene las opciones de autocompletado para Clientes -->
            <datalist id="clientes-list">
              <option v-for="cliente in pivotStore.sugerencias.clientes" :key="cliente" :value="cliente" />
            </datalist>
          </div>

          <!-- Campo Nosocomio con Autocompletado -->
          <div class="relative">
            <label for="nosocomio" class="block text-sm font-medium text-gray-700 mb-1">Nosocomio</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-6">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <input v-model="formData.nosocomio" type="text" id="nosocomio" list="nosocomios-list" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Ej: Hospital Italiano">
            <datalist id="nosocomios-list">
              <option v-for="nosocomio in pivotStore.sugerencias.nosocomios" :key="nosocomio" :value="nosocomio" />
            </datalist>
          </div>

          <!-- Campo Doctor con Autocompletado -->
          <div class="relative">
            <label for="doctor" class="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-6">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <input v-model="formData.doctor" type="text" id="doctor" list="doctores-list" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Ej: Dr. Favaloro">
            <datalist id="doctores-list">
              <option v-for="doctor in pivotStore.sugerencias.doctores" :key="doctor" :value="doctor" />
            </datalist>
          </div>

          <!-- Campo Paciente (sin autocompletado) -->
          <div class="relative">
            <label for="paciente" class="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-6">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <input v-model="formData.paciente" type="text" id="paciente" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Ej: Juan Pérez">
          </div>

          <!-- Campos de texto libre -->
          <div>
            <label for="implantes" class="block text-sm font-medium text-gray-700 mb-1">Implantes/Descartables</label>
            <textarea v-model="formData.implantes" id="implantes" rows="3" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Listar materiales..."></textarea>
          </div>
          <div>
            <label for="instrumental" class="block text-sm font-medium text-gray-700 mb-1">Instrumental</label>
            <textarea v-model="formData.instrumental" id="instrumental" rows="3" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Listar instrumental..."></textarea>
          </div>
          <div class="relative">
            <label for="disponibilidad" class="block text-sm font-medium text-gray-700 mb-1">Fecha de Disponibilidad</label>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-6">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <input v-model="formData.disponibilidad" type="date" id="disponibilidad" class="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          </div>

          <!-- Botón de acción principal -->
          <button 
            type="submit" 
            :disabled="pivotStore.loading"
            class="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors duration-200"
          >
            {{ pivotStore.loading ? 'Guardando...' : 'Generar Mensajes' }}
          </button>
        </form>
      </div>

      <!-- Resto del componente (mensajes de error y resultados) sin cambios -->
      <div v-if="pivotStore.error" class="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg shadow-sm">
        <p><strong>Error:</strong> {{ pivotStore.error }}</p>
      </div>
      <div v-if="mensajePrincipal" class="mt-8 space-y-6">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold text-gray-800">Mensaje de Cirugía</h3>
            <button @click="copiarTexto(mensajePrincipal, 'principal')" class="px-3 py-1 text-sm font-medium rounded-md flex items-center transition-colors duration-200" :class="isPrincipalCopied ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
              <svg v-if="!isPrincipalCopied" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <svg v-else class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              {{ isPrincipalCopied ? 'Copiado' : 'Copiar' }}
            </button>
          </div>
          <textarea readonly class="w-full h-56 p-2 bg-gray-50 border border-gray-200 rounded-md font-mono text-xs">{{ mensajePrincipal }}</textarea>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold text-gray-800">Instrucción para Coordinadores</h3>
            <button @click="copiarTexto(mensajeCoordinadores, 'coordinadores')" class="px-3 py-1 text-sm font-medium rounded-md flex items-center transition-colors duration-200" :class="isCoordinadoresCopied ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
              <svg v-if="!isCoordinadoresCopied" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <svg v-else class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              {{ isCoordinadoresCopied ? 'Copiado' : 'Copiar' }}
            </button>
          </div>
          <textarea readonly class="w-full h-20 p-2 bg-gray-50 border border-gray-200 rounded-md font-mono text-xs">{{ mensajeCoordinadores }}</textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Importamos 'onMounted' de Vue para ejecutar código cuando el componente se carga.
import { ref, reactive, onMounted } from 'vue';
import { usePivotStore } from '../stores/pivotStore';

const pivotStore = usePivotStore();

const formData = reactive({
  cliente: '',
  nosocomio: '',
  doctor: '',
  paciente: '',
  implantes: '',
  instrumental: '',
  disponibilidad: ''
});

const mensajePrincipal = ref('');
const mensajeCoordinadores = ref('➡ ️ Coordinadores: por favor confirmar fecha de cirugía, fecha de envío, observación y transporte.');

const isPrincipalCopied = ref(false);
const isCoordinadoresCopied = ref(false);

// ONMOUNTED HOOK: Se ejecuta una sola vez, cuando el componente está listo en el DOM.
// Es el lugar perfecto para cargar los datos iniciales.
onMounted(() => {
  pivotStore.cargarSugerencias();
});

const generarMensajes = async () => {
  let fechaFormateada = '';
  if (formData.disponibilidad) {
    const [year, month, day] = formData.disponibilidad.split('-');
    fechaFormateada = `${day}/${month}/${year.slice(-2)}`;
  }

  mensajePrincipal.value = `🔔 CIRUGÍA A PROGRAMAR
 🛑 Cliente : ${formData.cliente}
 🏥 Nosocomio: ${formData.nosocomio}
👨‍⚕️ Dr: ${formData.doctor}
🧍 Paciente: ${formData.paciente}
 📌Implantes/Descartables Autorizados:
${formData.implantes}
📌 Instrumental Autorizado: 
${formData.instrumental}
   
📆 Disponibilidad del material hacia la institución a partir del: ${fechaFormateada}`;

  await pivotStore.guardarSugerencias(formData);
};

const copiarTexto = async (texto, tipo) => {
  try {
    await navigator.clipboard.writeText(texto);
    
    if (tipo === 'principal') {
      isPrincipalCopied.value = true;
      setTimeout(() => { isPrincipalCopied.value = false; }, 2000);
    } else if (tipo === 'coordinadores') {
      isCoordinadoresCopied.value = true;
      setTimeout(() => { isCoordinadoresCopied.value = false; }, 2000);
    }

  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
  }
};
</script>