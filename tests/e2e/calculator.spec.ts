// What someone does with the calculator, in each browser project:
// desktop Chrome and Firefox, and Chrome and Safari on phones.
import type { Page } from "@playwright/test";

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import {
  closeSettings,
  isDesktop,
  openSettings,
  pickPeriod,
  row,
  setIncome,
  setTile,
  showDetails,
  showResults,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("first load", () => {
  test("shows the 2020 defaults: ACC on, code M, no results yet", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "Tax Calculator", level: 1 })
    ).toBeVisible();
    await expect(
      page.getByRole("checkbox", { name: "ACC levy" })
    ).toBeChecked();
    for (const name of [
      "KiwiSaver",
      "Secondary income",
      "Student loan",
      "Tax credits",
    ])
      await expect(page.getByRole("checkbox", { name })).not.toBeChecked();
    await expect(page.getByTestId("tax-code")).toHaveText("M");
    await showResults(page);
    await expect(page.getByTestId("per-period")).toHaveText(
      "Enter your income to see your take-home pay."
    );
    await expect(page.getByTestId("breakdown")).toHaveCount(0);
  });

  test("credits me in the footer and links to my site", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await expect(footer).toContainText(
      `© ${new Date().getFullYear()} Designed and built by Joshua Booth`
    );
    await expect(
      footer.getByRole("link", { name: "Joshua Booth" })
    ).toHaveAttribute("href", "https://joshuabooth.nz");
  });
});

test.describe("the worked example", () => {
  test("$85,000 a year with KiwiSaver and a student loan takes home $55,305.36", async ({
    page,
  }) => {
    await setIncome(page, "85000");
    await setTile(page, "KiwiSaver", true);
    await setTile(page, "Student loan", true);
    await expect(page.getByTestId("tax-code")).toHaveText("M SL");
    await showResults(page);
    await expect(page.getByTestId("take-home")).toHaveText("$55,305.36");
    await expect(page.getByTestId("per-period")).toHaveText(
      "a year · about $1,064 a week"
    );
    await expect(row(page, "gross")).toHaveText("$85,000.00");
    await expect(row(page, "tax")).toHaveText("−$17,927.50");
    await expect(row(page, "acc")).toHaveText("−$1,487.50");
    await expect(row(page, "kiwisaver")).toHaveText("−$2,975.00");
    await expect(row(page, "student-loan")).toHaveText("−$7,304.64");
    await expect(row(page, "take-home")).toHaveText("$55,305.36");
  });

  test("shows the same pay per week, fortnight, month and hour", async ({
    page,
  }) => {
    await setIncome(page, "85000");
    await setTile(page, "KiwiSaver", true);
    await setTile(page, "Student loan", true);
    await showResults(page);
    const expected: [string, string, string][] = [
      ["Week", "$1,063.57", "a week · about $55,305 a year"],
      ["Fortnight", "$2,127.13", "a fortnight · about $55,305 a year"],
      // Each line rounds to the cent first, so the rows add up: $7,083.33 less
      // $1,493.96, $123.96, $247.92 and $608.72 is $4,608.77 (not $55,305.36 / 12)
      ["Month", "$4,608.77", "a month · about $1,064 a week"],
      ["Hour", "$26.59", "an hour · about $55,305 a year"],
    ];
    for (const [period, amount, line] of expected) {
      await pickPeriod(page, "Show amounts per", period);
      await expect(page.getByTestId("take-home")).toHaveText(amount);
      await expect(page.getByTestId("per-period")).toHaveText(line);
    }
  });
});

