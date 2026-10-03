import { describe, expect, it } from "vitest";

import {
  formatAmountInput,
  formatDeduction,
  formatMoney,
  formatPercent,
  formatWholeMoney,
  parseAmount,
  parseHours,
} from "./format";

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
