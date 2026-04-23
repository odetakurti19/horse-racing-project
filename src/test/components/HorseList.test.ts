import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HorseList from "@/components/horse/HorseList.vue";
import type { Horse } from "@/types";

const makeHorse = (id: number): Horse => ({
  id,
  name: `Horse ${id}`,
  color: "#ffffff",
  condition: 50,
});

describe("HorseList", () => {
  it("shows empty message when horses array is empty", () => {
    const wrapper = mount(HorseList, { props: { horses: [] } });
    expect(wrapper.find('[data-testid="horse-list-empty"]').exists()).toBe(
      true,
    );
    expect(wrapper.find('[data-testid="horse-grid"]').exists()).toBe(false);
  });

  it("renders the horse grid when horses are provided", () => {
    const wrapper = mount(HorseList, { props: { horses: [makeHorse(1)] } });
    expect(wrapper.find('[data-testid="horse-grid"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="horse-list-empty"]').exists()).toBe(
      false,
    );
  });

  it("renders one HorseCard per horse", () => {
    const horses = [makeHorse(1), makeHorse(2), makeHorse(3)];
    const wrapper = mount(HorseList, { props: { horses } });
    expect(wrapper.findAll('[data-testid="horse-card"]')).toHaveLength(3);
  });

  it("always renders the horse-list container", () => {
    const wrapper = mount(HorseList, { props: { horses: [] } });
    expect(wrapper.find('[data-testid="horse-list"]').exists()).toBe(true);
  });
});