test.describe("tax codes", () => {
  test("M with no options, M SL with a student loan", async ({ page }) => {
    await setIncome(page, "60000");
    await expect(page.getByTestId("tax-code")).toHaveText("M");
    await setTile(page, "Student loan", true);
    await expect(page.getByTestId("tax-code")).toHaveText("M SL");
  });

  test("ME when the tax credit applies, and only from $24,000 to $70,000", async ({
    page,
  }) => {
    await setTile(page, "Tax credits", true);
    const cases: [string, string, string][] = [
      ["23999", "M", "$0.00"],
      ["24000", "ME", "+$520.00"],
      ["66000", "ME", "+$520.00"],
      ["68000", "ME", "+$260.00"],
      // At $70,000 the credit has abated to nothing, so the code goes back to M
      ["70000", "M", "$0.00"],
      ["70001", "M", "$0.00"],
    ];
    for (const [income, code, credit] of cases) {
      await showDetails(page);
      await setIncome(page, income);
      await expect(page.getByTestId("tax-code")).toHaveText(code);
      await showResults(page);
      await expect(row(page, "tax-credit")).toHaveText(credit);
    }
  });

  test("ME SL with the tax credit and a student loan", async ({ page }) => {
    await setIncome(page, "50000");
    await setTile(page, "Tax credits", true);
    await setTile(page, "Student loan", true);
    await expect(page.getByTestId("tax-code")).toHaveText("ME SL");
  });

  test("every secondary code, with and without a student loan", async ({
    page,
  }) => {
    await setIncome(page, "20000");
    await setTile(page, "Secondary income", true);
    await expect(page.getByTestId("tax-code")).toHaveText("S");
    const codes: [string, string][] = [
      ["SB", "−$2,100.00"],
      ["S", "−$3,500.00"],
      ["SH", "−$6,000.00"],
      ["ST", "−$6,600.00"],
      ["SA", "−$7,800.00"],
    ];
    for (const [code, tax] of codes) {
      await showDetails(page);
      await openSettings(page);
      await page
        .getByRole("combobox", { name: "Secondary tax code" })
        .selectOption(code);
      await closeSettings(page);
      await expect(page.getByTestId("tax-code")).toHaveText(code);
      await setTile(page, "Student loan", true);
      await expect(page.getByTestId("tax-code")).toHaveText(`${code} SL`);
      await showResults(page);
      await expect(row(page, "tax")).toHaveText(tax);
      // A second job repays 12% of every dollar, with no threshold
      await expect(row(page, "student-loan")).toHaveText("−$2,400.00");
      await showDetails(page);
      await setTile(page, "Student loan", false);
    }
  });

  test("a second job never gets the tax credit", async ({ page }) => {
    await setIncome(page, "40000");
    await setTile(page, "Secondary income", true);
    await setTile(page, "Tax credits", true);
    await expect(page.getByTestId("tax-code")).toHaveText("S");
    await showResults(page);
    await expect(
      page.locator('[data-row="tax-credit"]').getByText("Not for a second job")
    ).toBeVisible();
    await expect(row(page, "tax-credit")).toHaveText("$0.00");
  });

  test("explains the codes in a popover", async ({ page }) => {
    await page
      .getByRole("button", { name: "What does my tax code mean?" })
      .click();
    const help = page.getByRole("heading", { name: "Your tax code" });
    await expect(help).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(help).toBeHidden();
  });
});

test.describe("pay periods and settings", () => {
  test("hourly pay uses the hours a week from settings", async ({ page }) => {
    await pickPeriod(page, "Income is per", "Hour");
    await setIncome(page, "40");
    await openSettings(page);
    await page.getByRole("spinbutton", { name: "Hours a week" }).fill("37.5");
    await closeSettings(page);
    await expect(page.getByText("37.5 hours a week")).toBeVisible();
    await showResults(page);
    await expect(row(page, "gross")).toHaveText("$40.00");
    await pickPeriod(page, "Show amounts per", "Year");
    await expect(row(page, "gross")).toHaveText("$78,000.00");
  });

  test("fortnightly pay turns into a year of 26 pays", async ({ page }) => {
    await pickPeriod(page, "Income is per", "Fortnight");
    await setIncome(page, "3000");
    await showResults(page);
    await expect(row(page, "gross")).toHaveText("$3,000.00");
    await pickPeriod(page, "Show amounts per", "Year");
    await expect(row(page, "gross")).toHaveText("$78,000.00");
  });

  test("hours outside 1 to 168 explain themselves and fall back to 40", async ({
    page,
  }) => {
    await openSettings(page);
    const hours = page.getByRole("spinbutton", { name: "Hours a week" });
    for (const bad of ["0", "169", ""]) {
      await hours.fill(bad);
      await expect(hours).toHaveAttribute("aria-invalid", "true");
      await expect(
        page.getByText("Enter between 1 and 168 hours. Until then it uses 40.")
      ).toBeVisible();
    }
    await hours.fill("38");
    await expect(hours).toHaveAttribute("aria-invalid", "false");
    await hours.fill("0");
    // Done still closes: the sums carry on with a 40-hour week
    await closeSettings(page);
    await expect(page.getByText("40 hours a week")).toBeVisible();
  });

  test("a KiwiSaver rate change shows in the summary and the breakdown", async ({
    page,
  }) => {
    await setIncome(page, "70000");
    await setTile(page, "KiwiSaver", true);
    await openSettings(page);
    await page
      .getByRole("combobox", { name: "KiwiSaver contribution" })
      .selectOption("0.06");
    await closeSettings(page);
    await expect(page.getByText("KiwiSaver 6%")).toBeVisible();
    await showResults(page);
    await expect(row(page, "kiwisaver")).toHaveText("−$4,200.00");
  });

  test("the settings dialog closes with Escape and keeps changes", async ({
    page,
  }) => {
    await openSettings(page);
    await page
      .getByRole("combobox", { name: "KiwiSaver contribution" })
      .selectOption("0.04");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await setTile(page, "KiwiSaver", true);
    await expect(page.getByText("KiwiSaver 4%")).toBeVisible();
  });
});

