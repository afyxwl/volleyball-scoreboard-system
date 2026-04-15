import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from './pages/DashboardPage.vue'
import ControlPage from './pages/ControlPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      component: DashboardPage,
    },
    {
      path: '/screens/:id/control',
      component: ControlPage,
    },
  ],
})

export default router