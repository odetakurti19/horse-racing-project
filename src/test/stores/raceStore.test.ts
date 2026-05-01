import { describe, it, expect } from "vitest"
import { createStore } from "vuex"
import { raceModule } from "@/stores/raceStore"
import { RACE_STATUS, TOTAL_ROUNDS } from "@/utils/constants"
import { generateHorses, buildSchedule } from "@/utils/horse"
import type { RaceResult } from "@/types"

const makeStore = () => createStore({ modules: { race: raceModule } })

const stubHorse = (id = 1) => ({
  id,
  name: `Horse ${id}`,
  color: "#ffffff",
  condition: 50,
})

const stubResult = (id = 1): RaceResult => ({
  position: 1,
  horse: stubHorse(id),
  finishTime: 90.0,
})

describe("raceStore — initial state", () => {
  it("starts with idle status", () => {
    expect(makeStore().state.race.status).toBe(RACE_STATUS.IDLE)
  })

  it("starts with empty schedule", () => {
    expect(makeStore().state.race.schedule).toEqual([])
  })

  it("starts with round index 0", () => {
    expect(makeStore().state.race.currentRoundIndex).toBe(0)
  })
})

describe("raceStore — getters", () => {
  it("currentRound is null when schedule is empty", () => {
    expect(makeStore().getters["race/currentRound"]).toBeNull()
  })

  it("currentRound returns first round after schedule is set", () => {
    const store = makeStore()
    const schedule = buildSchedule(generateHorses())
    store.commit("race/SET_SCHEDULE", schedule)
    expect(store.getters["race/currentRound"]).toEqual(schedule[0])
  })

  it("isRaceFinished is false initially", () => {
    expect(makeStore().getters["race/isRaceFinished"]).toBe(false)
  })

  it("isRaceFinished is true after all rounds are completed", () => {
    const store = makeStore()
    store.commit("race/SET_SCHEDULE", buildSchedule(generateHorses()))
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      store.commit("race/COMPLETE_ROUND", [stubResult()])
    }
    expect(store.getters["race/isRaceFinished"]).toBe(true)
  })
})

describe("raceStore — mutations", () => {
  it("SET_SCHEDULE stores the schedule and sets status to scheduled", () => {
    const store = makeStore()
    const schedule = buildSchedule(generateHorses())
    store.commit("race/SET_SCHEDULE", schedule)
    expect(store.state.race.schedule).toEqual(schedule)
    expect(store.state.race.status).toBe(RACE_STATUS.SCHEDULED)
  })

  it("SET_STATUS updates the status", () => {
    const store = makeStore()
    store.commit("race/SET_STATUS", RACE_STATUS.RUNNING)
    expect(store.state.race.status).toBe(RACE_STATUS.RUNNING)
  })

  it("COMPLETE_ROUND increments currentRoundIndex", () => {
    const store = makeStore()
    store.commit("race/SET_SCHEDULE", buildSchedule(generateHorses()))
    store.commit("race/COMPLETE_ROUND", [stubResult()])
    expect(store.state.race.currentRoundIndex).toBe(1)
  })

  it("COMPLETE_ROUND sets status to finished after all rounds", () => {
    const store = makeStore()
    store.commit("race/SET_SCHEDULE", buildSchedule(generateHorses()))
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      store.commit("race/COMPLETE_ROUND", [stubResult()])
    }
    expect(store.state.race.status).toBe(RACE_STATUS.FINISHED)
  })

  it("RESET restores the initial state", () => {
    const store = makeStore()
    store.commit("race/SET_STATUS", RACE_STATUS.RUNNING)
    store.commit("race/RESET")
    expect(store.state.race.status).toBe(RACE_STATUS.IDLE)
    expect(store.state.race.schedule).toEqual([])
    expect(store.state.race.currentRoundIndex).toBe(0)
  })
})

describe("raceStore — actions", () => {
  it("startRace sets status to running", async () => {
    const store = makeStore()
    await store.dispatch("race/startRace")
    expect(store.state.race.status).toBe(RACE_STATUS.RUNNING)
  })

  it("pauseRace sets status to paused", async () => {
    const store = makeStore()
    await store.dispatch("race/pauseRace")
    expect(store.state.race.status).toBe(RACE_STATUS.PAUSED)
  })

  it("completeRound stores results on the round", async () => {
    const store = makeStore()
    store.commit("race/SET_SCHEDULE", buildSchedule(generateHorses()))
    const results = [stubResult()]
    await store.dispatch("race/completeRound", results)
    expect(store.state.race.schedule[0].results).toEqual(results)
  })

  it("resetRace restores idle state", async () => {
    const store = makeStore()
    await store.dispatch("race/startRace")
    await store.dispatch("race/resetRace")
    expect(store.state.race.status).toBe(RACE_STATUS.IDLE)
  })
})
