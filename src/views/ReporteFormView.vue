<!-- src/views/ReporteFormView.vue -->
<template>
<<<<<<< HEAD
  <!-- 
    Añadimos un div contenedor y 'pb-24' para dejar espacio al footer fijo 
    SOLO en esta vista.
  -->
  <div class="pb-24">
    <div class="space-y-[var(--gap)]">
      
      <header class="text-center mb-4">
        <h1 class="text-3xl font-bold text-[var(--text)]">Generador de Reportes de Cirugía</h1>
        <p class="text-[var(--muted)] mt-1">Complete los datos para crear un nuevo reporte.</p>
      </header>

      <div class="flex justify-end gap-4">
        <button 
          type="button" 
          @click="formStore.loadLastReport()" 
          class="text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 font-semibold transition-colors"
        >
=======
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100">
    <div class="container max-w-5xl mx-auto p-4 md:p-8 bg-gray-50/80 backdrop-blur-sm rounded-xl shadow-lg">
      <!-- Encabezado -->
      <header class="mb-8 text-center">
        <img src="https://i.imgur.com/aA7RzTN.png" alt="Logo Districorr" class="max-h-24 mx-auto mb-4" />
        <h4 class="text-2xl font-bold text-gray-800">Generador de Reportes de Cirugía</h4>
        <p class="text-gray-600">Complete los datos para crear un nuevo reporte.</p>
      </header>

      <!-- Botones de Carga Rápida -->
      <div class="flex justify-end gap-4 mb-6">
        <button type="button" @click="formStore.loadLastReport()" class="text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 font-semibold">
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
          🔄 Cargar Último Reporte Completo
        </button>
      </div>

<<<<<<< HEAD
      <form id="report-form" @submit.prevent="handleGeneratePreview" class="grid grid-cols-1 lg:grid-cols-2 gap-[var(--gap)]">
        
        <!-- === SECCIÓN 1: DATOS PRINCIPALES === -->
        <div class="card-style lg:col-span-1">
          <h3 class="card-header">Datos Principales</h3>
          <div class="space-y-4">
            <div class="form-group">
              <label for="cliente">👤 Cliente (*)</label>
              <div class="relative">
                <input id="cliente" type="text" v-model="formStore.formState.cliente" required @blur="formStore.validateField('cliente')" :class="{'border-red-500': formStore.validationErrors.cliente}" class="form-input" placeholder="Ej: Hospital Central"/>
                <button @click="isClientesModalVisible = true" type="button" class="input-button">Seleccionar</button>
              </div>
              <p v-if="formStore.validationErrors.cliente" class="form-error">{{ formStore.validationErrors.cliente }}</p>
            </div>
            <div class="form-group">
              <label for="paciente">👤 Paciente (*)</label>
              <input id="paciente" type="text" v-model="formStore.formState.paciente" required @blur="formStore.validateField('paciente')" :class="{'border-red-500': formStore.validationErrors.paciente}" class="form-input" placeholder="Ingrese apellido y nombre"/>
              <p v-if="formStore.validationErrors.paciente" class="form-error">{{ formStore.validationErrors.paciente }}</p>
            </div>
            <div class="form-group">
              <label for="medico">🩺 Médico (*)</label>
              <input id="medico" type="text" v-model="formStore.formState.medico" required list="medicosList" @blur="formStore.validateField('medico')" :class="{'border-red-500': formStore.validationErrors.medico}" class="form-input" placeholder="Escriba para autocompletar..."/>
              <datalist id="medicosList"><option v-for="m in formStore.sugerencias.medicos" :key="m" :value="m"></option></datalist>
              <p v-if="formStore.validationErrors.medico" class="form-error">{{ formStore.validationErrors.medico }}</p>
            </div>
            <div class="form-group">
              <label for="instrumentador">🧑‍⚕️ Instrumentador</label>
              <input id="instrumentador" type="text" v-model="formStore.formState.instrumentador" list="instrumentadoresList" class="form-input" placeholder="Escriba para autocompletar..."/>
