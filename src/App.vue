<!-- src/App.vue -->
<template>
  <!-- CONTENEDOR PRINCIPAL DE TODA LA APLICACIÓN -->
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
            </RouterLink>
          </div>

          <!-- Menú Desplegable para Opciones de Administración -->
          <!-- Agrupa todos los enlaces a las páginas de administración para una navegación limpia. -->
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
  { id: 'admin-reportes', label: '📁 Ver Reportes' },
  { id: 'admin-clientes', label: '👤 Gestionar Clientes' },
  { id: 'admin-materiales', label: '📦 Gestionar Materiales' },
  { id: 'admin-tipos-cirugia', label: '🔪 Gestionar Tipos de Cirugía' },
]

// Función que se ejecuta cuando el usuario hace clic en una opción del menú de administración.
// Utiliza 'router.push' para navegar a la ruta correspondiente al 'id' de la opción seleccionada.
const handleAdminNavigation = (option) => {
  router.push({ name: option.id })
}
</script>

<!-- Los estilos 'scoped' solo afectan a este componente. -->
<style scoped>
/* Puedes añadir estilos específicos de App.vue aquí si es necesario. */
</style>