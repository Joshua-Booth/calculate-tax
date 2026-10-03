// New Zealand take-home pay for the 2026–27 tax year (1 April 2026 to 31 March 2027).
// Every figure comes from Inland Revenue:
// - Income tax bands: ird.govt.nz/income-tax/income-tax-for-individuals/tax-codes-and-tax-rates-for-individuals/tax-rates-for-individuals
// - ACC earners' levy: ird.govt.nz/income-tax/income-tax-for-individuals/acc-clients-and-carers/acc-earners-levy-rates
// - Student loan: ird.govt.nz/student-loans/living-in-new-zealand-with-a-student-loan/repaying-my-student-loan-when-i-earn-salary-or-wages
// - Independent earner tax credit: ird.govt.nz/income-tax/income-tax-for-individuals/individual-tax-credits/independent-earner-tax-credit-ietc
// - Secondary tax codes: ird.govt.nz/income-tax/income-tax-for-individuals/tax-codes-and-tax-rates-for-individuals/tax-codes-for-individuals
// It works on a year's income, so it is an estimate: payroll rounds each pay, which can move the total by a few cents.

export const TAX_YEAR = "2026–27";

// Each band also names the secondary tax code for a second job when total income lands in it
export const INCOME_TAX_BANDS = [
  { upTo: 15_600, rate: 0.105, secondaryCode: "SB" },
  { upTo: 53_500, rate: 0.175, secondaryCode: "S" },
  { upTo: 78_100, rate: 0.3, secondaryCode: "SH" },
  { upTo: 180_000, rate: 0.33, secondaryCode: "ST" },
  { upTo: Infinity, rate: 0.39, secondaryCode: "SA" },
] as const;

export const ACC_LEVY = { rate: 0.0175, maxEarnings: 156_641 } as const;
export const STUDENT_LOAN = { rate: 0.12, threshold: 24_128 } as const;
export const IETC = {
  amount: 520,
  from: 24_000,
  fullTo: 66_000,
  to: 70_000,
  abatement: 0.13,
} as const;

export type SecondaryCode = (typeof INCOME_TAX_BANDS)[number]["secondaryCode"];

/** Flat rate for each secondary tax code, from the band it belongs to. */
export const SECONDARY_CODES = Object.fromEntries(
  INCOME_TAX_BANDS.map((band) => [band.secondaryCode, band.rate])
) as Record<SecondaryCode, number>;

/**
 * Each secondary code with its rate and the total income it's for.
 * @returns Codes in band order, each with the income range it covers
 */
function secondaryCodeOptions() {
  let from = 0;
  return INCOME_TAX_BANDS.map(({ secondaryCode, rate, upTo }) => {
    const option = { code: secondaryCode, rate, from, upTo };
    from = upTo + 1;
    return option;
  });
}
export const SECONDARY_CODE_OPTIONS = secondaryCodeOptions();

// 3.5% is the default from 1 April 2026; 3% needs a temporary rate reduction.
export const KIWISAVER_RATES = [
  { rate: 0.03, isDefault: false },
  { rate: 0.035, isDefault: true },
  { rate: 0.04, isDefault: false },
  { rate: 0.06, isDefault: false },
  { rate: 0.08, isDefault: false },
  { rate: 0.1, isDefault: false },
] as const;
export const KIWISAVER_DEFAULT = 0.035;

// Fortnight, not "biweekly": it is what NZ payroll and Inland Revenue call it
export const PERIODS = ["hour", "week", "fortnight", "month", "year"] as const;
export type Period = (typeof PERIODS)[number];

export interface Inputs {
  income: number;
  period: Period;
  hoursPerWeek: number;
  acc: boolean;
  kiwiSaver: boolean;
  kiwiSaverRate: number;
  secondary: boolean;
  secondaryCode: SecondaryCode;
  studentLoan: boolean;
  taxCredits: boolean;
}

export interface Breakdown {
  gross: number;
  incomeTax: number;
  acc: number;
  kiwiSaver: number;
  studentLoan: number;
  taxCredit: number;
  takeHome: number;
}

/**
 * Rounds to the nearest cent, nudging up first so values like 1.005 round as expected.
 * @param n - An amount in dollars
 * @returns The amount rounded to two decimal places
 */
export const cents = (n: number) =>
  Math.round((n + Number.EPSILON) * 100) / 100;

function periodsPerYear(period: Period, hoursPerWeek: number) {
  switch (period) {
    case "hour": {
      return 52 * hoursPerWeek;
    }
    case "week": {
      return 52;
    }
    case "fortnight": {
      return 26;
    }
    case "month": {
      return 12;
    }
    case "year": {
      return 1;
    }
  }
}

/**
 * Turns pay for one period into pay for a year.
 * @param amount - Pay for one period
 * @param period - The period the pay is for
 * @param hoursPerWeek - Hours worked a week, used for hourly pay
 * @returns Pay for a year
 */
export function toAnnual(amount: number, period: Period, hoursPerWeek: number) {
  return amount * periodsPerYear(period, hoursPerWeek);
}

