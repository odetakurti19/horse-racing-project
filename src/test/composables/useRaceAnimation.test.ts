import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { useRaceAnimation } from "@/composables/useRaceAnimation"

let rafCallbacks: FrameRequestCallback[]
let rafIdCounter: number

beforeEach(() => {
  rafCallbacks = []
  rafIdCounter = 0
  vi.stubGlobal("performance", { now: vi.fn().mockReturnValue(0) })
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    rafCallbacks.push(cb)
    return ++rafIdCounter
  })
  vi.stubGlobal("cancelAnimationFrame", vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const stubHorse = (id: number) => ({
  id,
  name: `Horse ${id}`,
  color: "#ffffff",
  condition: 80,
})

describe("useRaceAnimation", () => {
  it("initialises progress to 0 for each entry horse", () => {
    const { progress, start } = useRaceAnimation()
    void start([{ horse: stubHorse(1), finishTime: 10 }], 1)
    expect(progress[1]).toBe(0)
  })

  it("progress reaches 100 when elapsed exceeds finish duration", async () => {
    const { progress, start } = useRaceAnimation()
    const promise = start([{ horse: stubHorse(1), finishTime: 10 }], 1)
    // startTime = 0 (mocked performance.now); finishTime * durationScale = 10ms
    // Call frame with now = 15 → elapsed 15 > 10 → p = 150, clamped to 100
    rafCallbacks[0]!(15)
    await promise
    expect(progress[1]).toBe(100)
  })

  it("progress is proportional before finish", () => {
    const { progress, start } = useRaceAnimation()
    void start([{ horse: stubHorse(1), finishTime: 100 }], 1)
    // finishTime * durationScale = 100ms; elapsed = 50 → p = 50%
    rafCallbacks[0]!(50)
    expect(progress[1]).toBeCloseTo(50)
  })

  it("schedules next RAF frame when animation is incomplete", () => {
    const { start } = useRaceAnimation()
    void start([{ horse: stubHorse(1), finishTime: 100 }], 1)
    rafCallbacks[0]!(50) // not done yet → should schedule another frame
    expect(rafCallbacks.length).toBe(2)
  })

  it("resolves the promise only once all horses reach 100%", async () => {
    const { progress, start } = useRaceAnimation()
    const entries = [
      { horse: stubHorse(1), finishTime: 10 },
      { horse: stubHorse(2), finishTime: 20 },
    ]
    const promise = start(entries, 1)
    // elapsed = 15: horse 1 done (15 > 10), horse 2 at 75% (15/20)
    rafCallbacks[0]!(15)
    expect(progress[2]).toBeLessThan(100)
    // elapsed = 25: both done
    rafCallbacks[1]!(25)
    await promise
    expect(progress[1]).toBe(100)
    expect(progress[2]).toBe(100)
  })

  it("reset sets all tracked progress values to 0", () => {
    const { progress, start, reset } = useRaceAnimation()
    void start([{ horse: stubHorse(1), finishTime: 100 }], 1)
    rafCallbacks[0]!(50) // progress[1] = 50
    expect(progress[1]).toBeCloseTo(50)
    reset()
    expect(progress[1]).toBe(0)
  })

  it("cleanup calls cancelAnimationFrame", () => {
    const { start, cleanup } = useRaceAnimation()
    void start([{ horse: stubHorse(1), finishTime: 100 }], 1)
    cleanup()
    expect(cancelAnimationFrame).toHaveBeenCalled()
  })

  describe("pause and resume", () => {
    it("pause cancels the current RAF", () => {
      const { start, pause } = useRaceAnimation()
      void start([{ horse: stubHorse(1), finishTime: 100 }], 1)
      pause()
      expect(cancelAnimationFrame).toHaveBeenCalledWith(1)
    })

    it("resume schedules a new RAF frame", () => {
      const { start, pause, resume } = useRaceAnimation()
      void start([{ horse: stubHorse(1), finishTime: 100 }], 1)
      pause()
      resume()
      expect(rafCallbacks.length).toBe(2)
    })

    it("pause is a no-op when not animating", () => {
      const { pause } = useRaceAnimation()
      pause()
      expect(cancelAnimationFrame).not.toHaveBeenCalled()
    })

    it("resume is a no-op when not paused", () => {
      const { start, resume } = useRaceAnimation()
      void start([{ horse: stubHorse(1), finishTime: 100 }], 1)
      resume() // not paused — should not schedule a second frame
      expect(rafCallbacks.length).toBe(1)
    })

    it("progress continues from paused position after resume", async () => {
      const nowMock = performance.now as ReturnType<typeof vi.fn>
      const { progress, start, pause, resume } = useRaceAnimation()

      // startTime = 0 (performance.now returns 0)
      const promise = start([{ horse: stubHorse(1), finishTime: 100 }], 1)

      // frame at t=50ms → elapsed=50 → progress=50%
      rafCallbacks[0]!(50)
      expect(progress[1]).toBeCloseTo(50)

      // pause: performance.now()=50 → pausedElapsed = 50 - 0 = 50
      nowMock.mockReturnValueOnce(50)
      pause()

      // resume: performance.now()=200 → startTime = 200 - 50 = 150
      nowMock.mockReturnValueOnce(200)
      resume()

      // frame at t=250 → elapsed = 250 - 150 = 100 → progress = 100%
      rafCallbacks[1]!(250)
      await promise
      expect(progress[1]).toBe(100)
    })
  })
})