=======
      <!-- Formulario Principal -->
      <form @submit.prevent="handleGeneratePreview" class="space-y-8">
        
        <!-- === SECCIÓN 1: DATOS PRINCIPALES === -->
        <div class="bg-white/70 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-3 mb-6">Datos Principales</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Cliente -->
            <div class="form-group">
              <label for="cliente" class="block text-sm font-medium text-gray-700 mb-1">👤 Cliente (*)</label>
              <div class="relative">
                <input 
                  id="cliente" type="text" v-model="formStore.formState.cliente" required 
                  @blur="formStore.validateField('cliente')"
                  :class="{'border-red-500': formStore.validationErrors.cliente}"
                  class="w-full p-2 pl-10 border rounded-md" placeholder="Ej: Hospital Central"/>
                <button @click="isClientesModalVisible = true" type="button" class="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Seleccionar</button>
              </div>
              <p v-if="formStore.validationErrors.cliente" class="text-red-500 text-sm mt-1">{{ formStore.validationErrors.cliente }}</p>
            </div>
            <!-- Paciente -->
            <div class="form-group">
              <label for="paciente" class="block text-sm font-medium text-gray-700 mb-1">👤 Paciente (*)</label>
              <input 
                id="paciente" type="text" v-model="formStore.formState.paciente" required 
                @blur="formStore.validateField('paciente')"
                :class="{'border-red-500': formStore.validationErrors.paciente}"
                class="w-full p-2 pl-10 border rounded-md" placeholder="Ingrese apellido y nombre"/>
              <p v-if="formStore.validationErrors.paciente" class="text-red-500 text-sm mt-1">{{ formStore.validationErrors.paciente }}</p>
            </div>
            <!-- Médico -->
            <div class="form-group">
              <label for="medico" class="block text-sm font-medium text-gray-700 mb-1">🩺 Médico (*)</label>
              <input 
                id="medico" type="text" v-model="formStore.formState.medico" required list="medicosList" 
                @blur="formStore.validateField('medico')"
                :class="{'border-red-500': formStore.validationErrors.medico}"
                class="w-full p-2 pl-10 border rounded-md" placeholder="Escriba para autocompletar..."/>
              <datalist id="medicosList"><option v-for="m in formStore.sugerencias.medicos" :key="m" :value="m"></option></datalist>
              <p v-if="formStore.validationErrors.medico" class="text-red-500 text-sm mt-1">{{ formStore.validationErrors.medico }}</p>
            </div>
            <!-- Instrumentador -->
            <div class="form-group">
              <label for="instrumentador" class="block text-sm font-medium text-gray-700 mb-1">🧑‍⚕️ Instrumentador</label>
              <input id="instrumentador" type="text" v-model="formStore.formState.instrumentador" list="instrumentadoresList" class="w-full p-2 pl-10 border rounded-md" placeholder="Escriba para autocompletar..."/>
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
              <datalist id="instrumentadoresList"><option v-for="i in formStore.sugerencias.instrumentadores" :key="i" :value="i"></option></datalist>
            </div>
          </div>
        </div>

        <!-- === SECCIÓN 2: DETALLES DE LA CIRUGÍA === -->
<<<<<<< HEAD
        <div class="card-style lg:col-span-1">
          <h3 class="card-header">Detalles de la Cirugía</h3>
          <div class="space-y-4">
            <div class="form-group">
              <label for="fechaCirugia">🗓️ Fecha de Cirugía (*)</label>
              <input id="fechaCirugia" type="date" v-model="formStore.formState.fecha_cirugia" required @blur="formStore.validateField('fecha_cirugia')" :class="{'border-red-500': formStore.validationErrors.fecha_cirugia}" class="form-input"/>
              <p v-if="formStore.validationErrors.fecha_cirugia" class="form-error">{{ formStore.validationErrors.fecha_cirugia }}</p>
            </div>
            <div class="form-group">
              <label for="fechaEnvio">✉️ Fecha de Envío</label>
              <input id="fechaEnvio" type="date" v-model="formStore.formState.fecha_envio" class="form-input bg-cyan-50 border-cyan-200"/>
            </div>
            <div class="form-group">
              <label for="lugarCirugia">🏥 Lugar de Cirugía</label>
              <input id="lugarCirugia" type="text" v-model="formStore.formState.lugar_cirugia" list="lugaresList" class="form-input" placeholder="Escriba para autocompletar..."/>
              <datalist id="lugaresList"><option v-for="l in formStore.sugerencias.lugaresCirugia" :key="l" :value="l"></option></datalist>
            </div>
            <div class="form-group">
              <label for="tipoCirugia">🔪 Tipo de Cirugía</label>
              <div class="relative">
                <input id="tipoCirugia" type="text" v-model="formStore.formState.tipo_cirugia" class="form-input" placeholder="Ej: Artroscopia de rodilla"/>
                <button @click="isTiposCirugiaModalVisible = true" type="button" class="input-button">Seleccionar</button>
