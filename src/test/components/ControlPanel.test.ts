import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import ControlPanel from "@/components/race/ControlPanel.vue";
import { horseModule } from "@/stores/horseStore";
import { raceModule } from "@/stores/raceStore";
import { key } from "@/stores";
import { RACE_STATUS } from "@/utils/constants";

const makeStore = (raceStatus = RACE_STATUS.IDLE) => {
  const store = createStore({
    modules: {
      horse: horseModule,
      race: raceModule,
    },
  });
  if (raceStatus !== RACE_STATUS.IDLE) {
    store.commit("race/SET_STATUS", raceStatus);
  }
  return store;
};

const mountPanel = (raceStatus = RACE_STATUS.IDLE) => {
  const store = makeStore(raceStatus);
  const wrapper = mount(ControlPanel, {
    global: { provide: { [key as symbol]: store } },
  });
  return { store, wrapper };
};

describe("ControlPanel", () => {
  it("renders the control panel container", () => {
    const { wrapper } = mountPanel();
    expect(wrapper.find('[data-testid="control-panel"]').exists()).toBe(true);
  });

  it("shows the status badge", () => {
    const { wrapper } = mountPanel();
    expect(wrapper.find('[data-testid="status-badge"]').exists()).toBe(true);
  });

  it("displays the current status text", () => {
    const { wrapper } = mountPanel(RACE_STATUS.SCHEDULED);
    expect(wrapper.get('[data-testid="status-badge"]').text()).toContain(
      RACE_STATUS.SCHEDULED,
    );
  });

  it("generate button is enabled when idle", () => {
    const { wrapper } = mountPanel(RACE_STATUS.IDLE);
    const btn = wrapper.get('[data-testid="btn-generate"]');
    expect((btn.element as HTMLButtonElement).disabled).toBe(false);
  });

  it("generate button is disabled when not idle", () => {
    const { wrapper } = mountPanel(RACE_STATUS.SCHEDULED);
    const btn = wrapper.get('[data-testid="btn-generate"]');
    expect((btn.element as HTMLButtonElement).disabled).toBe(true);
  });

  it("start button is disabled when idle", () => {
    const { wrapper } = mountPanel(RACE_STATUS.IDLE);
    const btn = wrapper.get('[data-testid="btn-start"]');
    expect((btn.element as HTMLButtonElement).disabled).toBe(true);
  });

  it("start button is enabled when scheduled", () => {
    const { wrapper } = mountPanel(RACE_STATUS.SCHEDULED);
    const btn = wrapper.get('[data-testid="btn-start"]');
    expect((btn.element as HTMLButtonElement).disabled).toBe(false);
  });

  it("reset button is not visible when not finished", () => {
    const { wrapper } = mountPanel(RACE_STATUS.IDLE);
    expect(wrapper.find('[data-testid="btn-reset"]').exists()).toBe(false);
  });

  it("reset button is visible when finished", () => {
    const { wrapper } = mountPanel(RACE_STATUS.FINISHED);
    expect(wrapper.find('[data-testid="btn-reset"]').exists()).toBe(true);
  });
});
