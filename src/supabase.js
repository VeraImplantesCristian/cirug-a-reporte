// src/supabase.js

// Importamos la función 'createClient' desde la librería de Supabase.
// Esta función es la que nos permite establecer la conexión.
import { createClient } from '@supabase/supabase-js'

// Obtenemos la URL y la clave anónima de Supabase desde las variables de entorno.
// Vite reemplaza 'import.meta.env' con los valores del archivo .env durante la compilación.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Creamos y exportamos el cliente de Supabase.
// Este objeto 'supabase' será nuestra única puerta de entrada a la base de datos.
// Lo importaremos en cualquier componente que necesite interactuar con Supabase.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)