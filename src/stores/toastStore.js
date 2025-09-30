// src/stores/toastStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const type = ref('info') // success, error, warning, info
  const isVisible = ref(false)
  let timeoutId = null

  const showToast = (msg, toastType = 'info', duration = 3000) => {
    // Limpiar cualquier timeout anterior
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    message.value = msg
    type.value = toastType
    isVisible.value = true

    // Ocultar el toast después de la duración especificada
    timeoutId = setTimeout(() => {
      isVisible.value = false
      timeoutId = null
    }, duration)
  }

  return {
    message,
    type,
    isVisible,
    showToast
  }
})