test.describe("the income field", () => {
  test("ignores letters and tidies the number when you leave it", async ({
    page,
  }) => {
    const input = page.getByRole("textbox", { name: "Income" });
    await input.fill("abc$85,000.5xyz");
    await expect(input).toHaveValue("85,000.5");
    await input.blur();
    await expect(input).toHaveValue("85,000.50");
  });

  test("handles a very large income without breaking the layout", async ({
    page,
  }) => {
    await setIncome(page, "12345678.90");
    await showResults(page);
    await expect(page.getByTestId("take-home")).toBeVisible();
    const fits = await page
      .getByTestId("take-home")
      .evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
    expect(fits).toBe(true);
  });
});

test.describe("mobile flow", () => {
  test("Calculate moves to Results and focuses its heading", async ({
    page,
  }) => {
    test.skip(isDesktop(page), "Desktop shows both panes at once");
    await setIncome(page, "52000");
    await page.getByRole("button", { name: "Calculate" }).click();
    await expect(page.getByRole("tab", { name: "Results" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(
      page.getByRole("heading", { name: "Your take-home pay" })
    ).toBeFocused();
    await page.getByRole("tab", { name: "Details" }).click();
    // Leaving the field tidies the number
    await expect(page.getByRole("textbox", { name: "Income" })).toHaveValue(
      "52,000"
    );
  });

  test("desktop shows Details and Results together with no tabs", async ({
    page,
  }) => {
    test.skip(!isDesktop(page), "Phones and tablets use tabs");
    await expect(page.getByRole("tablist")).toBeHidden();
    await expect(page.getByRole("button", { name: "Calculate" })).toBeHidden();
    await setIncome(page, "52000");
    await expect(page.getByTestId("take-home")).toBeVisible();
  });
});

test.describe("keyboard", () => {
  test("periods change with the arrow keys and tiles with Space", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit",
      "Safari doesn't tab to form controls by default"
    );
    const year = page
      .getByRole("group", { name: "Income is per" })
      .getByRole("radio", { name: "Year" });
    await year.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(
      page
        .getByRole("group", { name: "Income is per" })
        .getByRole("radio", { name: "Month" })
    ).toBeChecked();
    const kiwiSaver = page.getByRole("checkbox", { name: "KiwiSaver" });
    await kiwiSaver.focus();
    await page.keyboard.press("Space");
    await expect(kiwiSaver).toBeChecked();
  });
});

test.describe("accessibility", () => {
  // Scan settled colours, not a tile halfway through its colour change
  test.use({ reducedMotion: "reduce" });

  const scan = (page: Page) =>
    new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

  test("details have no WCAG AA violations", async ({ page }) => {
    await setIncome(page, "85000");
    await setTile(page, "Student loan", true);
    expect((await scan(page)).violations).toEqual([]);
  });

  test("results have no WCAG AA violations", async ({ page }) => {
    await setIncome(page, "85000");
    await setTile(page, "Tax credits", true);
    await showResults(page);
    expect((await scan(page)).violations).toEqual([]);
  });

  test("the settings dialog has no WCAG AA violations", async ({ page }) => {
    await openSettings(page);
    expect((await scan(page)).violations).toEqual([]);
  });
});
