import type { Horse, Round } from "@/types";
import { ROUND_DISTANCES, RACE_STATUS } from "@/utils/constants";
import { selectHorsesForRound } from "@/utils/raceUtils";

export function buildSchedule(horses: Horse[]): Round[] {
  return ROUND_DISTANCES.map((distance, index) => ({
    roundNumber: index + 1,
    distance,
    selectedHorses: selectHorsesForRound(horses),
    results: [],
    status: RACE_STATUS.IDLE,
  }));
}
