import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import RoundResult from "@/components/results/RoundResult.vue"
import type { Round } from "@/types"

const round: Round = {
  roundNumber: 2,
  distance: 1400,
  selectedHorses: [],
  results: [
    {
      position: 1,
      horse: { id: 1, name: "Thunder Storm", color: "#E63946", condition: 80 },
      finishTime: 95.23,
    },
    {
      position: 2,
      horse: { id: 2, name: "Silver Arrow", color: "#2196F3", condition: 70 },
      finishTime: 98.44,
    },
  ],
}

describe("RoundResult", () => {
  it("renders the round-result container", () => {
    const wrapper = mount(RoundResult, { props: { round } })
    expect(wrapper.find('[data-testid="round-result"]').exists()).toBe(true)
  })

  it("shows the round number in the heading", () => {
    const wrapper = mount(RoundResult, { props: { round } })
    expect(wrapper.get('[data-testid="round-heading"]').text()).toContain("Round 2")
  })

  it("shows the distance in the heading", () => {
    const wrapper = mount(RoundResult, { props: { round } })
    expect(wrapper.get('[data-testid="round-heading"]').text()).toContain("1400m")
  })

  it("renders a row for each result", () => {
    const wrapper = mount(RoundResult, { props: { round } })
    expect(wrapper.findAll('[data-testid="result-row"]')).toHaveLength(2)
  })

  it("displays finish times formatted to 2 decimal places", () => {
    const wrapper = mount(RoundResult, { props: { round } })
    const times = wrapper.findAll('[data-testid="finish-time"]')
    expect(times[0].text()).toContain("95.23")
    expect(times[1].text()).toContain("98.44")
  })

  it("renders the result list container", () => {
    const wrapper = mount(RoundResult, { props: { round } })
    expect(wrapper.find('[data-testid="result-list"]').exists()).toBe(true)
  })
})