=======
        <div class="bg-white/70 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-3 mb-6">Detalles de la Cirugía</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Mensaje de Inicio -->
            <div class="form-group md:col-span-2">
              <label for="mensaje_inicio" class="block text-sm font-medium text-gray-700 mb-1">✉️ Mensaje de Inicio</label>
              <select id="mensaje_inicio" v-model="formStore.formState.mensaje_inicio" class="w-full p-2 border rounded-md">
                <option>Estimados, Adjunto detalles de la cirugía programada:</option>
                <option>Estimados, Informo novedades de la cirugía programada:</option>
                <option>Equipo, adjunto detalle de cirugía para logística y coordinación:</option>
                <option>Buen día, comparto información de la siguiente cirugía:</option>
              </select>
            </div>
            <!-- Fecha de Cirugía -->
            <div class="form-group">
              <label for="fechaCirugia" class="block text-sm font-medium text-gray-700 mb-1">🗓️ Fecha de Cirugía (*)</label>
              <input 
                id="fechaCirugia" type="date" v-model="formStore.formState.fecha_cirugia" required 
                @blur="formStore.validateField('fecha_cirugia')"
                :class="{'border-red-500': formStore.validationErrors.fecha_cirugia}"
                class="w-full p-2 border rounded-md"/>
              <p v-if="formStore.validationErrors.fecha_cirugia" class="text-red-500 text-sm mt-1">{{ formStore.validationErrors.fecha_cirugia }}</p>
            </div>
            <!-- Fecha de Envío -->
            <div class="form-group">
              <label for="fechaEnvio" class="block text-sm font-medium text-gray-700 mb-1">✉️ Fecha de Envío</label>
              <input 
                id="fechaEnvio" type="date" v-model="formStore.formState.fecha_envio"
                class="w-full p-2 border rounded-md"/>
            </div>
            <!-- Lugar -->
            <div class="form-group">
              <label for="lugarCirugia" class="block text-sm font-medium text-gray-700 mb-1">🏥 Lugar de Cirugía</label>
              <input id="lugarCirugia" type="text" v-model="formStore.formState.lugar_cirugia" list="lugaresList" class="w-full p-2 pl-10 border rounded-md" placeholder="Escriba para autocompletar..."/>
              <datalist id="lugaresList"><option v-for="l in formStore.sugerencias.lugaresCirugia" :key="l" :value="l"></option></datalist>
            </div>
            <!-- Tipo de Cirugía -->
            <div class="form-group">
              <label for="tipoCirugia" class="block text-sm font-medium text-gray-700 mb-1">🔪 Tipo de Cirugía</label>
              <div class="relative">
                <input id="tipoCirugia" type="text" v-model="formStore.formState.tipo_cirugia" class="w-full p-2 pl-10 border rounded-md" placeholder="Ej: Artroscopia de rodilla"/>
                <button @click="isTiposCirugiaModalVisible = true" type="button" class="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Seleccionar</button>
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
              </div>
            </div>
          </div>
        </div>

        <!-- === SECCIÓN 3: MATERIAL REQUERIDO === -->
<<<<<<< HEAD
        <div class="card-style lg:col-span-2">
          <div class="flex justify-between items-center border-b pb-3 mb-4">
            <h3 class="card-header !p-0 !border-0 !m-0">📦 Material Requerido</h3>
            <button @click="formStore.loadLastMaterial()" type="button" class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors">
=======
        <div class="bg-white/70 p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex justify-between items-center border-b pb-3 mb-6">
            <h3 class="text-lg font-semibold text-gray-800">📦 Material Requerido</h3>
            <button @click="formStore.loadLastMaterial()" type="button" class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200">
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
              🔄 Cargar del último reporte
            </button>
          </div>
          <div class="relative">
<<<<<<< HEAD
            <textarea id="material" v-model="formStore.formState.material" rows="5" class="form-input !h-auto" placeholder="Ingrese un ítem por línea o use el botón 'Seleccionar'..."></textarea>
            <button @click="isMaterialesModalVisible = true" type="button" class="input-button absolute top-2 right-2">Seleccionar</button>
=======
            <textarea id="material" v-model="formStore.formState.material" rows="5" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Ingrese un ítem por línea o use el botón 'Seleccionar'..."></textarea>
            <button @click="isMaterialesModalVisible = true" type="button" class="absolute top-2 right-2 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">Seleccionar</button>
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
          </div>
        </div>

        <!-- === SECCIÓN 4: DATOS ADICIONALES === -->
<<<<<<< HEAD
        <div class="card-style lg:col-span-2">
          <h3 class="card-header">📝 Datos Adicionales</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-[var(--gap)]">
            <div class="form-group">
              <label for="observaciones">Observaciones</label>
              <textarea id="observaciones" v-model="formStore.formState.observaciones" rows="4" class="form-input !h-auto" placeholder="Alergias, condiciones especiales, etc."></textarea>
            </div>
            <div class="form-group">
              <label for="infoAdicional">Información Adicional</label>
              <textarea id="infoAdicional" v-model="formStore.formState.info_adicional" rows="4" class="form-input !h-auto" placeholder="Contacto alternativo, prepaga, etc."></textarea>
=======
        <div class="bg-white/70 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800 border-b pb-3 mb-6">📝 Datos Adicionales</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div class="form-group">
              <label for="observaciones">Observaciones</label>
              <textarea id="observaciones" v-model="formStore.formState.observaciones" rows="4" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Alergias, condiciones especiales, etc."></textarea>
            </div>
            <div class="form-group">
              <label for="infoAdicional">Información Adicional</label>
              <textarea id="infoAdicional" v-model="formStore.formState.info_adicional" rows="4" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Contacto alternativo, prepaga, etc."></textarea>
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
            </div>
          </div>
        </div>
        
