import { expect, test, type Locator, type Page } from "@playwright/test"
import { base64Encode } from "@opencode/util/encode"
import { fixture, pageMessages } from "./session-timeline.fixture"
import { trackPageErrors, expectNoSmokeErrors } from "../utils/errors"
import { mockOpenCodeServer } from "../utils/mock-server"
import { expectSessionTitle } from "../utils/waits"

async function waitForScrollSettled(scroller: Locator) {
  await scroller.evaluate(
    (element) =>
      new Promise<void>((resolve) => {
        let last = -1
        let stable = 0
        const check = () => {
          const top = element.scrollTop
          stable = top === last ? stable + 1 : 0
          last = top
          if (stable >= 3) resolve()
          else requestAnimationFrame(check)
        }
        check()
      }),
  )
}

async function waitForScrollHeightSettled(scroller: Locator) {
  await scroller.evaluate(
    (element) =>
      new Promise<void>((resolve) => {
        let last = -1
        let stable = 0
        const check = () => {
          const height = element.scrollHeight
          stable = height === last ? stable + 1 : 0
          last = height
          if (stable >= 5) resolve()
          else requestAnimationFrame(check)
        }
        check()
      }),
  )
}

async function nearestPromptId(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const scroller = [...document.querySelectorAll<HTMLElement>(".scroll-view__viewport")].find((element) =>
      element.querySelector("[data-timeline-row]"),
    )
    if (!scroller) return null
    const view = scroller.getBoundingClientRect()
    let best: string | null = null
    let bestDistance = Number.POSITIVE_INFINITY
    for (const element of scroller.querySelectorAll<HTMLElement>('[data-timeline-row="UserMessage"]')) {
      const id = element.dataset.messageId
      if (!id) continue
      const distance = Math.abs(element.getBoundingClientRect().top - view.top)
      if (distance < bestDistance) {
        bestDistance = distance
        best = id
      }
    }
    return best
  })
}

async function expectNearestPromptId(page: Page, timeout = 10_000): Promise<string> {
  let id: string | null = null
  await expect
    .poll(
      async () => {
        id = await nearestPromptId(page)
        return id
      },
      { timeout },
    )
    .not.toBeNull()
  if (id === null) throw new Error("no prompt rendered")
  return id
}

function timelineScroller(page: Page) {
  return page.locator(".scroll-view__viewport", { has: page.locator("[data-timeline-row]") })
}

async function navigateToSession(page: Page, sessionId: string, expectedTitle: string) {
  await page.goto(`/server/${base64Encode(fixture.serverKey)}/session/${sessionId}`)
  await expectSessionTitle(page, expectedTitle)
}

test.describe("smoke: session turn ux", () => {
  test.setTimeout(240_000)

  test("shows turn stats, collapses completed turns, and exposes jump buttons", async ({ page }) => {
    const errors = trackPageErrors(page)
    await mockOpenCodeServer(page, {
      sessions: fixture.sessions,
      provider: fixture.provider,
      directory: fixture.directory,
      project: fixture.project,
      pageMessages,
    })
    await page.addInitScript(() => {
      localStorage.setItem(
        "settings.v3",
        JSON.stringify({
          general: {
            editToolPartsExpanded: true,
            shellToolPartsExpanded: true,
            showReasoningSummaries: true,
            timelineDetail: {
              shell: { placement: "separate", details: "expanded" },
              edit: { placement: "grouped", details: "collapsed" },
              thinking: { placement: "grouped", details: "collapsed" },
              subagents: { placement: "grouped" },
              notices: { placement: "grouped" },
              tools: { placement: "grouped" },
            },
          },
        }),
      )
    })
    await navigateToSession(page, fixture.targetID, fixture.expected.targetTitle)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(
      () => document.querySelectorAll('[data-component="markdown"]:not([data-markdown-ready])').length === 0,
    )

    const jumpUp = page.getByRole("button", { name: "Jump to previous prompt" })
    const jumpDown = page.getByRole("button", { name: "Jump to next turn end" })
    await expect(jumpUp).toBeVisible()
    await expect(jumpDown).toBeVisible()

    const meta = page.locator('[data-slot="text-part-meta"]', { hasText: "300 tokens" }).first()
    await expect(meta).toBeVisible()
    await expect(meta).toContainText("cache 0%")

    await expect(page.locator('[data-slot="turn-summary"]').first()).toBeVisible()
    await expect(page.locator('[data-slot="turn-summary"]').first()).toContainText("Worked for")
    await expect(page.locator('[data-slot="accordion-trigger"]')).toHaveCount(0)
    await expect(page.locator('[data-slot="context-tool-group-item"]')).toHaveCount(0)
    await page.locator('[data-slot="turn-summary"]').first().click()
    await expect
      .poll(
        async () =>
          page.locator('[data-slot="accordion-trigger"], [data-slot="context-tool-group-item"]').count(),
        { timeout: 10_000 },
      )
      .toBeGreaterThan(0)

    await expectNoSmokeErrors(errors, [], [])
  })

  test("jump buttons move between prompt starts and turn ends", async ({ page }) => {
    const errors = trackPageErrors(page)
    await mockOpenCodeServer(page, {
      sessions: fixture.sessions,
      provider: fixture.provider,
      directory: fixture.directory,
      project: fixture.project,
      pageMessages,
    })
    await navigateToSession(page, fixture.targetID, fixture.expected.targetTitle)

    const scroller = timelineScroller(page)
    const jumpUp = page.getByRole("button", { name: "Jump to previous prompt" })
    const jumpDown = page.getByRole("button", { name: "Jump to next turn end" })
    await expect(jumpUp).toBeVisible()
    await expect(jumpDown).toBeVisible()

    await waitForScrollHeightSettled(scroller)
    await expect(jumpDown).toBeDisabled()
    await expect(jumpUp).toBeEnabled()
    const bottomPrompt = await expectNearestPromptId(page)
    await jumpUp.click()
    await waitForScrollSettled(scroller)
    const upperPrompt = await expectNearestPromptId(page)
    expect(upperPrompt <= bottomPrompt).toBe(true)

    await jumpUp.click()
    await waitForScrollSettled(scroller)
    const upperPrompt2 = await expectNearestPromptId(page)
    expect(upperPrompt2 < upperPrompt).toBe(true)

    await jumpUp.click()
    await waitForScrollSettled(scroller)
    const upperPrompt3 = await expectNearestPromptId(page)
    expect(upperPrompt3 < upperPrompt2).toBe(true)

    await expect(jumpDown).toBeEnabled()
    await jumpDown.click()
    await waitForScrollSettled(scroller)
    const lowerPrompt = await expectNearestPromptId(page)
    expect(lowerPrompt >= upperPrompt3).toBe(true)

    await jumpDown.click()
    await waitForScrollSettled(scroller)
    const lowerPrompt2 = await expectNearestPromptId(page)
    expect(lowerPrompt2 > lowerPrompt).toBe(true)

    await expectNoSmokeErrors(errors, [], [])
  })
})
