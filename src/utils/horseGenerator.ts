import type { Horse } from "@/types";
import { createHorse } from "@/utils/horse";

export const HORSE_NAMES: string[] = [
  "Thunder Bolt",
  "Silver Arrow",
  "Dark Storm",
  "Golden Flash",
  "Iron Will",
  "Swift Wind",
  "Crimson Tide",
  "Midnight Run",
  "Wild Spirit",
  "Star Chaser",
  "Blaze Runner",
  "Shadow Dancer",
  "Storm Rider",
  "Noble Charge",
  "Fire Streak",
  "Blue Horizon",
  "Desert Rose",
  "Fury Road",
  "Phantom Speed",
  "Lone Ranger",
];

export const HORSE_COLORS: string[] = [
  "#e74c3c",
  "#e67e22",
  "#f1c40f",
  "#2ecc71",
  "#1abc9c",
  "#3498db",
  "#9b59b6",
  "#e91e63",
  "#ff5722",
  "#cddc39",
  "#00bcd4",
  "#673ab7",
  "#ff9800",
  "#4caf50",
  "#03a9f4",
  "#f06292",
  "#8bc34a",
  "#ff6f00",
  "#26c6da",
  "#7e57c2",
];

export function generateHorses(): Horse[] {
  return HORSE_NAMES.map((name, index) =>
    createHorse(index + 1, name, HORSE_COLORS[index], Math.random() * 99 + 1),
  );
}