<<<<<<< HEAD
      </form>
    </div>

    <!-- FooterBar ahora vive aquí, dentro de la vista del formulario -->
    <FooterBar />

    <Teleport to="#modals-container">
      <ClientesModal v-model="isClientesModalVisible" @confirmar="handleClienteConfirm" />
      <MaterialesModal v-model="isMaterialesModalVisible" @confirmar="handleMaterialesConfirm" />
      <TiposCirugiaModal v-model="isTiposCirugiaModalVisible" @confirmar="handleTipoCirugiaConfirm" />
      <SolicitudPedidoModal v-model="isSolicitudModalVisible" @confirmar-pedido="handleConfirmarPedido" />
      <ReportePreviewDrawer v-model="isPreviewVisible" :reporte-data="formStore.formState" />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import html2canvas from 'html2canvas'
import { useFormStore } from '../stores/formStore'
import { useClientesStore } from '../stores/clientesStore'
import { useConfigStore } from '../stores/configStore'
import { useReportGenerator } from '../composables/useReportGenerator' 

=======
        <!-- === SECCIÓN 5: ACCIONES PRINCIPALES === -->
        <div class="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <button @click="handleSaveReport" type="button" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold">
              💾 Guardar Reporte
            </button>
            
            <!-- Botón "Enviar a Cliente" condicional y con estilo propio -->
            <button 
              v-if="clienteSeleccionado && clienteSeleccionado.email"
              @click="handleEnviarACliente" 
              type="button" 
              class="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 font-semibold flex items-center gap-2"
            >
              ✉️ Enviar a Cliente
            </button>

            <DropdownMenu 
              label="🔗 Compartir y Exportar" 
              :options="shareOptions"
              @option-click="handleShareOption"
            />
          </div>
          <button @click="handleGeneratePreview" type="button" class="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold text-lg flex items-center justify-center gap-2 shadow-lg">
            📝 Generar Vista Previa
          </button>
        </div>
      </form>
      
      <!-- Acciones del Formulario (Limpiar) -->
      <div class="my-6 flex justify-center gap-4 flex-wrap">
        <button type="button" @click="handleLimpiar" class="text-sm text-gray-600 hover:text-red-600">🧹 Limpiar Formulario</button>
      </div>

      <!-- Sección Solicitud de Material -->
      <div class="mt-8 pt-6 border-t">
        <button @click="isSolicitudModalVisible = true" class="w-full bg-yellow-500 text-gray-800 px-5 py-3 rounded-md hover:bg-yellow-600 font-bold">
          📧 Solicitar Pedido de Material
        </button>
      </div>
    </div>
  </div>

  <!-- TELEPORT PARA TODOS LOS MODALES Y DRAWERS -->
  <Teleport to="#modals-container">
    <ClientesModal v-model="isClientesModalVisible" @confirmar="handleClienteConfirm" />
    <MaterialesModal v-model="isMaterialesModalVisible" @confirmar="handleMaterialesConfirm" />
    <TiposCirugiaModal v-model="isTiposCirugiaModalVisible" @confirmar="handleTipoCirugiaConfirm" />
    <SolicitudPedidoModal v-model="isSolicitudModalVisible" @confirmar-pedido="handleConfirmarPedido" />
    <ReportePreviewDrawer 
      v-model="isPreviewVisible"
      :reporte-data="formStore.formState"
    />
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import html2canvas from 'html2canvas'
import { useFormStore } from '../stores/formStore'
import { useClientesStore } from '../stores/clientesStore'
import { useTiposCirugiaStore } from '../stores/tiposCirugiaStore'
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
import ClientesModal from '../components/ClientesModal.vue'
import MaterialesModal from '../components/MaterialesModal.vue'
import TiposCirugiaModal from '../components/TiposCirugiaModal.vue'
import SolicitudPedidoModal from '../components/SolicitudPedidoModal.vue'
<<<<<<< HEAD
import ReportePreviewDrawer from '../components/ReportePreviewDrawer.vue'
import { useToastStore } from '../stores/toastStore'
import FooterBar from '../components/FooterBar.vue'

const formStore = useFormStore()
const clientesStore = useClientesStore()
const configStore = useConfigStore()
const toastStore = useToastStore()

const { generarTextoPlano, formatearFecha } = useReportGenerator() 

const isClientesModalVisible = ref(false)
const isMaterialesModalVisible = ref(false)
const isTiposCirugiaModalVisible = ref(false)
const isSolicitudModalVisible = ref(false) 
const isPreviewVisible = ref(false)

const clienteSeleccionado = computed(() => {
  const nombreCliente = formStore.formState.cliente
  if (!nombreCliente) return null
  return clientesStore.allClients.find(c => c.nombre === nombreCliente)
})

