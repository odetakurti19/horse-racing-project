export const TOTAL_HORSES = 20;
export const HORSES_PER_ROUND = 10;
export const TOTAL_ROUNDS = 6;
export const ROUND_DISTANCES: number[] = [1200, 1400, 1600, 1800, 2000, 2200];

export const RACE_STATUS = {
  IDLE: "idle",
  SCHEDULED: "scheduled",
  RUNNING: "running",
  PAUSED: "paused",
  FINISHED: "finished",
} as const;
