<!-- src/App.vue -->
<template>
  <!-- CONTENEDOR PRINCIPAL DE TODA LA APLICACIÓN -->
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
            </RouterLink>
          </div>

          <!-- Menú Desplegable para Opciones de Administración -->
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
  { id: 'admin-reportes', label: '📁 Ver Reportes' },
  { id: 'admin-clientes', label: '👤 Gestionar Clientes' },
  { id: 'admin-materiales', label: '📦 Gestionar Materiales' },
  { id: 'admin-tipos-cirugia', label: '🔪 Gestionar Tipos de Cirugía' },
  { id: 'admin-sugerencias-medicos', label: '🩺 Gestionar Médicos (Sugerencias)' },
  { id: 'admin-sugerencias-instrumentadores', label: '🧑‍⚕️ Gestionar Instrumentadores (Sugerencias)' },
  { id: 'admin-sugerencias-nosocomios', label: '🏥 Gestionar Nosocomios (Sugerencias)' },
]

// Función que se ejecuta cuando el usuario hace clic en una opción del menú de administración.
const handleAdminNavigation = (option) => {
  router.push({ name: option.id })
}
</script>

<style scoped>
/* No se necesitan estilos específicos aquí. */
</style>