// src/main.js

// Importamos los estilos globales de Tailwind CSS.
// Esta debe ser una de las primeras líneas para que los estilos base se apliquen a todo.
import './style.css'

// Importamos las funciones y componentes necesarios de Vue y sus librerías.
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Creamos la instancia principal de la aplicación.
const app = createApp(App)

// Usamos los plugins que instalamos: Pinia para el manejo de estado y Vue Router para la navegación.
app.use(createPinia())
app.use(router)

// Montamos la aplicación en el elemento con id="app" en nuestro index.html.
app.mount('#app')