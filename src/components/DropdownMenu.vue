<!-- src/components/DropdownMenu.vue -->
<template>
<<<<<<< HEAD
  <!-- 
    Añadimos un z-index alto (z-50) y un z-index aún mayor (z-[60])
    al menú desplegable para asegurar que siempre esté por encima del FooterBar (z-40).
  -->
  <div class="relative inline-block text-left z-50"> 
    <button 
      @click="isOpen = !isOpen" 
      type="button" 
      class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand)]"
    >
      {{ label }}
      <svg class="-mr-1 ml-2 h-5 w-5" :class="{'rotate-180': isOpen}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <div 
        v-if="isOpen" 
        class="origin-top-right absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-[60]" 
        :class="{
          'bottom-full mb-2': dropUp, // Si dropUp es true (ej: en el FooterBar), se abre hacia arriba (bottom-full)
          'top-full mt-2': !dropUp // Si dropUp es false (o default), se abre hacia abajo (top-full)
        }"
      >
        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <a v-for="option in options" :key="option.id" @click="selectOption(option)" href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
=======
  <div class="relative inline-block text-left" ref="dropdownRef">
    <div>
      <button
        @click="isOpen = !isOpen"
        type="button"
        class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        {{ label }}
        <!-- Icono de flecha hacia abajo -->
        <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Contenido del menú desplegable con animación -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
      >
        <div class="py-1">
          <a
            v-for="option in options"
            :key="option.id"
            href="#"
            @click.prevent="handleOptionClick(option)"
            class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
          >
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
            {{ option.label }}
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { ref } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true },
  dropUp: { type: Boolean, default: false } // NUEVA PROP: Controla si el menú se abre hacia arriba
});

const emit = defineEmits(['option-click']);

const isOpen = ref(false);

const selectOption = (option) => {
  emit('option-click', option);
  isOpen.value = false;
};
=======
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  label: { type: String, default: 'Opciones' },
  options: { type: Array, required: true }
})
const emit = defineEmits(['option-click'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const handleOptionClick = (option) => {
  isOpen.value = false
  emit('option-click', option)
}

// Cierra el menú si se hace clic fuera de él.
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
</script>