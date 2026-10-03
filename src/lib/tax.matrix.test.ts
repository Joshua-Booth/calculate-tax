// Every combination of options, tax codes, periods and KiwiSaver rates, across the incomes
// where a rule changes, checked against rules that must always hold.
import { describe, expect, it } from "vitest";

import type { Inputs, Period, SecondaryCode } from "./tax";
import {
  ACC_LEVY,
  accLevy,
  calculate,
  cents,
  IETC,
  incomeTax,
  independentEarnerTaxCredit,
  KIWISAVER_DEFAULT,
  KIWISAVER_RATES,
  PERIODS,
  perPeriod,
  SECONDARY_CODE_OPTIONS,
  SECONDARY_CODES,
  studentLoanRepayment,
  taxCode,
  toAnnual,
} from "./tax";

const BOUNDARIES = [
  0, 0.01, 15_600, 15_601, 24_000, 24_127.99, 24_128, 24_129, 53_500, 53_501,
  66_000, 66_001, 70_000, 70_001, 78_100, 78_101, 156_641, 156_642, 180_000,
  180_001, 1_000_000,
];
const BOOLS = [false, true];
const HOURS = 40;

type Options = Omit<Inputs, "income" | "period" | "hoursPerWeek">;

// Every combination of the values on each axis, as one object per combination
function cartesian<T extends Record<string, readonly unknown[]>>(
  axes: T
): { [K in keyof T]: T[K][number] }[] {
  let rows: Record<string, unknown>[] = [{}];
  for (const [key, values] of Object.entries(axes))
    rows = rows.flatMap((row) => values.map((v) => ({ ...row, [key]: v })));
  return rows as { [K in keyof T]: T[K][number] }[];
}

const CODES: SecondaryCode[] = SECONDARY_CODE_OPTIONS.map((o) => o.code);
const RATES: number[] = KIWISAVER_RATES.map((k) => k.rate);

// Every on/off mix of the five tiles, each secondary code when it's a second job,
// and each KiwiSaver rate when KiwiSaver is on
const OPTIONS: Options[] = cartesian({
  acc: BOOLS,
  kiwiSaver: BOOLS,
  secondary: BOOLS,
  studentLoan: BOOLS,
  taxCredits: BOOLS,
}).flatMap((base) =>
  cartesian({
    secondaryCode: base.secondary ? CODES : (["S"] as SecondaryCode[]),
    kiwiSaverRate: base.kiwiSaver ? RATES : [KIWISAVER_DEFAULT],
  }).map((extra) => ({ ...base, ...extra }))
);

const CASES: Inputs[] = OPTIONS.flatMap((options) =>
  BOUNDARIES.flatMap((annual) =>
    PERIODS.map((period: Period) => ({
      ...options,
      period,
      hoursPerWeek: HOURS,
      income: annual / toAnnual(1, period, HOURS),
    }))
  )
);

function expectedCodePrefix(inputs: Inputs, taxCredit: number) {
  if (inputs.secondary) return inputs.secondaryCode;
  return taxCredit > 0 ? "ME" : "M";
}

