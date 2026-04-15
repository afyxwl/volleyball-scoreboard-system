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
const state = ref<ScoreboardState | null>(null)
const screenId = computed(() => Number(route.params.id))

async function loadState() {
  const response = await api.get(`/screens/${screenId.value}/current`)
  state.value = response.data
}

onMounted(loadState)
</script>

<template>
  <main
    style="
      min-height: 100vh;
      background: #111;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px;
      font-family: Arial, sans-serif;
    "
  >
    <div v-if="!state">Loading scoreboard...</div>

    <div v-else>
      <div style="display: flex; justify-content: space-between; margin-bottom: 40px">
        <div style="font-size: 48px; font-weight: bold">{{ state.team1.name }}</div>
        <div style="font-size: 64px; font-weight: bold">{{ state.team1.score }}</div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 40px">
        <div style="font-size: 48px; font-weight: bold">{{ state.team2.name }}</div>
        <div style="font-size: 64px; font-weight: bold">{{ state.team2.score }}</div>
      </div>

      <div style="font-size: 32px; margin-bottom: 12px">Set: {{ state.currentSet }}</div>
      <div style="font-size: 32px; margin-bottom: 12px">Time: {{ state.clock.time }}</div>
      <div style="font-size: 28px">Timeouts: {{ state.team1.timeoutsUsed }} | {{ state.team2.timeoutsUsed }}</div>
    </div>
  </main>
</template>