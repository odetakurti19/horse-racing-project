<script setup lang="ts">
import Card from "primevue/card"
import ProgressBar from "primevue/progressbar"
import type { Horse } from "@/types"

defineProps<{ horse: Horse }>()
</script>

<template>
  <Card style="--p-card-body-padding: 0.6rem" data-testid="horse-card">
    <template #content>
      <div class="flex items-center gap-3">
        <div class="flex flex-col gap-[0.3rem] flex-1 min-w-0">
          <span
            class="text-[0.8rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
            data-testid="horse-name"
          >
            {{ horse.name }}
          </span>
          <ProgressBar
            :value="horse.condition"
            data-testid="condition-bar"
            class="h-1.5"
            pt:value:style="background: var(--accent-gold)"
          />
          <span class="text-[0.7rem] text-(--text-muted)" data-testid="condition-label">
            Condition: {{ horse.condition }}
          </span>
        </div>
        <div
          class="w-7 h-7 rounded shrink-0 border border-(--border-subtle)"
          :style="{ backgroundColor: horse.color }"
          data-testid="horse-color-swatch"
        ></div>
      </div>
    </template>
  </Card>
</template>
