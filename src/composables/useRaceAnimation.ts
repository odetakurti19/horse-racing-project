import { reactive } from "vue"
import type { Horse } from "@/types"

export interface AnimationEntry {
  horse: Horse
  finishTime: number
}

export const useRaceAnimation = () => {
  const progress = reactive<Record<number, number>>({})
  let rafId: number | null = null
  let startTime = 0
  let pausedElapsed = 0
  let isPaused = false
  let currentEntries: AnimationEntry[] = []
  let currentDurationScale = 0
  let resolveAnimation: (() => void) | null = null

  const frame = (now: number): void => {
    const elapsed = now - startTime
    let allDone = true

    for (const { horse, finishTime } of currentEntries) {
      const p = Math.min(100, (elapsed / (finishTime * currentDurationScale)) * 100)
      progress[horse.id] = p
      if (p < 100) allDone = false
    }

    if (allDone) {
      rafId = null
      resolveAnimation?.()
      resolveAnimation = null
    } else {
      rafId = requestAnimationFrame(frame)
    }
  }

  const start = (entries: AnimationEntry[], durationScale: number): Promise<void> => {
    return new Promise((resolve) => {
      currentEntries = entries
      currentDurationScale = durationScale
      resolveAnimation = resolve
      isPaused = false
      pausedElapsed = 0
      startTime = performance.now()

      for (const { horse } of entries) {
        progress[horse.id] = 0
      }

      rafId = requestAnimationFrame(frame)
    })
  }

  const pause = (): void => {
    if (rafId === null || isPaused) return
    cancelAnimationFrame(rafId)
    rafId = null
    isPaused = true
    pausedElapsed = performance.now() - startTime
  }

  const resume = (): void => {
    if (!isPaused) return
    isPaused = false
    startTime = performance.now() - pausedElapsed
    rafId = requestAnimationFrame(frame)
  }

  const reset = (): void => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    isPaused = false
    pausedElapsed = 0
    resolveAnimation = null
    for (const key in progress) {
      progress[Number(key)] = 0
    }
  }

  const cleanup = (): void => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    resolveAnimation = null
  }

  return { progress, start, pause, resume, reset, cleanup }
}
