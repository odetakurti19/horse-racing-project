import type { Horse, RaceResult } from "@/types";
import { HORSES_PER_ROUND } from "@/utils/constants";

export function selectHorsesForRound(horses: Horse[]): Horse[] {
  const copy = [...horses];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, HORSES_PER_ROUND);
}

export function simulateRace(horses: Horse[], distance: number): RaceResult[] {
  const results = horses.map((horse) => {
    const speed = (horse.condition / 100) * 0.6 + Math.random() * 0.4;
    const finishTime = distance / speed;
    return { horse, finishTime };
  });

  results.sort((a, b) => a.finishTime - b.finishTime);

  return results.map((r, index) => ({
    position: index + 1,
    horse: r.horse,
    finishTime: r.finishTime,
  }));
}
