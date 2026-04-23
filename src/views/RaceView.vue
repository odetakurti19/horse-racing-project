<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import Panel from 'primevue/panel'
import { key } from '@/stores'
import { useRaceAnimation } from '@/composables/useRaceAnimation'
import { computeFinishTime } from '@/utils/horse'
import { RACE_STATUS } from '@/utils/constants'
import type { RaceResult, Round } from '@/types'
import ControlPanel from '@/components/race/ControlPanel.vue'
import HorseList from '@/components/horse/HorseList.vue'
import RaceTrack from '@/components/race/RaceTrack.vue'
import ResultsPanel from '@/components/results/ResultsPanel.vue'

const store = useStore(key)
const animation = useRaceAnimation()

const DURATION_SCALE = 40

const completedRounds = computed(() =>
  store.state.race.schedule.slice(0, store.state.race.currentRoundIndex),
)

const trackHorses = computed(() =>
  (store.getters['race/currentRound'] as Round | null)?.selectedHorses ?? [],
)

const trackTitle = computed(() => {
  const currentRound = store.getters['race/currentRound'] as Round | null
  if (currentRound)
    return `Round ${currentRound.roundNumber} — ${currentRound.distance}m`
  if (store.state.race.status === RACE_STATUS.FINISHED) return 'Race Complete'
  return 'Race Track'
})

let isAnimating = false

async function runRound(): Promise<void> {
  if (isAnimating) return
  const round = store.getters['race/currentRound'] as Round | null
  if (!round) return

  isAnimating = true

  const entries = round.selectedHorses.map((horse) => ({
    horse,
    finishTime: computeFinishTime(horse, round.distance),
  }))

  animation.reset()
  await animation.start(entries, DURATION_SCALE)

  const sortedEntries = [...entries].sort((a, b) => a.finishTime - b.finishTime)
  const results: RaceResult[] = sortedEntries.map((entry, i) => ({
    position: i + 1,
    horse: entry.horse,
    finishTime: entry.finishTime,
  }))

  isAnimating = false
  await store.dispatch('race/completeRound', results)

  // continue to next round automatically if still running
  if (store.state.race.status === RACE_STATUS.RUNNING) {
    await runRound()
  }
}

watch(
  () => store.state.race.status,
  (status) => {
    if (status === RACE_STATUS.RUNNING && !isAnimating) {
      runRound()
    }
  },
)

onUnmounted(() => {
  animation.cleanup()
})
</script>

<template>
  <div class="flex flex-col gap-4 p-4 min-h-screen">
    <ControlPanel />

    <div class="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 items-start">
      <Panel header="Horse Pool" class="overflow-y-auto max-h-none md:max-h-[calc(100vh-120px)]">
        <HorseList :horses="store.state.horse.horses" />
      </Panel>

      <div class="flex flex-col gap-4">
        <Panel :header="trackTitle">
          <RaceTrack
            :horses="trackHorses"
            :progress="animation.progress"
            :is-running="store.state.race.status === RACE_STATUS.RUNNING"
          />
        </Panel>

        <Panel header="Results" :pt="{ content: { class: 'max-h-[380px] overflow-y-auto' } }">
          <ResultsPanel :rounds="completedRounds" />
        </Panel>
      </div>
    </div>
  </div>
</template>
