import { describe, it, expect } from "vitest";
import { selectHorsesForRound, simulateRace } from "@/utils/raceUtils";
import { createHorse } from "@/utils/horse";
import { HORSES_PER_ROUND, TOTAL_HORSES } from "@/utils/constants";

const makeHorses = (count: number) =>
  Array.from({ length: count }, (_, i) =>
    createHorse(i + 1, `Horse ${i + 1}`, "#FF0000", 50),
  );

describe("selectHorsesForRound", () => {
  it(`returns ${HORSES_PER_ROUND} horses`, () => {
    expect(selectHorsesForRound(makeHorses(TOTAL_HORSES))).toHaveLength(
      HORSES_PER_ROUND,
    );
  });

  it("does not mutate the input array", () => {
    const horses = makeHorses(TOTAL_HORSES);
    const copy = [...horses];
    selectHorsesForRound(horses);
    expect(horses).toEqual(copy);
  });

  it("returns only horses present in the input", () => {
    const horses = makeHorses(TOTAL_HORSES);
    const ids = new Set(horses.map((h) => h.id));
    selectHorsesForRound(horses).forEach((h) => {
      expect(ids.has(h.id)).toBe(true);
    });
  });

  it("returns unique horses (no duplicates)", () => {
    const selected = selectHorsesForRound(makeHorses(TOTAL_HORSES));
    const ids = selected.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("simulateRace", () => {
  const horses = makeHorses(HORSES_PER_ROUND);

  it("returns a result for every horse", () => {
    expect(simulateRace(horses, 1200)).toHaveLength(horses.length);
  });

  it("assigns positions starting from 1 up to horse count", () => {
    const results = simulateRace(horses, 1200);
    const positions = results.map((r) => r.position).sort((a, b) => a - b);
    expect(positions[0]).toBe(1);
    expect(positions[positions.length - 1]).toBe(horses.length);
  });

  it("sorts results by finish time ascending", () => {
    const results = simulateRace(horses, 1200);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].finishTime).toBeGreaterThanOrEqual(
        results[i - 1].finishTime,
      );
    }
  });

  it("all finish times are positive", () => {
    simulateRace(horses, 1200).forEach((r) => {
      expect(r.finishTime).toBeGreaterThan(0);
    });
  });
});
