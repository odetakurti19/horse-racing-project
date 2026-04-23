<script setup lang="ts">
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import type { Round } from '@/types'

defineProps<{ round: Round }>()
</script>

<template>
  <Card class="round-result" data-testid="round-result">
    <template #title>
      <span class="text-[0.95rem] font-bold text-(--accent-gold)" data-testid="round-heading">
        Round {{ round.roundNumber }} &mdash; {{ round.distance }}m
      </span>
    </template>
    <template #content>
      <Divider class="mb-2" />
      <ol class="list-none flex flex-col gap-[0.35rem] p-0 m-0" data-testid="result-list">
        <li
          v-for="result in round.results"
          :key="result.horse.id"
          class="flex items-center gap-2 text-[0.85rem]"
          data-testid="result-row"
        >
          <span class="w-6 text-(--text-muted) font-semibold shrink-0">{{ result.position }}.</span>
          <span class="flex-1 font-medium" :style="{ color: result.horse.color }">
            {{ result.horse.name }}
          </span>
          <span class="text-(--text-muted) [font-variant-numeric:tabular-nums] shrink-0" data-testid="finish-time">
            {{ result.finishTime.toFixed(2) }}s
          </span>
        </li>
      </ol>
    </template>
  </Card>
</template>
