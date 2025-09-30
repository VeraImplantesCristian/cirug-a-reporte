<!-- src/components/FooterBar.vue -->
<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-[var(--card)]/95 backdrop-blur-sm border-t border-gray-200/80 z-40">
    <div class="max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20 gap-4">
        
        <!-- Lado izquierdo: Acciones secundarias -->
        <div class="flex items-center gap-3">
          <!-- Botón de Guardar Reporte -->
          <button @click="formStore.triggerSaveReport()" class="btn-secondary bg-[var(--ok)]">
            💾 Guardar
          </button>
          
          <!-- 
            CAMBIO CLAVE: Volvemos al botón simple de Envío,
            ya que sólo queda una opción (Enviar a Cliente).
            Esto simplifica la UX.
          -->
          <button 
            v-if="canSendEmail"
            @click="handleSendClientReport" 
            class="btn-secondary bg-teal-500"
          >
            ✉️ Enviar a Cliente
          </button>
          
          <!-- Menú de compartir (abre hacia ARRIBA: drop-up="true") -->
          <DropdownMenu 
            label="🔗 Compartir" 
            :options="shareOptions" 
            @option-click="handleShare" 
            :drop-up="true" 
          />
        </div>

        <!-- Centro: Acción de solicitud de material -->
        <div>
          <button @click="formStore.triggerSolicitarPedido()" class="bg-yellow-500 text-gray-800 px-5 py-3 rounded-lg hover:bg-yellow-600 font-bold transition-colors shadow-md">
            📧 Solicitar Pedido
          </button>
        </div>

        <!-- Lado derecho: Acción Principal -->
        <div>
          <button @click="formStore.triggerGeneratePreview()" class="btn-primary">
            📝 Vista Previa
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

// --- OPCIONES DE EMAILS FIJOS ELIMINADAS ---
// const EMAIL_INTERNO = 'coordinacion@districorr.com.ar';
// const EMAIL_ART = 'autorizaciones@art-implantes.com';


// Computada para saber si el cliente actual tiene email (se usa para mostrar el botón)
const clienteSeleccionadoConEmail = computed(() => {
  const nombreCliente = formStore.formState.cliente;
  if (!nombreCliente) return false;
  
  const cliente = clientesStore.allClients.find(c => c.nombre === nombreCliente);
  // Guardamos el email en el formState temporalmente
  formStore.formState.email_cliente = cliente ? cliente.email : null;
  return cliente && cliente.email;
});

// NUEVO: canSendEmail ahora solo verifica si hay email de cliente
const canSendEmail = computed(() => {
  return clienteSeleccionadoConEmail.value;
});

// NUEVA FUNCIÓN: Dispara la acción de envío auditable para el Cliente
const handleSendClientReport = () => {
    // Disparamos la acción de envío al CLIENTE (tipo 'cliente')
    formStore.triggerSendAuditableMail('cliente');
}

// La función que dispara la acción de compartir en el store.
const handleShare = (option) => {
  formStore.triggerShare(option);
}


// El resto de opciones de compartir (no cambian)
const shareOptions = [
  { id: 'whatsapp', label: '📲 Enviar por WhatsApp' },
  { id: 'email', label: '✉️ Enviar por Email (Mailto)' },
  { id: 'print', label: '🖨️ Imprimir / PDF' },
  { id: 'image', label: '🖼️ Guardar como Imagen' },
];
</script>