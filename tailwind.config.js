// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  // La propiedad 'content' le dice a Tailwind qué archivos debe analizar.
  content: [
    // Ruta al archivo principal de la aplicación.
    "./index.html",
    // Patrón que incluye todos los archivos .vue, .js, .ts, .jsx, .tsx
    // dentro de la carpeta 'src' y sus subdirectorios.
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}