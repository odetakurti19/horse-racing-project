import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import ResultsPanel from "@/components/results/ResultsPanel.vue"
import type { Round } from "@/types"

const makeRound = (n: number): Round => ({
  roundNumber: n,
  distance: 1200,
  selectedHorses: [],
  results: [
    {
      position: 1,
      horse: { id: 1, name: "Thunder", color: "#E63946", condition: 80 },
      finishTime: 90.5,
    },
  ],
})

describe("ResultsPanel", () => {
  it("shows empty state message when no rounds", () => {
    const wrapper = mount(ResultsPanel, { props: { rounds: [] } })
    expect(wrapper.find('[data-testid="results-empty"]').exists()).toBe(true)
  })

  it("hides empty state when rounds are provided", () => {
    const wrapper = mount(ResultsPanel, { props: { rounds: [makeRound(1)] } })
    expect(wrapper.find('[data-testid="results-empty"]').exists()).toBe(false)
  })

  it("renders one RoundResult per round", () => {
    const wrapper = mount(ResultsPanel, {
      props: { rounds: [makeRound(1), makeRound(2)] },
    })
    expect(wrapper.findAll('[data-testid="round-result"]')).toHaveLength(2)
  })

  it("renders the results-panel container", () => {
    const wrapper = mount(ResultsPanel, { props: { rounds: [] } })
    expect(wrapper.find('[data-testid="results-panel"]').exists()).toBe(true)
  })
})
