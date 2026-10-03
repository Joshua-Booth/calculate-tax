import type { Period } from "./tax";

const money = new Intl.NumberFormat("en-NZ", {
  style: "currency",
  currency: "NZD",
});
const wholeMoney = new Intl.NumberFormat("en-NZ", {
  style: "currency",
  currency: "NZD",
  maximumFractionDigits: 0,
});
const amount = new Intl.NumberFormat("en-NZ", { maximumFractionDigits: 0 });
const amountWithCents = new Intl.NumberFormat("en-NZ", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percent = new Intl.NumberFormat("en-NZ", {
  style: "percent",
  maximumFractionDigits: 2,
});

/**
 * Formats dollars and cents, like $55,305.36.
 * @param n - An amount in dollars
 * @returns The amount as New Zealand currency
 */
export const formatMoney = (n: number) => money.format(n);

/**
 * Formats whole dollars, like $1,064.
 * @param n - An amount in dollars
 * @returns The amount rounded to the dollar
 */
export const formatWholeMoney = (n: number) => wholeMoney.format(n);

/**
 * Formats a rate, like 3.5% or 1.75%.
 * @param n - A rate as a fraction, so 0.035 for 3.5%
 * @returns The rate as a percentage
 */
export const formatPercent = (n: number) => percent.format(n);

/**
 * Formats a deduction as a negative amount, with a true minus sign.
 * @param n - The deduction in dollars
 * @returns The amount with a minus sign, or $0.00 when there's nothing to take off
 */
export const formatDeduction = (n: number) =>
  n > 0 ? `−${money.format(n)}` : money.format(0);

/**
 * Tidies a typed amount once someone leaves the field: thousands separators,
 * and two decimal places when there are cents.
 * @param n - The amount
 * @returns The amount without a $ sign, like 85,000 or 85,000.50
 */
export const formatAmountInput = (n: number) =>
  Number.isInteger(n) ? amount.format(n) : amountWithCents.format(n);

export const HOURS_PER_WEEK = { min: 1, max: 168, fallback: 40 } as const;

/**
 * Reads the hours worked a week. A week has 168 hours, so anything outside
 * 1 to 168, or not a number, isn't valid.
 * @param text - What was typed
 * @returns The hours, or null when they aren't valid
 */
export function parseHours(text: string) {
  const n = Number(text);
  return text.trim() !== "" &&
    Number.isFinite(n) &&
    n >= HOURS_PER_WEEK.min &&
    n <= HOURS_PER_WEEK.max
    ? n
    : null;
}

export const PERIOD_LABEL: Record<Period, string> = {
  hour: "Hour",
  week: "Week",
  fortnight: "Fortnight",
  month: "Month",
  year: "Year",
};
export const PER_PERIOD: Record<Period, string> = {
  hour: "an hour",
  week: "a week",
  fortnight: "a fortnight",
  month: "a month",
  year: "a year",
};

/**
 * Turns what someone types into a number. Commas, spaces and a $ sign are
 * fine; anything after a second decimal point is ignored.
 * @param text - What was typed
 * @returns The amount, or 0 when there isn't one
 */
export function parseAmount(text: string) {
  const cleaned = text.replaceAll(/[^\d.]/g, "");
  const [whole = "", fraction] = cleaned.split(".");
  const n = Number(fraction === undefined ? whole : `${whole}.${fraction}`);
  return Number.isFinite(n) ? n : 0;
}
