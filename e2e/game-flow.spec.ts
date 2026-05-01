import { test, expect } from "@playwright/test"

test.describe("Horse Racing — initial state", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("control panel is visible on load", async ({ page }) => {
    await expect(page.getByTestId("control-panel")).toBeVisible()
  })

  test("status badge shows idle on load", async ({ page }) => {
    await expect(page.getByTestId("status-badge")).toContainText("idle")
  })

  test("generate button is enabled on load", async ({ page }) => {
    await expect(page.getByTestId("btn-generate")).toBeEnabled()
  })

  test("start button is disabled on load", async ({ page }) => {
    await expect(page.getByTestId("btn-start")).toBeDisabled()
  })

  test("horse list shows empty state on load", async ({ page }) => {
    await expect(page.getByTestId("horse-list-empty")).toBeVisible()
  })

  test("results panel shows empty state on load", async ({ page }) => {
    await expect(page.getByTestId("results-empty")).toBeVisible()
  })
})

test.describe("Horse Racing — generate program", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.getByTestId("btn-generate").click()
  })

  test("horses are displayed after generating", async ({ page }) => {
    await expect(page.getByTestId("horse-grid")).toBeVisible()
  })

  test("status changes to scheduled after generating", async ({ page }) => {
    await expect(page.getByTestId("status-badge")).toContainText("scheduled")
  })

  test("start button becomes enabled after generating", async ({ page }) => {
    await expect(page.getByTestId("btn-start")).toBeEnabled()
  })

  test("generate button becomes disabled after generating", async ({ page }) => {
    await expect(page.getByTestId("btn-generate")).toBeDisabled()
  })

  test("20 horse cards are rendered", async ({ page }) => {
    const cards = page.getByTestId("horse-card")
    await expect(cards).toHaveCount(20)
  })
})

test.describe("Horse Racing — start race", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.getByTestId("btn-generate").click()
    await expect(page.getByTestId("btn-start")).toBeEnabled()
    await page.getByTestId("btn-start").click()
  })

  test("status changes to running after starting", async ({ page }) => {
    await expect(page.getByTestId("status-badge")).toContainText("running")
  })

  test("race track is visible during the race", async ({ page }) => {
    await expect(page.getByTestId("race-track")).toBeVisible()
  })

  test("race lanes are rendered for each competing horse", async ({ page }) => {
    const lanes = page.getByTestId("race-lane")
    await expect(lanes).toHaveCount(10)
  })
})

test.describe("Horse Racing — full race flow", () => {
  test("completes all 6 rounds and shows results", async ({ page }) => {
    test.setTimeout(120_000)

    await page.goto("/")
    await page.getByTestId("btn-generate").click()
    await expect(page.getByTestId("btn-start")).toBeEnabled()
    await page.getByTestId("btn-start").click()

    // Wait for the race to finish (all 6 rounds complete)
    await expect(page.getByTestId("status-badge")).toContainText("finished", {
      timeout: 90_000,
    })

    // Reset button should appear
    await expect(page.getByTestId("btn-reset")).toBeVisible()

    // 6 round results should be displayed
    await expect(page.getByTestId("round-result")).toHaveCount(6)
  })

  test("new race can be started after finishing", async ({ page }) => {
    test.setTimeout(120_000)

    await page.goto("/")
    await page.getByTestId("btn-generate").click()
    await page.getByTestId("btn-start").click()
    await expect(page.getByTestId("status-badge")).toContainText("finished", {
      timeout: 90_000,
    })

    await page.getByTestId("btn-reset").click()

    await expect(page.getByTestId("status-badge")).toContainText("idle")
    await expect(page.getByTestId("btn-generate")).toBeEnabled()
    await expect(page.getByTestId("horse-list-empty")).toBeVisible()
  })
})
