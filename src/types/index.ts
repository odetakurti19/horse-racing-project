import type { RACE_STATUS } from "@/utils/constants"

export type RaceStatus = (typeof RACE_STATUS)[keyof typeof RACE_STATUS]

export interface Horse {
  id: number
  name: string
  color: string
  condition: number
}

export interface RaceResult {
  position: number
  horse: Horse
  finishTime: number
}

export interface Round {
  roundNumber: number
  distance: number
  selectedHorses: Horse[]
  results: RaceResult[]
}