onMounted(() => {
  configStore.fetchMensajes() 
  formStore.initializeForm()
})

const handleClienteConfirm = (cliente) => {
  formStore.formState.cliente = cliente.nombre
  formStore.formState.email_cliente = cliente.email
=======
import DropdownMenu from '../components/DropdownMenu.vue'
import ReportePreviewDrawer from '../components/ReportePreviewDrawer.vue'
import { useToastStore } from '../stores/toastStore'

const formStore = useFormStore()
const clientesStore = useClientesStore()
const tiposCirugiaStore = useTiposCirugiaStore()
const toastStore = useToastStore()

const isClientesModalVisible = ref(false)
const isMaterialesModalVisible = ref(false)
const isTiposCirugiaModalVisible = ref(false)
const isSolicitudModalVisible = ref(false)
const isPreviewVisible = ref(false)

const shareOptions = [
  { id: 'whatsapp', label: '📲 Enviar por WhatsApp' },
  { id: 'email', label: '✉️ Enviar por Email (Mailto)' },
  { id: 'print', label: '🖨️ Imprimir / PDF' },
  { id: 'image', label: '🖼️ Guardar como Imagen' },
]

// Propiedad computada para obtener el cliente completo seleccionado, incluyendo su email.
const clienteSeleccionado = computed(() => {
  const nombreCliente = formStore.formState.cliente
  console.log('clienteSeleccionado (computed): formStore.formState.cliente:', nombreCliente);
  if (!nombreCliente) {
    console.log('clienteSeleccionado (computed): No hay cliente seleccionado en el formulario.');
    return null;
  }
  // --- CAMBIO CLAVE: Buscar en clientesStore.allClients ---
  const foundClient = clientesStore.allClients.find(c => c.nombre === nombreCliente);
  console.log('clienteSeleccionado (computed): clientesStore.allClients.length:', clientesStore.allClients.length);
  console.log('clienteSeleccionado (computed): foundClient:', foundClient);
  return foundClient;
})

const handleShareOption = (option) => {
  const isFormValid = formStore.validateForm();
  if (!isFormValid) {
    toastStore.showToast('Por favor, complete los campos requeridos (*) antes de compartir.', 'warning');
    return;
  }
  switch (option.id) {
    case 'whatsapp': handleWhatsApp(); break
    case 'email': handleEmail(); break
    case 'print': handleImprimir(); break
    case 'image': handleGuardarImagen(); break
  }
}

onMounted(async () => {
  console.log('ReporteFormView onMounted: Iniciando initializeForm...');
  await formStore.initializeForm(); // Aseguramos que los clientes (allClients) se carguen
  console.log('ReporteFormView onMounted: formStore.initializeForm() completado. clientesStore.allClients al finalizar:', clientesStore.allClients);
  console.log('ReporteFormView onMounted: formStore.sugerencias al finalizar:', formStore.sugerencias);
})

const handleClienteConfirm = (clienteNombre) => {
  console.log('handleClienteConfirm: Cliente seleccionado del modal:', clienteNombre);
  formStore.formState.cliente = clienteNombre
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
  formStore.validateField('cliente')
}

const handleMaterialesConfirm = (materialesTexto) => {
  const valorActual = formStore.formState.material.trim()
  formStore.formState.material = valorActual ? `${valorActual}\n${materialesTexto}` : materialesTexto
}

const handleTipoCirugiaConfirm = (tipoCirugiaNombre) => {
  formStore.formState.tipo_cirugia = tipoCirugiaNombre
}

<<<<<<< HEAD
// CORRECCIÓN CLAVE: Función para enviar la Solicitud de Pedido a DistriTrack
const handleConfirmarPedido = (materiales) => {
  if (!formStore.validateForm()) {
    toastStore.showToast('Complete los campos requeridos (*) del formulario principal antes de solicitar.', 'warning')
=======
const handleConfirmarPedido = (materiales) => {
  const isFormValid = formStore.validateForm()
  if (!isFormValid) {
    toastStore.showToast('Por favor, complete los campos requeridos (*) del formulario principal antes de solicitar.', 'warning');
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
    return
  }
  
  const datos = formStore.formState
<<<<<<< HEAD
  
  // --- PARTE 1: MAILTO a Compras ---
  const EMAIL_DESTINO = 'comprasimplantes@districorr.com.ar'
  const asunto = `Solicitud Material: ${datos.paciente} - ${datos.cliente}`
  const materialesTexto = materiales.map(m => `- ${m.description} (Cantidad: ${m.quantity})`).join('\n')
  const cuerpo = `Estimados,\nSe solicita el siguiente material para la cirugía del paciente ${datos.paciente}.\n\nDetalles:\n- Paciente: ${datos.paciente}\n- Cliente: ${datos.cliente}\n- Médico: ${datos.medico}\n- Fecha Cirugía: ${formatearFecha(datos.fecha_cirugia)}\n\nMaterial Solicitado:\n${materialesTexto}\n\nSaludos cordiales.`.trim()
  
  window.location.href = `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`

  // --- PARTE 2: DISTRITRACK URL MAPPING (CORREGIDO PARA ERD Y CODIFICACIÓN) ---
  const DISTRITRACK_URL = 'https://distri-track.vercel.app/dashboard/new-surgery'
  const params = new URLSearchParams()
  
  // Mapeo de datos principales
  params.append('patient_name', datos.paciente)
  params.append('doctor_name', datos.medico)
  params.append('client', datos.cliente) // Mapeamos 'cliente' a client (ART/Aseguradora)
  params.append('institution', datos.lugar_cirugia) // Mapeamos 'lugar_cirugia' a institution (Hospital/Clínica)
  params.append('surgery_date', datos.fecha_cirugia)
  
  // Mapeo de Materiales
  const materialesParaAPI = materiales.map(item => ({
    type: "note", 
    description: item.description,
    quantity: item.quantity
  }))

  // Convertimos el array a JSON string
  const materialesJSONString = JSON.stringify(materialesParaAPI);
  
  // Añadimos el string JSON directamente a los parámetros.
  // URLSearchParams codifica automáticamente el string JSON.
  params.append('materiales', materialesJSONString);

  const urlFinalDistriTrack = `${DISTRITRACK_URL}?${params.toString()}`

  setTimeout(() => window.open(urlFinalDistriTrack, '_blank'), 500)
}

const handleEnviarACliente = () => {
  if (!formStore.validateForm()) {
    toastStore.showToast('Corrija los errores en el formulario antes de enviar.', 'warning')
    return
  }
  if (clienteSeleccionado.value?.email) {
    const textoPlano = generarTextoPlano(clienteSeleccionado.value.email)
    const asunto = configStore.replaceVariables(configStore.mensajes.asunto_base, formStore.formState)
    window.location.href = `mailto:${clienteSeleccionado.value.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoPlano)}`
    toastStore.showToast('Abriendo cliente de correo.', 'info')
  } else {
    toastStore.showToast('El cliente seleccionado no tiene un email registrado.', 'warning')
  }
}

const handleGeneratePreview = () => {
  if (!formStore.validateForm()) {
    toastStore.showToast('Corrija los errores en los campos requeridos (*).', 'warning')
    return
  }
  formStore.formState.email_cliente = clienteSeleccionado.value?.email || null
  isPreviewVisible.value = true
}

const handleSaveReport = async () => {
  if (!formStore.validateForm()) {
    toastStore.showToast('Corrija los errores en el formulario antes de guardar.', 'warning')
    return
  }
  if (await formStore.saveReport()) {
    toastStore.showToast('Reporte guardado con éxito!', 'success')
    formStore.formState.email_cliente = clienteSeleccionado.value?.email || null
    isPreviewVisible.value = true
  } else {
    toastStore.showToast('Error al guardar el reporte.', 'error')
=======
  const EMAIL_DESTINO = 'comprasimplantes@districorr.com.ar'
  const asunto = `Solicitud Material: ${datos.paciente} - ${datos.cliente}`
  const materialesTexto = materiales.map(m => `- ${m.description} (Cantidad: ${m.quantity})`).join('\n')
  const cuerpo = `
Estimados,
Se solicita el siguiente material para la cirugía del paciente ${datos.paciente}.
Detalles:
- Paciente: ${datos.paciente}
- Cliente: ${datos.cliente}
- Médico: ${datos.medico}
- Fecha Cirugía: ${formatearFecha(datos.fecha_cirugia)}
Material Solicitado:
${materialesTexto}
Saludos cordiales.
  `.trim()
  
  const mailtoLink = `mailto:${EMAIL_DESTINO}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
  window.location.href = mailtoLink

  const DISTRITRACK_URL = 'https://distri-track.vercel.app/dashboard/new-surgery'
  const params = new URLSearchParams()
  params.append('patient_name', datos.paciente)
  params.append('doctor_name', datos.medico)
  params.append('client', datos.cliente)
  params.append('surgery_date', datos.fecha_cirugia)
  
  const materialesParaAPI = materiales.map(item => ({
    type: "note",
    description: item.description,
    quantity: item.quantity
  }))
  params.append('materiales', JSON.stringify(materialesParaAPI))

  const urlFinalDistriTrack = `${DISTRITRACK_URL}?${params.toString()}`
  
  setTimeout(() => {
    window.open(urlFinalDistriTrack, '_blank')
  }, 500)
}

const handleEnviarACliente = () => {
  console.log('handleEnviarACliente: Botón "Enviar a Cliente" clickeado.');
  const isFormValid = formStore.validateForm();
  if (!isFormValid) {
    toastStore.showToast('Por favor, corrija los errores en el formulario antes de enviar.', 'warning');
    return;
  }
  if (clienteSeleccionado.value && clienteSeleccionado.value.email) {
    const textoPlano = generarTextoPlano();
    const datos = formStore.formState;
    const asunto = `Reporte Cirugía: ${datos.cliente} - ${datos.paciente}`;
    const mailtoLink = `mailto:${clienteSeleccionado.value.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoPlano)}`;
    
    toastStore.showToast('Abriendo cliente de correo. Verifique los datos.', 'info');
    window.location.href = mailtoLink;
    console.log('handleEnviarACliente: Mailto abierto a:', clienteSeleccionado.value.email);
  } else {
    toastStore.showToast('El cliente seleccionado no tiene un email registrado para enviar el reporte.', 'warning');
    console.log('handleEnviarACliente: Cliente seleccionado sin email.');
  }
}

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return 'No especificada'
  const [year, month, day] = fechaISO.split('-')
  return `${day}/${month}/${year}`
}

const generarTextoPlano = () => {
  const datos = formStore.formState
  const fechaFormateada = formatearFecha(datos.fecha_cirugia)
  const emailClienteTexto = clienteSeleccionado.value && clienteSeleccionado.value.email 
    ? `\n- *Email Cliente:* ${clienteSeleccionado.value.email}` 
    : '';

  return `
*Reporte de Cirugía*
- *Cliente:* ${datos.cliente || 'No especificado'}${emailClienteTexto}
- *Paciente:* ${datos.paciente || 'No especificado'}
- *Médico:* ${datos.medico || 'No especificado'}
- *Instrumentador:* ${datos.instrumentador || 'No especificado'}
- *Fecha:* ${fechaFormateada}
- *Lugar:* ${datos.lugar_cirugia || 'No especificado'}
- *Tipo de Cirugía:* ${datos.tipo_cirugia || 'No especificado'}
*Material Requerido:*
${(datos.material || 'No especificado').replace(/^/gm, '- ')}
${datos.observaciones ? `*Observaciones:*\n${datos.observaciones}\n` : ''}
${datos.info_adicional ? `*Info Adicional:*\n${datos.info_adicional}\n` : ''}
  `.trim();
}

const handleGeneratePreview = () => {
  console.log('handleGeneratePreview: Botón "Generar Vista Previa" clickeado.');
  const isFormValid = formStore.validateForm();
  if (!isFormValid) {
    toastStore.showToast('Por favor, corrija los errores en los campos requeridos (*).', 'warning');
    return;
  }
  // Antes de mostrar la preview, actualizamos el email del cliente en el formState.
  formStore.formState.email_cliente = clienteSeleccionado.value?.email || null;
  isPreviewVisible.value = true;
  console.log('handleGeneratePreview: Vista previa abierta. Datos pasados:', formStore.formState);
}

const handleSaveReport = async () => {
  console.log('handleSaveReport: Botón "Guardar Reporte" clickeado.');
  const isFormValid = formStore.validateForm();
  if (!isFormValid) {
    toastStore.showToast('Por favor, corrija los errores en el formulario antes de guardar.', 'warning');
    return;
  }
  const guardadoExitoso = await formStore.saveReport();
  if (guardadoExitoso) {
    toastStore.showToast('Reporte guardado con éxito!', 'success');
    // Después de guardar, también actualizamos el email del cliente en el formState
    // antes de abrir la preview para que la fecha de envío y el email se muestren.
    formStore.formState.email_cliente = clienteSeleccionado.value?.email || null;
    isPreviewVisible.value = true;
    console.log('handleSaveReport: Reporte guardado y vista previa abierta.');
  } else {
    toastStore.showToast('Error al guardar el reporte.', 'error');
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
  }
}

const handleWhatsApp = () => {
<<<<<<< HEAD
  const textoPlano = generarTextoPlano(clienteSeleccionado.value?.email)
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textoPlano)}`, '_blank')
}

const handleEmail = () => {
  const asunto = configStore.replaceVariables(configStore.mensajes.asunto_base, formStore.formState)
  const textoPlano = generarTextoPlano(clienteSeleccionado.value?.email)
  window.location.href = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoPlano)}`
}

const handleLimpiar = () => {
  formStore.resetForm()
  isPreviewVisible.value = false
  toastStore.showToast('Formulario limpiado.', 'info')
}

const handleImprimir = () => {
  toastStore.showToast("Función de impresión en desarrollo.", 'info')
}

const handleGuardarImagen = async () => {
  isPreviewVisible.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const drawerContent = document.querySelector('.reporte-box')
  if (!drawerContent) {
    toastStore.showToast('Error: Contenedor de vista previa no encontrado.', 'error')
    return
  }

  try {
    const canvas = await html2canvas(drawerContent, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
    const link = document.createElement('a')
    link.download = `reporte_${formStore.formState.cliente || 'sinc'}_${formStore.formState.paciente || 'sinp'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    toastStore.showToast('Imagen del reporte descargada.', 'success')
  } catch (error) {
    console.error('Error al generar la imagen:', error)
    toastStore.showToast('Ocurrió un error al generar la imagen.', 'error')
  }
}

