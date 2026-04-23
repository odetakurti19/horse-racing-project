import type { Horse, Round, RaceSchedule } from "@/types";
import {
  ROUND_DISTANCES,
  RACE_STATUS,
  TOTAL_HORSES,
  HORSES_PER_ROUND,
} from "@/utils/constants";

const HORSE_NAMES: string[] = [
  "Thunder Storm",
  "Silver Arrow",
  "Golden Flash",
  "Dark Knight",
  "Star Gazer",
  "Moon Dancer",
  "Wind Chaser",
  "Fire Spirit",
  "Ocean Dream",
  "Mountain King",
  "Storm Rider",
  "Desert Rose",
  "Lightning Bolt",
  "Swift Shadow",
  "Royal Blue",
  "Iron Will",
  "Dawn Breaker",
  "Night Fury",
  "Crystal Clear",
  "Brave Heart",
];

const HORSE_COLORS: string[] = [
  "#E63946", // vivid red
  "#2196F3", // blue
  "#4CAF50", // green
  "#FF9800", // orange
  "#9C27B0", // purple
  "#00BCD4", // cyan
  "#FFEB3B", // yellow
  "#FF5722", // deep orange
  "#009688", // teal
  "#3F51B5", // indigo
  "#F06292", // pink
  "#8BC34A", // light green
  "#FFC107", // amber
  "#795548", // brown
  "#607D8B", // blue grey
  "#E91E63", // hot pink
  "#00E676", // green accent
  "#40C4FF", // light blue
  "#FF6D00", // orange accent
  "#AA00FF", // purple accent
];

export function createHorse(
  id: number,
  name: string,
  color: string,
  condition: number,
): Horse {
  return { id, name, color, condition };
}

export function createRound(roundNumber: number, distance: number): Round {
  return {
    roundNumber,
    distance,
    selectedHorses: [],
    results: [],
    status: RACE_STATUS.IDLE,
  };
}

export function createRaceSchedule(): RaceSchedule {
  const rounds: Round[] = ROUND_DISTANCES.map((distance, index) =>
    createRound(index + 1, distance),
  );
  return { rounds };
}

export function generateHorses(): Horse[] {
  return Array.from({ length: TOTAL_HORSES }, (_, i) =>
    createHorse(
      i + 1,
      HORSE_NAMES[i],
      HORSE_COLORS[i],
      Math.floor(Math.random() * 100) + 1,
    ),
  );
}

export function buildSchedule(horses: Horse[]): Round[] {
  return ROUND_DISTANCES.map((distance, index) => {
    const shuffled = [...horses].sort(() => Math.random() - 0.5);
    const round = createRound(index + 1, distance);
    round.selectedHorses = shuffled.slice(0, HORSES_PER_ROUND);
    return round;
  });
}

/**
 * Compute a simulated finish time (in seconds) for a horse given race distance.
 * Higher condition → faster speed. A small random variance is added per run.
 */
export function computeFinishTime(horse: Horse, distance: number): number {
  // Speed range: 13–19 m/s based on condition 1–100
  const baseSpeed = 13 + (horse.condition / 100) * 6;
  const variance = (Math.random() - 0.5) * 1.5; // ±0.75 m/s
  const speed = Math.max(10, baseSpeed + variance);
  return distance / speed; // seconds
}
