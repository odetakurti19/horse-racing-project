<script setup lang="ts">
import Message from "primevue/message"
import type { Round } from "@/types"
import RoundResult from "@/components/results/RoundResult.vue"

const props = defineProps<{ rounds: Round[] }>()
</script>

<template>
  <div class="flex flex-col gap-3" data-testid="results-panel">
    <Message
      v-if="rounds.length === 0"
      severity="secondary"
      :closable="false"
      data-testid="results-empty"
    >
      Results will appear here after each round.
    </Message>
    <TransitionGroup v-else name="result-fade" tag="div" class="flex flex-col gap-3">
      <RoundResult v-for="round in rounds" :key="round.roundNumber" :round="round" />
    </TransitionGroup>
  </div>
</template>

<style>
.result-fade-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.result-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
</style>
