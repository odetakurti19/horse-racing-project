import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import HorseCard from "@/components/horse/HorseCard.vue"
import type { Horse } from "@/types"

const horse: Horse = {
  id: 1,
  name: "Thunder Storm",
  color: "#E63946",
  condition: 75,
}

describe("HorseCard", () => {
  it("renders the horse name", () => {
    const wrapper = mount(HorseCard, { props: { horse } })
    expect(wrapper.get('[data-testid="horse-name"]').text()).toBe("Thunder Storm")
  })

  it("renders the condition label with the correct value", () => {
    const wrapper = mount(HorseCard, { props: { horse } })
    expect(wrapper.get('[data-testid="condition-label"]').text()).toContain("75")
  })

  it("renders the color swatch with the horse color", () => {
    const wrapper = mount(HorseCard, { props: { horse } })
    const swatch = wrapper.get('[data-testid="horse-color-swatch"]')
    const bg = (swatch.element as HTMLElement).style.backgroundColor
    expect(bg).toBeTruthy()
    expect(bg).not.toBe("")
  })

  it("renders a horse-card element", () => {
    const wrapper = mount(HorseCard, { props: { horse } })
    expect(wrapper.find('[data-testid="horse-card"]').exists()).toBe(true)
  })
})
