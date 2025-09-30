<!-- src/App.vue -->
<template>
  <!-- CONTENEDOR PRINCIPAL DE TODA LA APLICACIÓN -->
<<<<<<< HEAD
  <!-- Usamos nuestras variables CSS para el fondo y el color de texto por defecto. -->
  <div class="min-h-screen bg-[var(--bg)] text-[var(--text)]">
    
    <!-- BARRA DE NAVEGACIÓN (HEADER) -->
    <header class="bg-[var(--card)]/95 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-40 print:hidden">
      <!-- El contenido del header se alinea con el contenedor principal usando 'max-w-[var(--container)]'. -->
      <div class="wrapper max-w-[var(--container)] mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center justify-between h-16">
          <!-- Logo y Enlaces Principales -->
          <div class="flex items-center gap-4">
            <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" class="h-10 w-auto" />
            
            <!-- Enlace al Formulario -->
            <RouterLink 
              to="/" 
              class="text-gray-800 font-semibold hover:text-[var(--brand)] transition-colors"
            >
              Formulario
            </RouterLink>
            <!-- Enlace al Dashboard -->
            <RouterLink 
              to="/dashboard" 
              class="text-gray-800 font-semibold hover:text-[var(--brand)] transition-colors"
            >
              Dashboard
=======
  <!-- 'min-h-screen' asegura que el fondo ocupe al menos toda la altura de la ventana. -->
  <div class="min-h-screen bg-gray-100">
    <!-- BARRA DE NAVEGACIÓN (HEADER) -->
    <!-- 'sticky top-0 z-40' mantiene el header visible y fijo en la parte superior al hacer scroll. -->
    <!-- 'print:hidden' oculta la barra de navegación al imprimir el contenido de la página. -->
    <header class="bg-white shadow-sm sticky top-0 z-40 print:hidden">
      <div class="wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center justify-between h-16">
          <!-- Logo y Enlace Directo al Formulario Principal -->
          <div class="flex items-center gap-4">
            <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" class="h-10 w-auto" />
            <RouterLink 
              to="/" 
              class="text-gray-800 font-semibold hover:text-blue-600 transition-colors"
            >
              Formulario de Reportes
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
            </RouterLink>
          </div>

          <!-- Menú Desplegable para Opciones de Administración -->
<<<<<<< HEAD
=======
          <!-- Agrupa todos los enlaces a las páginas de administración para una navegación limpia. -->
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
          <div>
            <DropdownMenu 
              label="⚙️ Administración" 
              :options="adminOptions"
              @option-click="handleAdminNavigation"
            />
          </div>
        </nav>
      </div>
    </header>

    <!-- CONTENIDO PRINCIPAL DE LA APLICACIÓN -->
<<<<<<< HEAD
    <main class="max-w-[var(--container)] mx-auto p-4 md:p-8">
      <RouterView />
    </main>

    <Teleport to="#modals-container">
      <ToastNotification />
    </Teleport>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import DropdownMenu from './components/DropdownMenu.vue'
import ToastNotification from './components/ToastNotification.vue'

const router = useRouter()

// Definimos las opciones que se mostrarán en el menú desplegable de "Administración".
const adminOptions = [
  // NUEVO ENLACE A GESTIÓN DE MENSAJES
  { id: 'admin-mensajes', label: '💬 Gestionar Mensajes' },
=======
    <!-- El <RouterView /> renderiza el componente de la ruta activa. -->
    <!-- 'p-4 md:p-8' aplica un padding general para separar el contenido del header y los bordes de la ventana. -->
    <main class="p-4 md:p-8">
      <RouterView />
    </main>
  </div>

  <!-- TELEPORT PARA COMPONENTES FLOTANTES (MODALES, TOASTS, DRAWERS) -->
  <!-- Permite renderizar estos componentes fuera de la jerarquía normal del DOM, -->
  <!-- en el div '#modals-container' de index.html, asegurando que siempre estén por encima de todo. -->
  <Teleport to="#modals-container">
    <ToastNotification />
  </Teleport>
</template>

<script setup>
// Importamos los componentes de enrutamiento y la herramienta de Pinia.
import { RouterLink, RouterView, useRouter } from 'vue-router'
// Importamos nuestro componente de menú desplegable.
import DropdownMenu from './components/DropdownMenu.vue'
// Importamos nuestro componente de notificación tipo Toast.
import ToastNotification from './components/ToastNotification.vue'

// Obtenemos la instancia del router para poder navegar programáticamente entre rutas.
const router = useRouter()

// Definimos las opciones que se mostrarán en el menú desplegable de "Administración".
// Cada objeto tiene un 'id' (que coincide con el 'name' de una ruta definida en el router)
// y una 'label' para el texto visible en el menú.
const adminOptions = [
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
  { id: 'admin-reportes', label: '📁 Ver Reportes' },
  { id: 'admin-clientes', label: '👤 Gestionar Clientes' },
  { id: 'admin-materiales', label: '📦 Gestionar Materiales' },
  { id: 'admin-tipos-cirugia', label: '🔪 Gestionar Tipos de Cirugía' },
<<<<<<< HEAD
  { id: 'admin-sugerencias-medicos', label: '🩺 Gestionar Médicos (Sugerencias)' },
  { id: 'admin-sugerencias-instrumentadores', label: '🧑‍⚕️ Gestionar Instrumentadores (Sugerencias)' },
  { id: 'admin-sugerencias-nosocomios', label: '🏥 Gestionar Nosocomios (Sugerencias)' },
]

// Función que se ejecuta cuando el usuario hace clic en una opción del menú de administración.
=======
]

// Función que se ejecuta cuando el usuario hace clic en una opción del menú de administración.
// Utiliza 'router.push' para navegar a la ruta correspondiente al 'id' de la opción seleccionada.
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
const handleAdminNavigation = (option) => {
  router.push({ name: option.id })
}
</script>

<<<<<<< HEAD
<style scoped>
/* No se necesitan estilos específicos aquí. */
=======
<!-- Los estilos 'scoped' solo afectan a este componente. -->
<style scoped>
/* Puedes añadir estilos específicos de App.vue aquí si es necesario. */
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
</style>