// --- NUEVA FUNCIÓN: Maneja el envío auditable ---
const handleSendAuditableMail = async (mailType) => {
    if (!formStore.validateForm()) {
        toastStore.showToast('Corrija los errores en el formulario antes de enviar.', 'warning')
        return
    }

    if (!formStore.formState.id) {
        toastStore.showToast('Guardando reporte antes de enviar para garantizar el registro...', 'info')
        const success = await formStore.saveReport()
        if (!success) {
            toastStore.showToast('Error al guardar el reporte. No se puede auditar el envío.', 'error')
            return
        }
    }

    const textoPlano = generarTextoPlano(clienteSeleccionado.value?.email)
    const result = await formStore.sendAuditableMail(mailType, textoPlano)
    
    if (result.success) {
        toastStore.showToast(`Abriendo cliente de correo para ${mailType.toUpperCase()}.`, 'info')
    } else {
        toastStore.showToast(`Error de Envío: ${result.error}`, 'error')
    }
}

// --- WATCH para el Action Trigger (ACTUALIZADO) ---
watch(() => formStore.actionTrigger, (trigger) => {
  if (trigger) {
    switch (trigger.name) {
      case 'generatePreview':
        handleGeneratePreview();
        break;
      case 'saveReport':
        handleSaveReport();
        break;
      case 'solicitarPedido':
        isSolicitudModalVisible.value = true;
        break;
      case 'share':
        if (trigger.payload.id === 'whatsapp') handleWhatsApp();
        if (trigger.payload.id === 'email') handleEmail();
        if (trigger.payload.id === 'print') handleImprimir();
        if (trigger.payload.id === 'image') handleGuardarImagen();
        break;
      case 'sendAuditableMail':
          handleSendAuditableMail(trigger.payload.mailType);
          break;
    }
    formStore.clearActionTrigger();
  }
}, { deep: true });
</script>

