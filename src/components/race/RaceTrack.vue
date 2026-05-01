<script setup lang="ts">
import type { Horse } from "@/types"
import HorseIcon from "@/components/race/HorseIcon.vue"

defineProps<{
  horses: Horse[]
  progress: Record<number, number>
  isRunning: boolean
}>()
</script>

<template>
  <div
    class="flex flex-col gap-2 bg-(--track-bg) border border-(--border-color) rounded-lg p-4 w-full"
    data-testid="race-track"
  >
    <div
      v-for="horse in horses"
      :key="horse.id"
      class="flex items-center gap-3"
      data-testid="race-lane"
    >
      <span
        class="w-32.5 text-[0.8rem] font-semibold shrink-0 whitespace-nowrap overflow-hidden text-ellipsis"
        data-testid="lane-label"
        :style="{ color: horse.color }"
      >
        {{ horse.name }}
      </span>
      <div
        class="flex-1 h-9 bg-(--panel-bg) border border-(--border-subtle) rounded relative overflow-visible @container"
      >
        <div
          class="absolute top-1/2 w-11 h-7"
          data-testid="horse-marker"
          :style="{
            transform: `translateY(-50%) translateX(calc(${(progress[horse.id] ?? 0) / 100} * (100cqw - 44px)))`,
          }"
        >
          <HorseIcon :color="horse.color" :is-running="isRunning" />
        </div>
      </div>
    </div>
  </div>
</template>