function checkCase(inputs: Inputs) {
  const b = calculate(inputs);

  // Each line follows its own rule, and options that are off add nothing
  expect({
    incomeTax: b.incomeTax,
    acc: b.acc,
    kiwiSaver: b.kiwiSaver,
    studentLoan: b.studentLoan,
    taxCredit: b.taxCredit,
  }).toEqual({
    incomeTax: cents(
      inputs.secondary
        ? b.gross * SECONDARY_CODES[inputs.secondaryCode]
        : incomeTax(b.gross)
    ),
    acc: inputs.acc ? cents(accLevy(b.gross)) : 0,
    kiwiSaver: inputs.kiwiSaver ? cents(b.gross * inputs.kiwiSaverRate) : 0,
    studentLoan: inputs.studentLoan
      ? cents(studentLoanRepayment(b.gross, inputs.secondary))
      : 0,
    taxCredit:
      inputs.taxCredits && !inputs.secondary
        ? cents(independentEarnerTaxCredit(b.gross))
        : 0,
  });

  // Nothing is negative, take-home adds up, and caps hold
  expect(
    Math.min(
      b.gross,
      b.incomeTax,
      b.acc,
      b.kiwiSaver,
      b.studentLoan,
      b.taxCredit,
      b.takeHome
    )
  ).toBeGreaterThanOrEqual(0);
  expect(b.takeHome).toBe(
    cents(
      b.gross - b.incomeTax - b.acc - b.kiwiSaver - b.studentLoan + b.taxCredit
    )
  );
  expect(b.takeHome).toBeLessThanOrEqual(b.gross + IETC.amount);
  expect(b.acc).toBeLessThanOrEqual(
    cents(ACC_LEVY.maxEarnings * ACC_LEVY.rate)
  );

  // The tax code matches the options
  const code = taxCode(inputs, b.gross);
  expect(code).toMatch(/^(M|ME|SB|S|SH|ST|SA)( SL)?$/);
  expect(code.endsWith(" SL")).toBe(inputs.studentLoan);
  expect(code.split(" ")[0]).toBe(expectedCodePrefix(inputs, b.taxCredit));

  // Every period's rows add up to its take-home pay
  for (const shown of PERIODS) {
    const p = perPeriod(b, shown, HOURS);
    expect(p.takeHome).toBe(
      cents(
        p.gross -
          p.incomeTax -
          p.acc -
          p.kiwiSaver -
          p.studentLoan +
          p.taxCredit
      )
    );
  }
}

describe("every combination at every boundary", () => {
  it("covers over 10,000 cases", () => {
    expect(CASES.length).toBeGreaterThan(10_000);
  });

  it("keeps every breakdown consistent", () => {
    let checked = 0;
    for (const inputs of CASES) {
      checkCase(inputs);
      checked++;
    }
    expect(checked).toBe(CASES.length);
  });
});

describe("income tax", () => {
  it("is exact at each band edge", () => {
    expect(incomeTax(53_500)).toBeCloseTo(8_270.5, 2);
    expect(incomeTax(78_100)).toBeCloseTo(15_650.5, 2);
    expect(incomeTax(180_000)).toBeCloseTo(49_277.5, 2);
  });

  it("never goes down as income goes up, and the top rate is 39%", () => {
    for (let income = 250; income <= 250_000; income += 250) {
      const step = incomeTax(income) - incomeTax(income - 250);
      expect(step).toBeGreaterThanOrEqual(0);
      expect(step).toBeLessThanOrEqual(250 * 0.39 + 1e-9);
    }
  });
});

describe("secondary codes", () => {
  it("covers every band without gaps", () => {
    expect(SECONDARY_CODE_OPTIONS.map((o) => [o.code, o.from, o.upTo])).toEqual(
      [
        ["SB", 0, 15_600],
        ["S", 15_601, 53_500],
        ["SH", 53_501, 78_100],
        ["ST", 78_101, 180_000],
        ["SA", 180_001, Infinity],
      ]
    );
  });
});

describe("periods", () => {
  it("converts hours, weeks, fortnights and months to a year", () => {
    expect(toAnnual(30, "hour", 37.5)).toBe(58_500);
    expect(toAnnual(1_500, "week", 40)).toBe(78_000);
    expect(toAnnual(3_000, "fortnight", 40)).toBe(78_000);
    expect(toAnnual(7_000, "month", 40)).toBe(84_000);
    expect(toAnnual(84_000, "year", 40)).toBe(84_000);
  });

  it("round-trips a year through each period", () => {
    const b = calculate({
      income: 72_345.67,
      period: "year",
      hoursPerWeek: 37.5,
      acc: true,
      kiwiSaver: true,
      kiwiSaverRate: 0.04,
      secondary: false,
      secondaryCode: "S",
      studentLoan: true,
      taxCredits: false,
    });
    const month = perPeriod(b, "month", 37.5);
    expect(Math.abs(month.gross * 12 - b.gross)).toBeLessThan(0.07);
    const hour = perPeriod(b, "hour", 37.5);
    expect(hour.gross).toBe(cents(72_345.67 / (52 * 37.5)));
  });
});
