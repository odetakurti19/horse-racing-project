import type { Module } from "vuex"
import type { Horse, Round, RaceResult, RaceStatus } from "@/types"
import { buildSchedule } from "@/utils/horse"
import { RACE_STATUS, TOTAL_ROUNDS } from "@/utils/constants"
import type { RootState } from "./index"

export interface RaceState {
  schedule: Round[]
  currentRoundIndex: number
  status: RaceStatus
}

export const raceModule: Module<RaceState, RootState> = {
  namespaced: true,
  state: (): RaceState => ({
    schedule: [],
    currentRoundIndex: 0,
    status: RACE_STATUS.IDLE,
  }),
  getters: {
    currentRound: (state): Round | null => state.schedule[state.currentRoundIndex] ?? null,
    isRaceFinished: (state) => state.currentRoundIndex >= TOTAL_ROUNDS,
  },
  mutations: {
    SET_SCHEDULE(state, schedule: Round[]) {
      state.schedule = schedule
      state.status = RACE_STATUS.SCHEDULED
    },
    SET_STATUS(state, status: RaceStatus) {
      state.status = status
    },
    COMPLETE_ROUND(state, results: RaceResult[]) {
      state.schedule[state.currentRoundIndex].results = results
      state.currentRoundIndex++
      if (state.currentRoundIndex >= TOTAL_ROUNDS) {
        state.status = RACE_STATUS.FINISHED
      }
    },
    RESET(state) {
      state.schedule = []
      state.currentRoundIndex = 0
      state.status = RACE_STATUS.IDLE
    },
  },
  actions: {
    generateSchedule({ commit }, horses: Horse[]) {
      commit("SET_SCHEDULE", buildSchedule(horses))
    },
    startRace({ commit }) {
      commit("SET_STATUS", RACE_STATUS.RUNNING)
    },
    pauseRace({ commit }) {
      commit("SET_STATUS", RACE_STATUS.PAUSED)
    },
    completeRound({ commit }, results: RaceResult[]) {
      commit("COMPLETE_ROUND", results)
    },
    resetRace({ commit }) {
      commit("RESET")
    },
  },
}
