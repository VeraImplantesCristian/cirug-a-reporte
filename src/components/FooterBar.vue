<!-- src/components/FooterBar.vue -->
<template>
  <!-- Usamos un z-index más alto (z-50) para estar seguros de que cubre el scrollbar -->
  <footer class="fixed bottom-0 left-0 right-0 bg-[var(--card)]/95 backdrop-blur-sm border-t border-gray-200/80 z-50">
    <!-- Contenedor: Usamos flexbox simple para manejar el espaciado -->
    <div class="max-w-[var(--container)] mx-auto px-2 sm:px-6 lg:px-8">
      
      <!-- CAMBIO CLAVE: Contenedor con Grid de 4 Columnas Iguales en móvil/escritorio -->
      <div class="grid grid-cols-4 gap-2 h-12 w-full"> 
        
        <!-- Botón 1: Limpiar (Icono) -->
        <button 
          @click="triggerAndLog('resetForm')" 
          class="bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center text-lg font-bold"
          title="Limpiar Formulario"
        >
          🧹
        </button>
        
        <!-- Botón 2: GUARDAR Y VER (Principal) -->
        <button @click="triggerAndLog('generatePreview')" class="btn-primary bg-green-600 text-sm py-1.5 rounded-lg">
          💾 Guardar/Ver
        </button>
        
        <!-- Botón 3: SOLICITAR PEDIDO -->
        <button @click="triggerAndLog('solicitarPedido')" class="bg-yellow-500 text-gray-800 text-sm py-1.5 rounded-lg hover:bg-yellow-600 font-bold transition-colors shadow-sm">
          📧 Pedido
        </button>

        <!-- Botón 4: ACCIONES / COMPARTIR -->
        <DropdownMenu 
          label="🔗 Compartir" 
          :options="shareOptions" 
          @option-click="handleShare" 
          :drop-up="true" 
          class="shrink-0"
        />

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
    // La acción principal de 'Guardar/Ver' llama a generatePreview (que tiene guardado implícito)
    'generatePreview': formStore.triggerGeneratePreview, 
    'solicitarPedido': formStore.triggerSolicitarPedido,
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
    /* Ajuste para el grid: aseguramos que el texto sea visible */
    @apply text-sm md:text-base font-bold; 
}
.btn-secondary {
    @apply text-xs md:text-sm;
}
</style>
