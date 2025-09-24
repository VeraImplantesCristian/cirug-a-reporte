<!-- src/App.vue -->
<template>
  <!-- CONTENEDOR PRINCIPAL DE LA APP -->
  <!-- Asegura que el fondo cubra toda la altura de la pantalla. -->
  <div class="min-h-screen bg-gray-100">
    <!-- HEADER FIJO -->
    <!-- 'sticky top-0 z-40' mantiene la barra de navegación en la parte superior. -->
    <header class="bg-white shadow-sm sticky top-0 z-40 print:hidden">
      <div class="wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center justify-between h-16">
          <!-- Logo y Enlace Principal -->
          <div class="flex items-center gap-4">
            <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" class="h-10 w-auto" />
            <RouterLink 
              to="/" 
              class="text-gray-800 font-semibold hover:text-blue-600 transition-colors"
            >
              Formulario de Reportes
            </RouterLink>
          </div>

          <!-- Menú de Administración -->
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

    <!-- CONTENIDO PRINCIPAL -->
    <!-- El <main> ahora envuelve directamente a RouterView. -->
    <!-- Proporciona un padding consistente para todas las vistas, pero NO limita el ancho. -->
    <main class="p-4 md:p-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import DropdownMenu from './components/DropdownMenu.vue'

const router = useRouter()

const adminOptions = [
  { id: 'admin-reportes', label: '📁 Ver Reportes' },
  { id: 'admin-clientes', label: '👤 Gestionar Clientes' },
  { id: 'admin-materiales', label: '📦 Gestionar Materiales' },
  { id: 'admin-tipos-cirugia', label: '🔪 Gestionar Tipos de Cirugía' },
]

const handleAdminNavigation = (option) => {
  router.push({ name: option.id })
}
</script>