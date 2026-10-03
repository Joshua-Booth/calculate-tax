import { describe, expect, it } from "vitest";

import type { Inputs } from "./tax";
import {
  accLevy,
  calculate,
  incomeTax,
  independentEarnerTaxCredit,
  perPeriod,
  studentLoanRepayment,
  taxCode,
  toAnnual,
} from "./tax";

const base: Inputs = {
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
};

describe("income tax bands", () => {
  it("taxes the first band at 10.5%", () => {
    expect(incomeTax(15_600)).toBeCloseTo(1_638, 2);
  });
  it("steps through every band", () => {
    // 1,638 + 6,632.50 + 7,380 + 33,627 + 7,800
    expect(incomeTax(200_000)).toBeCloseTo(57_077.5, 2);
  });
  it("is zero with no income", () => {
    expect(incomeTax(0)).toBe(0);
  });
});

describe("ACC earners’ levy", () => {
  it("is 1.75% of earnings", () => {
    expect(accLevy(85_000)).toBeCloseTo(1_487.5, 2);
  });
  it("stops at the maximum liable earnings", () => {
    expect(accLevy(250_000)).toBeCloseTo(2_741.22, 2);
  });
});

describe("student loan", () => {
  it("is 12% over the threshold for a main job", () => {
    expect(studentLoanRepayment(60_000, false)).toBeCloseTo(4_304.64, 2);
  });
  it("is nothing under the threshold", () => {
    expect(studentLoanRepayment(20_000, false)).toBe(0);
  });
  it("is 12% of every dollar from a secondary job", () => {
    expect(studentLoanRepayment(10_000, true)).toBeCloseTo(1_200, 2);
  });
});

describe("independent earner tax credit", () => {
  it("pays $520 between $24,000 and $66,000", () => {
    expect(independentEarnerTaxCredit(24_000)).toBe(520);
    expect(independentEarnerTaxCredit(66_000)).toBe(520);
  });
  it("abates by 13 cents a dollar over $66,000", () => {
    expect(independentEarnerTaxCredit(68_000)).toBeCloseTo(260, 2);
  });
  it("pays nothing outside the range", () => {
    expect(independentEarnerTaxCredit(23_999)).toBe(0);
    expect(independentEarnerTaxCredit(70_001)).toBe(0);
  });
});

describe("tax code", () => {
  it("adds SL for a student loan", () => {
    expect(taxCode(base, 85_000)).toBe("M SL");
  });
  it("is ME when the tax credit applies", () => {
    expect(
      taxCode({ ...base, studentLoan: false, taxCredits: true }, 50_000)
    ).toBe("ME");
    expect(
      taxCode({ ...base, studentLoan: false, taxCredits: true }, 90_000)
    ).toBe("M");
  });
  it("uses the secondary code for a second job", () => {
    expect(
      taxCode({ ...base, secondary: true, secondaryCode: "SH" }, 30_000)
    ).toBe("SH SL");
  });
});

describe("calculate", () => {
  it("matches the worked example in the design", () => {
    expect(calculate(base)).toEqual({
      gross: 85_000,
      incomeTax: 17_927.5,
      acc: 1_487.5,
      kiwiSaver: 2_975,
      studentLoan: 7_304.64,
      taxCredit: 0,
      takeHome: 55_305.36,
    });
  });
  it("turns hourly pay into a year", () => {
    expect(toAnnual(40, "hour", 40)).toBe(83_200);
    expect(calculate({ ...base, income: 40, period: "hour" }).gross).toBe(
      83_200
    );
  });
  it("taxes a secondary job at a flat rate with no tax credit", () => {
    const b = calculate({
      ...base,
      income: 20_000,
      secondary: true,
      secondaryCode: "S",
      studentLoan: false,
      kiwiSaver: false,
      taxCredits: true,
    });
    expect(b.incomeTax).toBe(3_500);
    expect(b.taxCredit).toBe(0);
  });
  it("adds the tax credit to take-home pay", () => {
    const b = calculate({
      ...base,
      income: 50_000,
      studentLoan: false,
      kiwiSaver: false,
      acc: false,
      taxCredits: true,
    });
    expect(b.taxCredit).toBe(520);
    expect(b.takeHome).toBe(cents2(50_000 - incomeTax(50_000) + 520));
  });
  it("handles an empty income", () => {
    expect(calculate({ ...base, income: Number.NaN }).takeHome).toBe(0);
  });
});

describe("per period", () => {
  it("rounds each line and keeps the rows adding up", () => {
    const week = perPeriod(calculate(base), "week", 40);
    expect(week).toEqual({
      gross: 1_634.62,
      incomeTax: 344.76,
      acc: 28.61,
      kiwiSaver: 57.21,
      studentLoan: 140.47,
      taxCredit: 0,
      takeHome: 1_063.57,
    });
  });

  it("splits a year into 26 fortnights", () => {
    const fortnight = perPeriod(calculate(base), "fortnight", 40);
    expect(fortnight).toEqual({
      gross: 3_269.23,
      incomeTax: 689.52,
      acc: 57.21,
      kiwiSaver: 114.42,
      studentLoan: 280.95,
      taxCredit: 0,
      takeHome: 2_127.13,
    });
  });
});

function cents2(n: number) {
  return Math.round(n * 100) / 100;
}
