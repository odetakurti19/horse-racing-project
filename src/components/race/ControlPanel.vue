<script setup lang="ts">
import { useStore } from 'vuex'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { key } from '@/stores'
import { RACE_STATUS } from '@/utils/constants'

const store = useStore(key)

async function handleGenerate(): Promise<void> {
  await store.dispatch('horse/generateHorses')
  store.dispatch('race/generateSchedule', store.state.horse.horses)
}

function handleStart(): void {
  store.dispatch('race/startRace')
}

async function handleReset(): Promise<void> {
  await store.dispatch('race/resetRace')
  store.dispatch('horse/reset')
}

const statusSeverity = {
  [RACE_STATUS.IDLE]: 'secondary',
  [RACE_STATUS.SCHEDULED]: 'info',
  [RACE_STATUS.RUNNING]: 'success',
  [RACE_STATUS.PAUSED]: 'warn',
  [RACE_STATUS.FINISHED]: 'danger',
} as const
</script>

<template>
  <div class="flex items-center gap-6 px-4 py-3 flex-wrap border-b border-(--border-color) bg-(--panel-bg) rounded-lg" data-testid="control-panel">
    <span class="text-[1.2rem] font-bold text-(--accent-gold) whitespace-nowrap">🏇 Horse Racing</span>

    <div class="flex gap-3 flex-wrap">
      <Button
        label="Generate Program"
        icon="pi pi-refresh"
        :disabled="store.state.race.status !== RACE_STATUS.IDLE"
        data-testid="btn-generate"
        @click="handleGenerate"
      />

      <Button
        label="Start Race"
        icon="pi pi-play"
        severity="success"
        :disabled="store.state.race.status !== RACE_STATUS.SCHEDULED"
        data-testid="btn-start"
        @click="handleStart"
      />

      <Button
        v-if="store.state.race.status === RACE_STATUS.FINISHED"
        label="New Race"
        icon="pi pi-replay"
        severity="secondary"
        data-testid="btn-reset"
        @click="handleReset"
      />
    </div>

    <div class="ml-auto capitalize" data-testid="status-badge">
      <Tag
        :value="store.state.race.status"
        :severity="statusSeverity[store.state.race.status]"
      />
    </div>
  </div>
</template>