/**
 * Income tax on a year's income from a main job, band by band.
 * @param annual - Income for the year
 * @returns Income tax for the year, before rounding
 */
export function incomeTax(annual: number) {
  let tax = 0;
  let lower = 0;
  for (const { upTo, rate } of INCOME_TAX_BANDS) {
    if (annual <= lower) break;
    tax += (Math.min(annual, upTo) - lower) * rate;
    lower = upTo;
  }
  return tax;
}

/**
 * The ACC earners' levy, which stops at the maximum liable earnings.
 * @param annual - Income for the year
 * @returns The levy for the year, before rounding
 */
export function accLevy(annual: number) {
  return Math.min(annual, ACC_LEVY.maxEarnings) * ACC_LEVY.rate;
}

/**
 * Student loan repayments. A main job repays 12% over the threshold;
 * a secondary job has no threshold, so it repays 12% of every dollar.
 * @param annual - Income for the year from this job
 * @param secondary - Whether this is a second job
 * @returns Repayments for the year, before rounding
 */
export function studentLoanRepayment(annual: number, secondary: boolean) {
  const liable = secondary
    ? annual
    : Math.max(0, annual - STUDENT_LOAN.threshold);
  return liable * STUDENT_LOAN.rate;
}

/**
 * The independent earner tax credit: $520 a year from $24,000 to $66,000,
 * then 13 cents less for each dollar over $66,000, and nothing over $70,000.
 * @param annual - Income for the year
 * @returns The credit for the year
 */
export function independentEarnerTaxCredit(annual: number) {
  if (annual < IETC.from || annual > IETC.to) return 0;
  if (annual <= IETC.fullTo) return IETC.amount;
  return Math.max(0, IETC.amount - (annual - IETC.fullTo) * IETC.abatement);
}

/**
 * The tax code that matches the options picked.
 * @param inputs - Whether it's a second job, its code, and the student loan and tax credit options
 * @param annual - Income for the year, which decides whether the tax credit applies
 * @returns A code such as M, ME, S or M SL
 */
export function taxCode(
  inputs: Pick<
    Inputs,
    "secondary" | "secondaryCode" | "studentLoan" | "taxCredits"
  >,
  annual: number
) {
  let base: SecondaryCode | "M" | "ME" = "M";
  if (inputs.secondary) base = inputs.secondaryCode;
  else if (inputs.taxCredits && independentEarnerTaxCredit(annual) > 0)
    base = "ME";
  return inputs.studentLoan ? `${base} SL` : base;
}

/**
 * A year's breakdown of pay, deductions and take-home pay, each rounded to the cent.
 * @param inputs - Income, its period and the options picked
 * @returns Gross, each deduction, the tax credit and take-home pay for the year
 */
export function calculate(inputs: Inputs): Breakdown {
  const income = Number.isFinite(inputs.income) ? inputs.income : 0;
  const gross = cents(
    Math.max(0, toAnnual(income, inputs.period, inputs.hoursPerWeek))
  );
  const tax = cents(
    inputs.secondary
      ? gross * SECONDARY_CODES[inputs.secondaryCode]
      : incomeTax(gross)
  );
  const acc = inputs.acc ? cents(accLevy(gross)) : 0;
  const kiwiSaver = inputs.kiwiSaver ? cents(gross * inputs.kiwiSaverRate) : 0;
  const studentLoan = inputs.studentLoan
    ? cents(studentLoanRepayment(gross, inputs.secondary))
    : 0;
  const taxCredit =
    inputs.taxCredits && !inputs.secondary
      ? cents(independentEarnerTaxCredit(gross))
      : 0;
  return {
    gross,
    incomeTax: tax,
    acc,
    kiwiSaver,
    studentLoan,
    taxCredit,
    takeHome: cents(gross - tax - acc - kiwiSaver - studentLoan + taxCredit),
  };
}

/**
 * Shows a year's breakdown per hour, week, month or year. Each line is rounded to the cent and
 * take-home pay is worked out from the rounded lines, so the rows always add up.
 * @param annual - The breakdown for a year
 * @param period - The period to show
 * @param hoursPerWeek - Hours worked a week, used for hourly amounts
 * @returns The breakdown for one period
 */
export function perPeriod(
  annual: Breakdown,
  period: Period,
  hoursPerWeek: number
): Breakdown {
  const n = periodsPerYear(period, hoursPerWeek);
  const p = (v: number) => cents(v / n);
  const out = {
    gross: p(annual.gross),
    incomeTax: p(annual.incomeTax),
    acc: p(annual.acc),
    kiwiSaver: p(annual.kiwiSaver),
    studentLoan: p(annual.studentLoan),
    taxCredit: p(annual.taxCredit),
  };
  return {
    ...out,
    takeHome: cents(
      out.gross -
        out.incomeTax -
        out.acc -
        out.kiwiSaver -
        out.studentLoan +
        out.taxCredit
    ),
  };
}