<style>
/* Este bloque está vacío porque los estilos están en src/style.css */
=======
  console.log('handleWhatsApp: Opción WhatsApp seleccionada.');
  const textoPlano = generarTextoPlano()
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoPlano)}`
  window.open(url, '_blank')
}

const handleEmail = () => {
  console.log('handleEmail: Opción Email (Mailto) seleccionada.');
  const textoPlano = generarTextoPlano()
  const datos = formStore.formState
  const asunto = `Reporte Cirugía: ${datos.cliente} - ${datos.paciente}`
  const url = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoPlano)}`
  window.location.href = url
}

const handleLimpiar = () => {
  console.log('handleLimpiar: Botón "Limpiar Formulario" clickeado.');
  formStore.resetForm()
  isPreviewVisible.value = false
  toastStore.showToast('Formulario limpiado.', 'info');
}

const handleImprimir = () => {
  console.log('handleImprimir: Opción Imprimir seleccionada.');
  toastStore.showToast("La impresión directa desde el drawer se implementará en una futura versión. Por ahora, copie el HTML y péguelo en un editor para imprimir.", 'info');
}

const handleGuardarImagen = async () => {
  console.log('handleGuardarImagen: Opción Guardar Imagen seleccionada.');
  isPreviewVisible.value = true;
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const drawerContent = document.querySelector('.absolute.top-0.right-0 .reporte-box');
  if (!drawerContent) {
    toastStore.showToast('Error: Contenedor de vista previa no encontrado para la imagen.', 'error');
    console.error('handleGuardarImagen: Contenedor de vista previa no encontrado.');
    return;
  }

  try {
    const canvas = await html2canvas(drawerContent, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const link = document.createElement('a')
    const datos = formStore.formState
    link.download = `reporte_${datos.cliente || 'sinc'}_${datos.paciente || 'sinp'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    toastStore.showToast('Imagen del reporte descargada.', 'success');
    console.log('handleGuardarImagen: Imagen descargada.');
  } catch (error) {
    console.error('Error al generar la imagen:', error)
    toastStore.showToast('Ocurrió un error al generar la imagen.', 'error');
  }
}
</script>

<style scoped>
/* Estilos para los íconos dentro de los inputs */
.form-group {
  position: relative;
}
.form-group label {
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
/* Asegura el espacio para el ícono en los inputs y textareas */
.form-group input:not([type="date"]), .form-group textarea, .form-group select {
  padding-left: 2.5rem;
}
/* Ajuste específico para el input de fecha, que no suele usar íconos internos */
.form-group input[type="date"] {
  padding-left: 1rem;
}
>>>>>>> 6ad51bb65c2211771aa865b0b46f5495626854f6
</style>