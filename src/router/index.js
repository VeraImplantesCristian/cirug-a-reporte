// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ReporteFormView.vue')
    },
    // --- NUEVA RUTA PARA LA HERRAMIENTA PIVOT ---
    // Se añade la ruta /pivot que carga el componente PivotView que acabamos de crear.
    {
      path: '/pivot',
      name: 'pivot',
      component: () => import('../views/PivotView.vue')
    },
    // RUTA DASHBOARD
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    // RUTA DEPÓSITO (MODO LISTA)
    {
      path: '/deposito',
      name: 'deposito',
      component: () => import('../views/PackingListView.vue')
    },
    // Rutas de Administración de Datos Maestros
    {
      path: '/admin/clientes',
      name: 'admin-clientes',
      component: () => import('../views/AdminClientesView.vue')
    },
    {
      path: '/admin/materiales',
      name: 'admin-materiales',
      component: () => import('../views/AdminMaterialesView.vue')
    },
    {
      path: '/admin/tipos-cirugia',
      name: 'admin-tipos-cirugia',
      component: () => import('../views/AdminTiposCirugiaView.vue')
    },
    {
      path: '/admin/reportes',
      name: 'admin-reportes',
      component: () => import('../views/AdminReportesView.vue')
    },
    // RUTAS DE ADMINISTRACIÓN DE CONFIGURACIÓN Y SUGERENCIAS
    {
      path: '/admin/mensajes',
      name: 'admin-mensajes',
      component: () => import('../views/AdminMensajesView.vue')
    },
    {
      path: '/admin/sugerencias/medicos',
      name: 'admin-sugerencias-medicos',
      component: () => import('../views/AdminMedicosView.vue')
    },
    {
      path: '/admin/sugerencias/instrumentadores',
      name: 'admin-sugerencias-instrumentadores',
      component: () => import('../views/AdminInstrumentadoresView.vue')
    },
    {
      path: '/admin/sugerencias/nosocomios',
      name: 'admin-sugerencias-nosocomios',
      component: () => import('../views/AdminNosocomiosView.vue')
    }
  ]
})

export default router