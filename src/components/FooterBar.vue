<!-- src/components/FooterBar.vue -->
<template>
  <!-- Usamos un z-index más alto (z-50) para estar seguros de que cubre el scrollbar -->
  <footer class="fixed bottom-0 left-0 right-0 bg-[var(--card)]/95 backdrop-blur-sm border-t border-gray-200/80 z-50">
    <!-- Reducimos el padding horizontal a px-2 en móvil para aprovechar el espacio -->
    <div class="max-w-[var(--container)] mx-auto px-2 sm:px-6 lg:px-8">
      
      <!-- Fila Única de Botones (h-12 para lo más delgado posible) -->
      <div class="flex items-center justify-between h-12 gap-1 sm:gap-2 w-full"> 
        
        <!-- Grupo Izquierdo: Limpiar, Guardar y Compartir (Compacto) -->
        <div class="flex items-center gap-1 shrink-0">
          <!-- Botón Limpiar (Escoba) - Se mantiene fijo para ser tocable -->
          <button 
            @click="triggerAndLog('resetForm')" 
            class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center text-lg shrink-0"
            title="Limpiar Formulario"
          >
            🧹
          </button>
          
          <!-- CAMBIO CLAVE: Botón Principal: GUARDAR (Verde) -->
          <button @click="triggerAndLog('save')" class="btn-primary bg-green-600 text-sm px-1 py-1.5 shrink-0">
            💾 Guardar/Ver
          </button>

          <!-- Botón de Compartir (Menú) -->
          <DropdownMenu 
            label="🔗 Compartir" 
            :options="shareOptions" 
            @option-click="handleShare" 
            :drop-up="true" 
            class="shrink-0"
          />
        </div>
        
        <!-- Grupo Derecho: Solicitud de Pedido (Único Botón de Servicio) -->
        <div class="flex items-center gap-1 sm:gap-2 shrink-0">
          
          <!-- Botón de Solicitud de Pedido (Compacto) -->
          <button @click="triggerAndLog('solicitarPedido')" class="bg-yellow-500 text-gray-800 px-2 py-1.5 rounded-lg hover:bg-yellow-600 font-bold transition-colors shadow-sm text-sm shrink-0">
            📧 Pedido
          </button>
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

const clienteSeleccionadoConEmail = computed(() => {
  const nombreCliente = formStore.formState.cliente;
  if (!nombreCliente) return false;
  
  const cliente = clientesStore.allClients.find(c => c.nombre === nombreCliente);
  // Guardamos el email en el formState temporalmente
  formStore.formState.email_cliente = cliente ? cliente.email : null;
  return cliente && cliente.email;
});

// Lógica para el menú Compartir (incluye el envío auditable si es posible)
const handleShare = (option) => {
    // Si la opción es "Enviar a Cliente", disparamos la acción auditable
    if (option.id === 'send-client') {
        formStore.triggerSendAuditableMail('cliente');
        return;
    }
    // Para el resto de opciones (WhatsApp, Email Genérico, Print, Image)
    formStore.triggerShare(option);
}

// Opciones de Compartir (Incluye el envío a cliente en el menú si hay email)
const shareOptions = computed(() => {
    const options = [
        { id: 'whatsapp', label: '📲 Compartir (WhatsApp)' },
        { id: 'email', label: '✉️ Compartir (Email Genérico)' },
    ];

    if (clienteSeleccionadoConEmail.value) {
        options.unshift({ id: 'send-client', label: '✉️ Enviar a Cliente' });
        options.unshift({ id: 'divider-1', label: '---', disabled: true });
    }
    
    options.push(
        { id: 'divider-2', label: '---', disabled: true },
        { id: 'print', label: '🖨️ Imprimir / PDF' },
        { id: 'image', label: '🖼️ Guardar como Imagen' },
    );
    return options;
});


// --- UTILITY: Mapeo de Triggers ---
const triggerMap = {
    // Principal: Guardar (que ahora dispara saveReport)
    'save': formStore.triggerSaveReport, 
    // Pedido
    'solicitarPedido': formStore.triggerSolicitarPedido,
    // Limpiar
    'resetForm': formStore.triggerResetForm,
};

// --- MANEJADOR DE ACCIONES PRINCIPALES (CON LOG Y COMPROBACIONES) ---
const triggerAndLog = (actionId, payload = null) => {
    console.log(`FooterAction: Disparando acción => ${actionId}`);
    const triggerFunc = triggerMap[actionId];
    if (triggerFunc) {
        triggerFunc(payload);
    }
};
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
