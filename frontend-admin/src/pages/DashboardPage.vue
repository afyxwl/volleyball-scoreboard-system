<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../services/api'

type Screen = {
  id: number
  name: string
  slug: string
  isActive: boolean
}

const screens = ref<Screen[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get('/screens')
    screens.value = response.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main style="padding: 24px">
    <h1>Admin Dashboard</h1>
    <p>Вибір екрана для керування табло</p>

    <div v-if="loading">Завантаження...</div>

    <div v-else>
      <div v-if="screens.length === 0">Екрани не знайдено</div>

      <ul v-else>
        <li v-for="screen in screens" :key="screen.id" style="margin-bottom: 12px">
          <strong>{{ screen.name }}</strong>
          <span> ({{ screen.slug }}) </span>
          <RouterLink :to="`/screens/${screen.id}/control`">Відкрити керування</RouterLink>
        </li>
      </ul>
    </div>
  </main>
</template>