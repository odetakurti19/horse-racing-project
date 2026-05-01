import { describe, it, expect, vi } from "vitest"
import {
  createHorse,
  createRound,
  generateHorses,
  buildSchedule,
  computeFinishTime,
} from "@/utils/horse"
import { TOTAL_HORSES, HORSES_PER_ROUND, TOTAL_ROUNDS, ROUND_DISTANCES } from "@/utils/constants"

describe("createHorse", () => {
  it("creates a horse with given attributes", () => {
    const horse = createHorse(1, "Thunder", "#FF0000", 85)
    expect(horse).toEqual({
      id: 1,
      name: "Thunder",
      color: "#FF0000",
      condition: 85,
    })
  })
})

describe("createRound", () => {
  it("creates a round with empty arrays", () => {
    const round = createRound(1, 1200)
    expect(round.roundNumber).toBe(1)
    expect(round.distance).toBe(1200)
    expect(round.selectedHorses).toEqual([])
    expect(round.results).toEqual([])
  })
})

describe("generateHorses", () => {
  it(`generates ${TOTAL_HORSES} horses`, () => {
    expect(generateHorses()).toHaveLength(TOTAL_HORSES)
  })

  it("gives each horse a unique id", () => {
    const horses = generateHorses()
    const ids = horses.map((h) => h.id)
    expect(new Set(ids).size).toBe(TOTAL_HORSES)
  })

  it("gives each horse a condition between 1 and 100", () => {
    const horses = generateHorses()
    horses.forEach((h) => {
      expect(h.condition).toBeGreaterThanOrEqual(1)
      expect(h.condition).toBeLessThanOrEqual(100)
    })
  })

  it("assigns a non-empty name and color to each horse", () => {
    const horses = generateHorses()
    horses.forEach((h) => {
      expect(h.name.length).toBeGreaterThan(0)
      expect(h.color.length).toBeGreaterThan(0)
    })
  })
})

describe("buildSchedule", () => {
  it(`returns ${TOTAL_ROUNDS} rounds`, () => {
    const rounds = buildSchedule(generateHorses())
    expect(rounds).toHaveLength(TOTAL_ROUNDS)
  })

  it(`selects ${HORSES_PER_ROUND} horses per round`, () => {
    const rounds = buildSchedule(generateHorses())
    rounds.forEach((round) => {
      expect(round.selectedHorses).toHaveLength(HORSES_PER_ROUND)
    })
  })

  it("assigns correct distances", () => {
    const rounds = buildSchedule(generateHorses())
    rounds.forEach((round, i) => {
      expect(round.distance).toBe(ROUND_DISTANCES[i])
    })
  })

  it("selects only horses from the input pool", () => {
    const horses = generateHorses()
    const ids = new Set(horses.map((h) => h.id))
    const rounds = buildSchedule(horses)
    rounds.forEach((round) => {
      round.selectedHorses.forEach((h) => {
        expect(ids.has(h.id)).toBe(true)
      })
    })
  })
})

describe("computeFinishTime", () => {
  it("returns a positive number", () => {
    const horse = createHorse(1, "Test", "#FF0000", 80)
    expect(computeFinishTime(horse, 1200)).toBeGreaterThan(0)
  })

  it("a higher-condition horse finishes faster (with fixed randomness)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    const fast = createHorse(1, "Fast", "#FF0000", 100)
    const slow = createHorse(2, "Slow", "#0000FF", 1)
    expect(computeFinishTime(fast, 1200)).toBeLessThan(computeFinishTime(slow, 1200))
    vi.restoreAllMocks()
  })

  it("finish time increases with distance", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5)
    const horse = createHorse(1, "Test", "#FF0000", 80)
    expect(computeFinishTime(horse, 2200)).toBeGreaterThan(computeFinishTime(horse, 1200))
    vi.restoreAllMocks()
  })
})
