<!-- src/components/BaseModal.vue -->
<template>
  <!-- El componente Transition de Vue nos permite animar la entrada y salida del modal -->
  <Transition name="modal">
    <!-- Usamos v-if="modelValue" para mostrar u ocultar todo el modal -->
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <!-- Cabecera del Modal -->
        <header class="p-4 border-b flex justify-between items-center">
          <h3 class="text-xl font-semibold">{{ title }}</h3>
          <button @click="$emit('update:modelValue', false)" class="text-2xl hover:text-red-500">&times;</button>
        </header>

        <!-- Cuerpo del Modal (contenido personalizable) -->
        <section class="p-6 overflow-y-auto">
          <slot name="body"></slot>
        </section>

        <!-- Pie del Modal (contenido personalizable) -->
        <footer class="p-4 border-t flex justify-end gap-4">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
// Definimos las propiedades que el componente puede recibir del padre.
defineProps({
  modelValue: { // Permite usar v-model para controlar la visibilidad.
    type: Boolean,
    required: true
  },
  title: { // El título que se mostrará en la cabecera.
    type: String,
    default: 'Modal'
  }
})

// Definimos los eventos que el componente puede emitir hacia el padre.
defineEmits(['update:modelValue'])
</script>

<style>
/* Estilos para la animación de entrada y salida del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>