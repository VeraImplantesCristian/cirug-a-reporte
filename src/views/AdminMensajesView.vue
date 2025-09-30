<!-- src/views/AdminMensajesView.vue -->
<template>
  <div class="space-y-[var(--gap)]">
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-[var(--text)]">Gestión de Plantillas de Reporte</h1>
      <p class="text-[var(--muted)] mt-1">Personalice los textos y el formato de las notificaciones de correo y WhatsApp.</p>
    </header>

    <!-- Indicador de Carga/Error -->
    <div v-if="configStore.loading" class="text-center p-8 text-lg text-gray-500">
      Cargando plantillas...
    </div>
    <div v-else-if="configStore.error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <p>Error: {{ configStore.error }}</p>
    </div>

    <!-- Formulario de Edición de Plantillas y Etiquetas -->
    <div v-else class="card-style p-6">
      
      <!-- Guía de Variables Disponibles -->
      <h3 class="text-xl font-bold text-[var(--text)] border-b pb-2 mb-4">1. Plantillas de Cuerpo y Asunto</h3>
      <div class="text-sm text-blue-600 mb-6 bg-blue-50 p-3 rounded-md">
        <p class="font-bold mb-1">Variables de Reporte disponibles:</p>
        <code class="font-mono text-gray-800">
          {CLIENTE}, {PACIENTE}, {MEDICO}, {INSTRUMENTADOR}, {FECHA}, {LUGAR}, {TIPO_CIRUGIA}, {EMAIL_CLIENTE}
        </code>
      </div>

      <div class="space-y-6">
        <!-- Asunto de Correo Base -->
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label for="asunto_base" class="block font-semibold text-sm text-[var(--text)] mb-2">Asunto de Correo Base</label>
          <input id="asunto_base" type="text" v-model="editState.asunto_base" class="form-input" />
          <p class="text-xs text-[var(--muted)] mt-1">Ejemplo: Reporte Cirugía: {CLIENTE} - {PACIENTE}</p>
        </div>

        <!-- CAMPO CLAVE: Plantilla de Estructura de Datos Principales (Multilínea) -->
        <div class="p-4 border border-red-200 rounded-lg bg-red-50">
          <label for="estructura_datos_principales" class="block font-semibold text-sm text-[var(--text)] mb-2">Plantilla de Estructura de Datos Principales</label>
          <textarea id="estructura_datos_principales" v-model="editState.estructura_datos_principales" rows="10" class="form-input !h-auto font-mono"></textarea>
          <p class="text-xs text-red-700 font-bold mt-1">
            Cada línea genera una línea en el reporte. Aquí edita las etiquetas, el orden y los separadores (ej: <code>➡︎ Cliente: {CLIENTE}</code>).
          </p>
        </div>
        
        <!-- Línea de Inicio del Reporte -->
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label for="cuerpo_reporte_inicio" class="block font-semibold text-sm text-[var(--text)] mb-2">Línea de Inicio del Reporte</label>
          <textarea id="cuerpo_reporte_inicio" v-model="editState.cuerpo_reporte_inicio" rows="2" class="form-input !h-auto"></textarea>
          <p class="text-xs text-[var(--muted)] mt-1">El texto que aparece justo después del título "Reporte de Cirugía".</p>
        </div>
        
        <!-- Cierre y Saludos -->
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label for="msg_saludos_final" class="block font-semibold text-sm text-[var(--text)] mb-2">Cierre y Saludos</label>
          <textarea id="msg_saludos_final" v-model="editState.msg_saludos_final" rows="2" class="form-input !h-auto"></textarea>
          <p class="text-xs text-[var(--muted)] mt-1">El texto final del cuerpo del reporte (ej. Equipo de Coordinación Districorr).</p>
        </div>

        <!-- Título de Material Requerido -->
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label for="cuerpo_material_requerido" class="block font-semibold text-sm text-[var(--text)] mb-2">Título de Material Requerido</label>
          <input id="cuerpo_material_requerido" v-model="editState.cuerpo_material_requerido" class="form-input" />
          <p class="text-xs text-[var(--muted)] mt-1">El título de la sección de materiales.</p>
        </div>
      </div>
      
      <!-- Sección 2: Etiquetas individuales (Solo para el caso de necesitar una etiqueta separada) -->
      <h3 class="text-xl font-bold text-[var(--text)] border-b pb-2 mb-4 mt-10">2. Etiquetas de Campos (Individuales)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Iteramos solo sobre las claves que son etiquetas (etiqueta_cliente, etc.) -->
        <div v-for="(clave, index) in etiquetaKeys" :key="clave" :class="{'p-4 border border-gray-200 rounded-lg bg-gray-50': true}">
          <label :for="clave" class="block font-semibold text-sm text-[var(--text)] mb-2">{{ getMessageLabel(clave) }} (<code>{{ clave }}</code>)</label>
          <input :id="clave" type="text" v-model="editState[clave]" class="form-input" />
          <p class="text-xs text-[var(--muted)] mt-1">Solo si necesita usar esta etiqueta individualmente.</p>
        </div>
      </div>

      <!-- Botón de Guardado -->
      <div class="mt-8 pt-4 border-t border-gray-200">
        <button 
          @click="handleSave" 
          :disabled="isSaving"
          class="btn-primary w-full md:w-auto"
        >
          {{ isSaving ? 'Guardando...' : '💾 Guardar Cambios' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue';
import { useConfigStore } from '../stores/configStore';
import { useToastStore } from '../stores/toastStore';
import { supabase } from '../supabase';

const configStore = useConfigStore();
const toastStore = useToastStore();
const isSaving = ref(false);
const editState = reactive({});

// Definiciones de los campos (para Labels y descripciones)
const MESSAGE_DEFINITIONS = {
  asunto_base: { label: 'Asunto de Correo Base' },
  estructura_datos_principales: { label: 'Plantilla de Datos Principales' }, // NUEVO
  cuerpo_reporte_inicio: { label: 'Línea de Inicio del Reporte' },
  cuerpo_material_requerido: { label: 'Título de Material Requerido' },
  msg_saludos_final: { label: 'Cierre y Saludos' },
  etiqueta_cliente: { label: 'Etiqueta Cliente' },
  etiqueta_paciente: { label: 'Etiqueta Paciente' },
  etiqueta_medico: { label: 'Etiqueta Médico' },
  etiqueta_instrumentador: { label: 'Etiqueta Instrumentador' },
  etiqueta_fecha: { label: 'Etiqueta Fecha de Cirugía' },
  etiqueta_lugar: { label: 'Etiqueta Lugar de Cirugía' },
  etiqueta_tipo_cirugia: { label: 'Etiqueta Tipo de Cirugía' },
  etiqueta_email_cliente: { label: 'Etiqueta Email Cliente' },
};

// Propiedad computada para obtener solo las claves que son etiquetas
const etiquetaKeys = computed(() => {
    return Object.keys(MESSAGE_DEFINITIONS).filter(key => key.startsWith('etiqueta_'));
});

// Función auxiliar para obtener la etiqueta
const getMessageLabel = (clave) => MESSAGE_DEFINITIONS[clave]?.label || clave;


// Carga inicial y sincronización del estado de edición
onMounted(async () => {
  await configStore.fetchMensajes();
  Object.assign(editState, configStore.mensajes);
});

const handleSave = async () => {
  isSaving.value = true;
  let hasError = false;
  
  try {
    for (const clave in editState) {
      if (editState[clave] !== configStore.mensajes[clave]) {
        const { error } = await supabase
          .from('configuracion')
          .update({ valor: editState[clave] })
          .eq('clave', clave);

        if (error) {
          console.error(`Error guardando ${clave}:`, error);
          hasError = true;
          toastStore.showToast(`Error al guardar '${getMessageLabel(clave)}'.`, 'error');
          break; 
        }
      }
    }

    if (!hasError) {
      await configStore.fetchMensajes(); 
      Object.assign(editState, configStore.mensajes); 
      toastStore.showToast('Plantillas guardadas con éxito.', 'success');
    }

  } catch (e) {
    console.error('Error inesperado al guardar la configuración:', e);
    toastStore.showToast('Error inesperado al guardar la configuración.', 'error');
  } finally {
    isSaving.value = false;
  }
};
</script>