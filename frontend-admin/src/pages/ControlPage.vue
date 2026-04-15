<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../services/api'

type ScoreboardState = {
  id: number
  screenId: number
  sportType: string
  status: string
  currentSet: number
  isActive: boolean
  clock: {
    time: string | null
    isRunning: boolean
  }
  team1: {
    name: string
    score: number
    timeoutsUsed: number
  }
  team2: {
    name: string
    score: number
    timeoutsUsed: number
  }
}

const route = useRoute()
const match = ref<ScoreboardState | null>(null)
const loading = ref(true)

const screenId = computed(() => Number(route.params.id))

async function loadCurrentMatch() {
  loading.value = true
  try {
    const response = await api.get(`/screens/${screenId.value}/current`)
    match.value = response.data
  } finally {
    loading.value = false
  }
}

async function addPoint(team: 1 | 2) {
  if (!match.value) return
  const response = await api.patch(`/matches/${match.value.id}/score/add/${team}`)
  match.value = response.data
}

async function takeTimeout(team: 1 | 2) {
  if (!match.value) return
  const response = await api.patch(`/matches/${match.value.id}/timeout/${team}`)
  match.value = response.data
}

onMounted(loadCurrentMatch)
</script>

<template>
  <main style="padding: 24px">
    <h1>Control Panel</h1>

    <div v-if="loading">Завантаження...</div>

    <div v-else-if="!match">Матч не знайдено</div>

    <div v-else>
      <p><strong>Sport:</strong> {{ match.sportType }}</p>
      <p><strong>Status:</strong> {{ match.status }}</p>
      <p><strong>Set:</strong> {{ match.currentSet }}</p>
      <p><strong>Time:</strong> {{ match.clock.time }}</p>

      <hr />

      <section style="margin-bottom: 24px">
        <h2>{{ match.team1.name }}</h2>
        <p>Score: {{ match.team1.score }}</p>
        <p>Timeouts: {{ match.team1.timeoutsUsed }}</p>
        <button @click="addPoint(1)">+1 Team 1</button>
        <button @click="takeTimeout(1)">Timeout Team 1</button>
      </section>

      <section>
        <h2>{{ match.team2.name }}</h2>
        <p>Score: {{ match.team2.score }}</p>
        <p>Timeouts: {{ match.team2.timeoutsUsed }}</p>
        <button @click="addPoint(2)">+1 Team 2</button>
        <button @click="takeTimeout(2)">Timeout Team 2</button>
      </section>
    </div>
  </main>
</template>