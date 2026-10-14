import { describe, expect, it } from "vitest";

import type { Inputs } from "./tax";
import {
  companion,
  formatAmountInput,
  formatDeduction,
  formatMoney,
  formatPercent,
  formatWholeMoney,
  parseAmount,
  parseHours,
  PERIOD_OPTIONS,
  settingsSummary,
} from "./format";
import { calculate } from "./tax";

describe("formatting", () => {
  it("shows dollars and cents", () => {
    expect(formatMoney(55_305.36)).toBe("$55,305.36");
    expect(formatMoney(0)).toBe("$0.00");
  });

  it("rounds to whole dollars", () => {
    expect(formatWholeMoney(1_063.57)).toBe("$1,064");
  });

  it("shows rates as percentages", () => {
    expect(formatPercent(0.035)).toBe("3.5%");
    expect(formatPercent(0.0175)).toBe("1.75%");
    expect(formatPercent(0.12)).toBe("12%");
  });

  it("shows deductions with a true minus sign", () => {
    expect(formatDeduction(17_927.5)).toBe("−$17,927.50");
    expect(formatDeduction(0)).toBe("$0.00");
  });
});

describe("formatAmountInput", () => {
  it("adds thousands separators and shows cents as two digits", () => {
    expect(formatAmountInput(85_000)).toBe("85,000");
    expect(formatAmountInput(85_000.5)).toBe("85,000.50");
    expect(formatAmountInput(40.25)).toBe("40.25");
    expect(formatAmountInput(1_234_567.891)).toBe("1,234,567.89");
  });
});

describe("parseHours", () => {
  it.each([
    ["40", 40],
    ["37.5", 37.5],
    ["1", 1],
    ["168", 168],
    ["0", null],
    ["169", null],
    ["-5", null],
    ["", null],
    [" ", null],
    ["abc", null],
  ])("reads %j as %j", (text, expected) => {
    expect(parseHours(text)).toBe(expected);
  });
});

describe("parseAmount", () => {
  it.each([
    ["85000", 85_000],
    ["85,000", 85_000],
    ["$85,000.50", 85_000.5],
    [" 40 ", 40],
    [".5", 0.5],
    ["1.2.3", 1.2],
    ["", 0],
    [".", 0],
    ["abc", 0],
    ["-500", 500],
  ])("reads %j as %d", (text, expected) => {
    expect(parseAmount(text)).toBe(expected);
  });
});

describe("period labels", () => {
  it("lists every period in order", () => {
    expect(PERIOD_OPTIONS.map((o) => o.label)).toEqual([
      "Hour",
      "Week",
      "Fortnight",
      "Month",
      "Year",
    ]);
  });
});

describe("companion figure", () => {
  // $85,000 a year on M SL with KiwiSaver at 3.5%: $55,305.36 a year, $1,063.57 a week
  const annual = calculate({
    income: 85_000,
    period: "year",
    hoursPerWeek: 40,
    acc: true,
    kiwiSaver: true,
    kiwiSaverRate: 0.035,
    secondary: false,
    secondaryCode: "S",
    studentLoan: true,
    taxCredits: false,
  });

  it("gives a week beside a year or a month", () => {
    expect(companion(annual, "year", 40)).toBe("about $1,064 a week");
    expect(companion(annual, "month", 40)).toBe("about $1,064 a week");
  });

  it("gives a year beside a fortnight, a week or an hour", () => {
    expect(companion(annual, "fortnight", 40)).toBe("about $55,305 a year");
    expect(companion(annual, "week", 40)).toBe("about $55,305 a year");
    expect(companion(annual, "hour", 40)).toBe("about $55,305 a year");
  });
});

describe("settings summary", () => {
  const settings: Pick<
    Inputs,
    | "hoursPerWeek"
    | "kiwiSaver"
    | "kiwiSaverRate"
    | "secondary"
    | "secondaryCode"
  > = {
    hoursPerWeek: 40,
    kiwiSaver: false,
    kiwiSaverRate: 0.035,
    secondary: false,
    secondaryCode: "SH",
  };

  it("always shows the hours", () => {
    expect(settingsSummary(settings)).toBe("40 hours a week");
  });

  it("adds KiwiSaver and the secondary code when they're on", () => {
    expect(
      settingsSummary({ ...settings, kiwiSaver: true, secondary: true })
    ).toBe("KiwiSaver 3.5% · Code SH · 40 hours a week");
  });
});
