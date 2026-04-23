<script setup lang="ts">
import { watch } from 'vue'
import type { Horse } from '@/types'
import HorseIcon from '@/components/race/HorseIcon.vue'

const props = defineProps<{
  horses: Horse[]
  progress: Record<number, number>
  isRunning: boolean
}>()

const emit = defineEmits<{
  'race-complete': []
}>()

watch(
  () => props.progress,
  (prog) => {
    if (props.horses.length === 0) return
    const allDone = props.horses.every((h) => (prog[h.id] ?? 0) >= 100)
    if (allDone) emit('race-complete')
  },
  { deep: true },
)
</script>

<template>
  <div class="flex flex-col gap-2 bg-(--track-bg) border border-(--border-color) rounded-lg p-4 w-full" data-testid="race-track">
    <div
      v-for="horse in horses"
      :key="horse.id"
      class="flex items-center gap-3"
      data-testid="race-lane"
    >
      <span class="w-32.5 text-[0.8rem] font-semibold shrink-0 whitespace-nowrap overflow-hidden text-ellipsis" data-testid="lane-label" :style="{ color: horse.color }">
        {{ horse.name }}
      </span>
      <div class="flex-1 h-9 bg-(--panel-bg) border border-(--border-subtle) rounded relative overflow-visible">
        <div
          class="absolute top-1/2 -translate-y-1/2 left-0 w-11 h-7 transition-[left] duration-100 ease-linear"
          data-testid="horse-marker"
          :style="{
            left: `calc(${(progress[horse.id] ?? 0) / 100} * (100% - 44px))`,
          }"
        >
          <HorseIcon :color="horse.color" :is-running="isRunning" />
        </div>
      </div>
    </div>
  </div>
</template>
