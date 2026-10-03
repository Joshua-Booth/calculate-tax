// A sweep of screen widths from a small phone to a large desktop, with both sides of
// every breakpoint (360, 380, 540, 640 and 1200). At each width the page is filled with
// the longest content it can show, then checked for sideways scrolling, anything off
// screen, clipped text, overlapping rows, small tap targets and the right layout.
// Runs in desktop Chrome and Firefox; the phone projects check their own screens in
// calculator.spec.ts.
import type { Page } from "@playwright/test";

import { expect, test } from "@playwright/test";

import {
  DESKTOP_MIN,
  openSettings,
  setIncome,
  setTile,
  showResults,
} from "./helpers";

const WIDTHS = [
  320, 340, 349, 350, 360, 375, 379, 380, 390, 414, 430, 480, 539, 540, 600,
  639, 640, 700, 768, 834, 1024, 1180, 1199, 1200, 1280, 1440, 1680, 1920,
];

interface Problem {
  kind: string;
  what: string;
  detail: string;
}

// Runs in the page: everything visible must sit on screen, text must not be clipped,
// breakdown rows must not overlap, and controls must be at least 24px (WCAG 2.5.8)
function audit(): Problem[] {
  const problems: Problem[] = [];
  const vw = document.documentElement.clientWidth;
  const describe = (el: Element) =>
    `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""} "${(el.textContent ?? "").trim().slice(0, 30)}"`;
  const hidden = (el: Element) => {
    const s = getComputedStyle(el);
    return (
      s.display === "none" ||
      s.visibility === "hidden" ||
      el.closest(".visually-hidden, dialog:not([open]), [popover]") !== null
    );
  };

  if (document.documentElement.scrollWidth > vw)
    problems.push({
      kind: "horizontal scroll",
      what: "page",
      detail: `${document.documentElement.scrollWidth} > ${vw}`,
    });

  for (const el of document.querySelectorAll("body *")) {
    if (hidden(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.left < -0.5 || r.right > vw + 0.5)
      problems.push({
        kind: "off screen",
        what: describe(el),
        detail: `${Math.round(r.left)}–${Math.round(r.right)} of ${vw}`,
      });
    const s = getComputedStyle(el);
    const clips =
      s.overflowX === "hidden" ||
      s.overflowX === "clip" ||
      s.textOverflow === "ellipsis";
    if (
      clips &&
      el.childElementCount === 0 &&
      el.scrollWidth > el.clientWidth + 1
    )
      problems.push({
        kind: "clipped text",
        what: describe(el),
        detail: `${el.scrollWidth} > ${el.clientWidth}`,
      });
  }

  // Text that runs past its own box, like a long amount or a label that won't wrap
  for (const el of document.querySelectorAll(
    "h1, h2, p, dt, dd, label span, button, output, legend"
  )) {
    if (hidden(el)) continue;
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0)
      problems.push({
        kind: "text overflows its box",
        what: describe(el),
        detail: `${el.scrollWidth} > ${el.clientWidth}`,
      });
  }

  for (const rowEl of document.querySelectorAll("[data-row]")) {
    const label = rowEl.querySelector("dt")?.getBoundingClientRect();
    const value = rowEl.querySelector("dd")?.getBoundingClientRect();
    if (label && value && label.right > value.left + 0.5)
      problems.push({
        kind: "row overlap",
        what: rowEl.getAttribute("data-row") ?? "",
        detail: `label ends ${Math.round(label.right)}, value starts ${Math.round(value.left)}`,
      });
  }

  for (const el of document.querySelectorAll(
    "button, a, select, input:not([type=radio]):not([type=checkbox]), label:has(input[type=radio]), label:has(input[type=checkbox])"
  )) {
    if (hidden(el)) continue;
    const r = el.getBoundingClientRect();
    // Not rendered (inside a hidden pane), or a link inside a sentence, which
    // WCAG 2.5.8 exempts from the size rule
    if (r.width === 0 && r.height === 0) continue;
    if (el.tagName === "A" && getComputedStyle(el).display === "inline")
      continue;
    if (r.width < 24 || r.height < 24)
      problems.push({
        kind: "small target",
        what: describe(el),
        detail: `${Math.round(r.width)}×${Math.round(r.height)}`,
      });
  }
  return problems;
}

// The longest content: seven-figure income, every main-job option on, so the
// results show every row and the longest notes
async function fillWorstCase(page: Page) {
  await setIncome(page, "1234567.89");
  await setTile(page, "KiwiSaver", true);
  await setTile(page, "Student loan", true);
  await setTile(page, "Tax credits", true);
}

test.describe("every screen width", () => {
  // Screenshots and checks see settled colours, not a tile mid-transition
  test.use({ reducedMotion: "reduce" });

  test.skip(
    ({ isMobile }) => isMobile,
    "Phones are checked at their own size in calculator.spec.ts"
  );

  for (const width of WIDTHS) {
    test(`${width}px wide`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await fillWorstCase(page);

      const desktop = width >= DESKTOP_MIN;
      await expect(page.getByRole("tablist")).toBeVisible({
        visible: !desktop,
      });
      await expect(page.getByTestId("take-home")).toBeVisible({
        visible: desktop,
      });
      expect(await page.evaluate(audit)).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`${width}-details.png`),
        fullPage: true,
      });

      if (!desktop) {
        await showResults(page);
        expect(await page.evaluate(audit)).toEqual([]);
        await page.screenshot({
          path: testInfo.outputPath(`${width}-results.png`),
          fullPage: true,
        });
      }
    });
  }
});

test.describe("phone screens", () => {
  test.skip(({ isMobile }) => !isMobile, "Desktop widths are swept above");

  test("details and results fit the screen", async ({ page }) => {
    await page.goto("/");
    await fillWorstCase(page);
    expect(await page.evaluate(audit)).toEqual([]);
    await showResults(page);
    expect(await page.evaluate(audit)).toEqual([]);
  });
});

test.describe("option tiles", () => {
  test.use({ reducedMotion: "reduce" });

  for (const width of [320, 390, 640, 1200, 1440]) {
    test(`are all the same height at ${width}px`, async ({
      page,
      isMobile,
    }) => {
      test.skip(isMobile, "Desktop browsers set the width");
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const heights = await page
        .locator("label:has(input[type=checkbox])")
        .evaluateAll((tiles) =>
          tiles.map((t) => Math.round(t.getBoundingClientRect().height))
        );
      expect(new Set(heights).size).toBe(1);
    });
  }
});

// Runs in the page: a select clips its text without an ellipsis, and the page
// audit can't see inside one, so measure every option against the room it has
function clippedOptions() {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return ["no canvas"];
  const clipped: string[] = [];
  for (const select of document.querySelectorAll("select")) {
    const style = getComputedStyle(select);
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const room =
      select.clientWidth -
      Number.parseFloat(style.paddingLeft) -
      Number.parseFloat(style.paddingRight);
    for (const option of select.options) {
      const width = context.measureText(option.text).width;
      if (width > room)
        clipped.push(
          `"${option.text}" needs ${Math.ceil(width)}px, has ${Math.floor(room)}px`
        );
    }
  }
  return clipped;
}

test.describe("settings dropdowns", () => {
  for (const width of [320, 360, 390, 640, 1440]) {
    test(`fit every option at ${width}px`, async ({ page, isMobile }) => {
      test.skip(isMobile, "Desktop browsers set the width");
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await openSettings(page);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(clippedOptions)).toEqual([]);
    });
  }
});
