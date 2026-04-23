import { createStore } from "vuex";
import type { InjectionKey } from "vue";
import type { Store } from "vuex";
import { horseModule, type HorseState } from "./horseStore";
import { raceModule, type RaceState } from "./raceStore";

export interface RootState {
  horse: HorseState;
  race: RaceState;
}

export const key: InjectionKey<Store<RootState>> = Symbol();

export const store = createStore<RootState>({
  modules: {
    horse: horseModule,
    race: raceModule,
  },
});
