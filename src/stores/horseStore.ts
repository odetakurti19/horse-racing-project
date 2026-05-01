import type { Module } from "vuex"
import type { Horse } from "@/types"
import { generateHorses as createHorses } from "@/utils/horse"
import type { RootState } from "./index"

export interface HorseState {
  horses: Horse[]
}

export const horseModule: Module<HorseState, RootState> = {
  namespaced: true,
  state: (): HorseState => ({
    horses: [],
  }),
  getters: {
    isGenerated: (state) => state.horses.length > 0,
  },
  mutations: {
    SET_HORSES(state, horses: Horse[]) {
      state.horses = horses
    },
    RESET(state) {
      state.horses = []
    },
  },
  actions: {
    generateHorses({ commit }) {
      commit("SET_HORSES", createHorses())
    },
    reset({ commit }) {
      commit("RESET")
    },
  },
}
