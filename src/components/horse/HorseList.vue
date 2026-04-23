<script setup lang="ts">
import Message from 'primevue/message'
import type { Horse } from '@/types'
import HorseCard from '@/components/horse/HorseCard.vue'

defineProps<{ horses: Horse[] }>()
</script>

<template>
  <div class="w-full" data-testid="horse-list">
    <Message v-if="horses.length === 0" severity="secondary" :closable="false" data-testid="horse-list-empty">
      No horses generated yet.
    </Message>
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2" data-testid="horse-grid">
      <HorseCard v-for="horse in horses" :key="horse.id" :horse="horse" />
    </div>
  </div>
</template>
