// src/main.js

// Importamos los estilos globales de Tailwind CSS.
<<<<<<< HEAD
=======
// Esta debe ser una de las primeras líneas para que los estilos base se apliquen a todo.
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
import './style.css'

// Importamos las funciones y componentes necesarios de Vue y sus librerías.
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
<<<<<<< HEAD
// ELIMINADO: El import incorrecto de 'dragAndDropPlugin' ya no está aquí.
=======
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6

// Creamos la instancia principal de la aplicación.
const app = createApp(App)

// Usamos los plugins que instalamos: Pinia para el manejo de estado y Vue Router para la navegación.
app.use(createPinia())
app.use(router)
<<<<<<< HEAD
// ELIMINADO: El app.use(dragAndDropPlugin) incorrecto ya no está aquí.
=======
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6

// Montamos la aplicación en el elemento con id="app" en nuestro index.html.
app.mount('#app')