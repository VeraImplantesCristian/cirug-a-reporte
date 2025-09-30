<!-- src/components/ToastNotification.vue -->
<template>
  <Transition name="toast">
    <div
      v-if="store.isVisible"
      :class="['fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white font-semibold flex items-center gap-2', {
        'bg-green-500': store.type === 'success',
        'bg-red-500': store.type === 'error',
        'bg-yellow-500': store.type === 'warning',
        'bg-blue-500': store.type === 'info',
      }]"
      role="alert"
    >
      <!-- Icono opcional según el tipo (puedes añadir SVG si quieres) -->
      <span v-if="store.type === 'success'">✅</span>
      <span v-else-if="store.type === 'error'">❌</span>
      <span v-else-if="store.type === 'warning'">⚠️</span>
      <span v-else>💡</span>
      {{ store.message }}
    </div>
  </Transition>
</template>

<script setup>
import { useToastStore } from '../stores/toastStore'

const store = useToastStore()
</script>

<style scoped>
/* Transiciones para el toast */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>