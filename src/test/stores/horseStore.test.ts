import { describe, it, expect } from "vitest";
import { createStore } from "vuex";
import { horseModule } from "@/stores/horseStore";
import { TOTAL_HORSES } from "@/utils/constants";
import type { Horse } from "@/types";

const makeStore = () => createStore({ modules: { horse: horseModule } });

const stubHorse = (id = 1): Horse => ({
  id,
  name: `Horse ${id}`,
  color: "#ffffff",
  condition: 50,
});

describe("horseStore — state", () => {
  it("initialises with an empty horses array", () => {
    expect(makeStore().state.horse.horses).toEqual([]);
  });
});

describe("horseStore — getters", () => {
  it("isGenerated is false when no horses", () => {
    expect(makeStore().getters["horse/isGenerated"]).toBe(false);
  });

  it("isGenerated is true after horses are committed", () => {
    const store = makeStore();
    store.commit("horse/SET_HORSES", [stubHorse()]);
    expect(store.getters["horse/isGenerated"]).toBe(true);
  });
});

describe("horseStore — mutations", () => {
  it("SET_HORSES replaces the horses array", () => {
    const store = makeStore();
    const horses = [stubHorse(1), stubHorse(2)];
    store.commit("horse/SET_HORSES", horses);
    expect(store.state.horse.horses).toEqual(horses);
  });

  it("RESET clears the horses array", () => {
    const store = makeStore();
    store.commit("horse/SET_HORSES", [stubHorse()]);
    store.commit("horse/RESET");
    expect(store.state.horse.horses).toEqual([]);
  });
});

describe("horseStore — actions", () => {
  it("generateHorses populates the store with horses", async () => {
    const store = makeStore();
    await store.dispatch("horse/generateHorses");
    expect(store.state.horse.horses).toHaveLength(TOTAL_HORSES);
  });

  it("reset clears the horses", async () => {
    const store = makeStore();
    await store.dispatch("horse/generateHorses");
    await store.dispatch("horse/reset");
    expect(store.state.horse.horses).toEqual([]);
  });
});
