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
    // --- NUEVA RUTA AÑADIDA ---
    // Esta es la ruta para nuestro nuevo panel de visualización de reportes.
    {
      path: '/admin/reportes',
      name: 'admin-reportes',
      // El componente que se renderizará, usando carga diferida.
      component: () => import('../views/AdminReportesView.vue')
    }
  ]
})

export default router