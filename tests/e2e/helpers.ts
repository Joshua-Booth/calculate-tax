import type { Page } from "@playwright/test";

import { expect } from "@playwright/test";

export const DESKTOP_MIN = 1200;

type Tile =
  | "ACC levy"
  | "KiwiSaver"
  | "Secondary income"
  | "Student loan"
  | "Tax credits";

/** Whether the page is showing the two-pane desktop layout. */
export function isDesktop(page: Page) {
  return (page.viewportSize()?.width ?? 0) >= DESKTOP_MIN;
}

export async function setIncome(page: Page, value: string) {
  const input = page.getByRole("textbox", { name: "Income" });
  await input.fill(value);
}

/** Turns an option tile on or off. The checkbox is visually hidden, so click its tile. */
export async function setTile(page: Page, name: Tile, on: boolean) {
  const box = page.getByRole("checkbox", { name });
  if ((await box.isChecked()) !== on)
    await page.locator("label", { has: box }).click();
  await expect(box).toBeChecked({ checked: on });
}

export async function pickPeriod(
  page: Page,
  group: "Income is per" | "Show amounts per",
  label: string
) {
  const fieldset = page.getByRole("group", { name: group });
  // The radio is visually hidden, so click the label that shows it
  await fieldset.locator("label").filter({ hasText: label }).click();
  await expect(fieldset.getByRole("radio", { name: label })).toBeChecked();
}

/** On a phone or tablet, results live on their own tab. */
export async function showResults(page: Page) {
  if (!isDesktop(page))
    await page.getByRole("button", { name: "Calculate" }).click();
  await expect(page.getByTestId("take-home")).toBeVisible();
}

export async function showDetails(page: Page) {
  if (!isDesktop(page))
    await page.getByRole("tab", { name: "Details" }).click();
  await expect(page.getByRole("textbox", { name: "Income" })).toBeVisible();
}

export async function openSettings(page: Page) {
  await page.getByRole("button", { name: /settings/i }).click();
  await expect(
    page.getByRole("dialog", { name: "Advanced settings" })
  ).toBeVisible();
}

export async function closeSettings(page: Page) {
  await page.getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
}

/** Reads one row of the breakdown, such as "Income tax". */
export function row(page: Page, key: string) {
  return page.locator(`[data-row="${key}"] dd`);
}
