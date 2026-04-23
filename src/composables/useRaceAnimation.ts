import { reactive } from "vue";
import type { Horse } from "@/types";

export interface AnimationEntry {
  horse: Horse;
  finishTime: number; // simulated seconds
}

export function useRaceAnimation() {
  const progress = reactive<Record<number, number>>({});
  let rafId: number | null = null;

  function start(
    entries: AnimationEntry[],
    durationScale: number,
  ): Promise<void> {
    return new Promise((resolve) => {
      const startTime = performance.now();

      // initialise progress for every horse in this round
      for (const { horse } of entries) {
        progress[horse.id] = 0;
      }

      function frame(now: number): void {
        const elapsed = now - startTime;
        let allDone = true;

        for (const { horse, finishTime } of entries) {
          const p = Math.min(
            100,
            (elapsed / (finishTime * durationScale)) * 100,
          );
          progress[horse.id] = p;
          if (p < 100) allDone = false;
        }

        if (allDone) {
          rafId = null;
          resolve();
        } else {
          rafId = requestAnimationFrame(frame);
        }
      }

      rafId = requestAnimationFrame(frame);
    });
  }

  function reset(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    for (const key in progress) {
      progress[Number(key)] = 0;
    }
  }

  function cleanup(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  return { progress, start, reset, cleanup };
}
