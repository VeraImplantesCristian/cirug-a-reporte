<!-- src/components/FooterBar.vue -->
<template>
  <!-- Usamos un z-index más alto (z-50) para estar seguros de que cubre el scrollbar -->
  <footer class="fixed bottom-0 left-0 right-0 bg-[var(--card)]/95 backdrop-blur-sm border-t border-gray-200/80 z-50">
    <!-- Reducimos el padding horizontal a px-2 en móvil para aprovechar el espacio -->
    <div class="max-w-[var(--container)] mx-auto px-2 sm:px-6 lg:px-8">
      
      <!-- Fila Única de Botones (h-12 para lo más delgado posible) -->
      <div class="flex items-center justify-between h-12 gap-1 sm:gap-2 w-full"> 
        
        <!-- Grupo Izquierdo: Limpiar y Guardar/Ver (Prioridad 1) -->
        <div class="flex items-center gap-1 shrink-0">
          <!-- Botón Limpiar (Escoba) - Se mantiene fijo para ser tocable -->
          <button 
            @click="triggerAndLog('resetForm')" 
            class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center text-lg shrink-0"
            title="Limpiar Formulario"
          >
            🧹
          </button>
          
          <!-- Botón Principal: GUARDAR/VER -->
          <button @click="triggerAndLog('saveAndPreview')" class="btn-primary bg-green-600 text-sm px-3 py-1.5 shrink-0">
            💾 Guardar/Ver
          </button>

          <!-- Menú de Acciones Secundarias (Vista Previa, Enviar, Compartir) -->
          <DropdownMenu 
            label="⚙️ Acciones" 
            :options="actionOptions" 
            @option-click="handleActionMenu" 
            :drop-up="true" 
            class="shrink-0"
          />
        </div>
        
        <!-- Grupo Central: Solicitud de Pedido (Único Botón de Servicio) -->
        <div class="flex items-center gap-1 sm:gap-2 shrink-0">
          
          <!-- Botón de Solicitud de Pedido (Compacto) -->
          <button @click="triggerAndLog('solicitarPedido')" class="bg-yellow-500 text-gray-800 px-2 py-1 rounded-lg hover:bg-yellow-600 font-bold transition-colors shadow-sm text-xs shrink-0">
            📧 Pedido
          </button>

          <!-- El botón Ver fue eliminado para simplificar el layout móvil -->
        </div>

      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useFormStore } from '../stores/formStore';
import { useClientesStore } from '../stores/clientesStore';
import DropdownMenu from './DropdownMenu.vue';

const formStore = useFormStore();
const clientesStore = useClientesStore();

// --- DEFINICIÓN DE ESTADO Y COMPUTED ---

// FUNCIÓN DE AISLAMIENTO: Obtiene el cliente seleccionado y su email
const getClienteSeleccionado = () => {
  const nombreCliente = formStore.formState.cliente;
  if (!nombreCliente) return null;
  return clientesStore.allClients.find(c => c.nombre === nombreCliente);
};

// FUNCIÓN PARA VERIFICAR EMAIL (USADA PARA VISIBILIDAD DEL MENÚ)
const checkCanSendEmail = () => {
  const cliente = getClienteSeleccionado();
  // Sincronizamos el email en el formState aquí.
  formStore.formState.email_cliente = cliente ? cliente.email : null;
  return cliente && cliente.email;
};

// --- OPCIONES DE MENÚ DE ACCIONES (Actualizado para usar checkCanSendEmail) ---
const actionOptions = computed(() => {
    // Aseguramos que el email se actualice antes de construir el menú.
    const canSend = checkCanSendEmail();
    
    const options = [
        { id: 'show-preview', label: '📝 Vista Previa' },
        { id: 'divider-1', label: '---', disabled: true },
    ];
    
    if (canSend) { // Usamos la función de chequeo
        options.push({ id: 'send-client', label: '✉️ Enviar a Cliente' });
    }
    
    options.push(
        { id: 'divider-2', label: '---', disabled: true },
        { id: 'share-whatsapp', label: '📲 Compartir (WhatsApp)' },
        { id: 'share-email', label: '✉️ Compartir (Email Genérico)' },
        { id: 'share-print', label: '🖨️ Imprimir / PDF' },
        { id: 'share-image', label: '🖼️ Guardar como Imagen' },
    );
    return options;
});

// --- UTILITY: Mapeo de Triggers ---
const triggerMap = {
    // La acción principal de 'Guardar/Ver' llama al trigger de GeneratePreview
    'saveAndPreview': formStore.triggerGeneratePreview, 
    'solicitarPedido': formStore.triggerSolicitarPedido,
    'resetForm': formStore.triggerResetForm,
};

// --- MANEJADOR DE ACCIONES PRINCIPALES (CON LOG Y COMPROBACIONES) ---
const triggerAndLog = (actionId, payload = null) => {
    console.log(`FooterAction: Disparando acción => ${actionId}`);
    const triggerFunc = triggerMap[actionId];
    if (triggerFunc) {
        triggerFunc(payload);
    } else {
        console.warn(`FooterAction: No se encontró función para la acción ID: ${actionId}`);
    }
};

// MANEJADOR DEL MENÚ DE ACCIONES
const handleActionMenu = (option) => {
    switch (option.id) {
        case 'show-preview':
            // Dispara el Guardar/Ver que está en el ReporteFormView
            triggerAndLog('saveAndPreview'); 
            break;
        case 'send-client':
            formStore.triggerSendAuditableMail('cliente');
            break;
        case 'share-whatsapp':
            formStore.triggerShare({ id: 'whatsapp' });
            break;
        case 'share-email':
            formStore.triggerShare({ id: 'email' });
            break;
        case 'share-print':
            formStore.triggerShare({ id: 'print' });
            break;
        case 'share-image':
            formStore.triggerShare({ id: 'image' });
            break;
    }
}
</script>

<style scoped>
/* Las clases de btn-primary y btn-secondary deben estar definidas globalmente en src/style.css. */
.btn-primary {
    @apply text-sm md:text-base;
}
.btn-secondary {
    @apply text-xs md:text-sm;
}
</style>
