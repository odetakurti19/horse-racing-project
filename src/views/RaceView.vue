<script setup lang="ts">
import { computed, nextTick, ref, watch, onBeforeUnmount } from "vue"
import { useStore } from "vuex"
import Panel from "primevue/panel"
import { key } from "@/stores"
import { useRaceAnimation } from "@/composables/useRaceAnimation"
import { computeFinishTime } from "@/utils/horse"
import { RACE_STATUS, ANIMATION_DURATION_SCALE } from "@/utils/constants"
import type { RaceResult, Round } from "@/types"
import ControlPanel from "@/components/race/ControlPanel.vue"
import HorseList from "@/components/horse/HorseList.vue"
import RaceTrack from "@/components/race/RaceTrack.vue"
import ResultsPanel from "@/components/results/ResultsPanel.vue"

const store = useStore(key)
const animation = useRaceAnimation()

const completedRounds = computed(() =>
  store.state.race.schedule.slice(0, store.state.race.currentRoundIndex),
)

const trackHorses = computed(
  () => (store.getters["race/currentRound"] as Round | null)?.selectedHorses ?? [],
)

const trackTitle = computed(() => {
  const currentRound = store.getters["race/currentRound"] as Round | null
  if (currentRound) return `Round ${currentRound.roundNumber} — ${currentRound.distance}m`
  if (store.state.race.status === RACE_STATUS.FINISHED) return "Race Complete"
  return "Race Track"
})

const isAnimating = ref(false)
const resultsScrollRef = ref<HTMLElement | null>(null)

watch(
  () => completedRounds.value.length,
  async () => {
    await nextTick()
    if (resultsScrollRef.value) {
      resultsScrollRef.value.scrollTop = resultsScrollRef.value.scrollHeight
    }
  },
)

const runRound = async (): Promise<void> => {
  if (isAnimating.value) return
  isAnimating.value = true

  try {
    while (store.state.race.status === RACE_STATUS.RUNNING) {
      const round = store.getters["race/currentRound"] as Round | null
      if (!round) break

      const entries = round.selectedHorses.map((horse) => ({
        horse,
        finishTime: computeFinishTime(horse, round.distance),
      }))

      animation.reset()
      await animation.start(entries, ANIMATION_DURATION_SCALE)

      const sortedEntries = [...entries].sort((a, b) => a.finishTime - b.finishTime)
      const results: RaceResult[] = sortedEntries.map((entry, i) => ({
        position: i + 1,
        horse: entry.horse,
        finishTime: entry.finishTime,
      }))

      await store.dispatch("race/completeRound", results)
    }
  } catch (err) {
    console.error("[runRound] unexpected error, pausing race:", err)
    await store.dispatch("race/pauseRace")
  } finally {
    isAnimating.value = false
  }
}

watch(
  () => store.state.race.status,
  (status) => {
    if (status === RACE_STATUS.RUNNING) {
      if (isAnimating.value) {
        animation.resume()
      } else {
        void runRound()
      }
    } else if (status === RACE_STATUS.PAUSED) {
      animation.pause()
    }
  },
)

onBeforeUnmount(() => {
  animation.cleanup()
})
</script>

<template>
  <div class="flex flex-col gap-4 p-4 min-h-screen">
    <ControlPanel />

    <div class="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 items-start">
      <div class="flex flex-col gap-4 order-first md:order-last">
        <Panel :header="trackTitle">
          <RaceTrack
            :horses="trackHorses"
            :progress="animation.progress"
            :is-running="store.state.race.status === RACE_STATUS.RUNNING"
          />
        </Panel>

        <Panel header="Results">
          <div ref="resultsScrollRef" class="max-h-95 overflow-y-auto">
            <ResultsPanel :rounds="completedRounds" />
          </div>
        </Panel>
      </div>

      <!-- Horse Pool: visually left on md+, scrolls below track on mobile -->
      <Panel
        header="Horse Pool"
        class="order-last md:order-first overflow-y-auto max-h-none md:max-h-[calc(100vh-120px)]"
      >
        <HorseList :horses="store.state.horse.horses" />
      </Panel>
    </div>
  </div>
</template>
