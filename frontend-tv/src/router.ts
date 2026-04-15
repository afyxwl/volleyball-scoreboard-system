import { createRouter, createWebHistory } from 'vue-router'
import ScreenPage from './pages/ScreenPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/screens/:id',
      component: ScreenPage,
    },
  ],
})

export default router