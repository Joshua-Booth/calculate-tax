"use client";

import type { CSSProperties, Ref } from "react";

import type { Breakdown, Inputs, Period } from "@/lib/tax";
import {
  formatDeduction,
  formatMoney,
  formatPercent,
  formatWholeMoney,
  PER_PERIOD,
  PERIOD_LABEL,
} from "@/lib/format";
import {
  ACC_LEVY,
  IETC,
  PERIODS,
  SECONDARY_CODES,
  STUDENT_LOAN,
  TAX_YEAR,
} from "@/lib/tax";

import styles from "./results.module.css";
import { SegmentedControl } from "./segmented-control";

const PERIOD_OPTIONS = PERIODS.map((value) => ({
  value,
  label: PERIOD_LABEL[value],
}));

interface Line {
  key: string;
  label: string;
  note?: string;
  value: string;
  color?: string;
  share?: number;
}

// Why the tax credit is or isn't paid
function taxCreditNote(b: Breakdown, inputs: Inputs) {
  if (inputs.secondary) return "Not for a second job";
  if (b.taxCredit > 0) return "IETC";
  return `Only from ${formatWholeMoney(IETC.from)} to ${formatWholeMoney(IETC.to)}`;
}

function lines(b: Breakdown, inputs: Inputs): Line[] {
  const out: Line[] = [
    { key: "gross", label: "Gross income", value: formatMoney(b.gross) },
  ];
  out.push({
    key: "tax",
    label: "PAYE income tax",
    note: inputs.secondary
      ? `${inputs.secondaryCode} ${formatPercent(SECONDARY_CODES[inputs.secondaryCode])}`
      : undefined,
    value: formatDeduction(b.incomeTax),
    color: "var(--chart-paye)",
    share: b.incomeTax,
  });
  if (inputs.acc)
    out.push({
      key: "acc",
      label: "ACC earners’ levy",
      note: formatPercent(ACC_LEVY.rate),
      value: formatDeduction(b.acc),
      color: "var(--chart-acc)",
      share: b.acc,
    });
  if (inputs.kiwiSaver)
    out.push({
      key: "kiwisaver",
      label: "KiwiSaver",
      note: formatPercent(inputs.kiwiSaverRate),
      value: formatDeduction(b.kiwiSaver),
      color: "var(--chart-kiwisaver)",
      share: b.kiwiSaver,
    });
  if (inputs.studentLoan)
    out.push({
      key: "student-loan",
      label: "Student loan",
      note: inputs.secondary
        ? formatPercent(STUDENT_LOAN.rate)
        : `${formatPercent(STUDENT_LOAN.rate)} over ${formatWholeMoney(STUDENT_LOAN.threshold)}`,
      value: formatDeduction(b.studentLoan),
      color: "var(--chart-student-loan)",
      share: b.studentLoan,
    });
  if (inputs.taxCredits) {
    out.push({
      key: "tax-credit",
      label: "Tax credit",
      note: taxCreditNote(b, inputs),
      value: b.taxCredit > 0 ? `+${formatMoney(b.taxCredit)}` : formatMoney(0),
    });
  }
  return out;
}

function BreakdownBar({
  takeHome,
  parts,
}: {
  takeHome: number;
  parts: Line[];
}) {
  const segments = [
    {
      key: "take-home",
      label: "Take-home pay",
      color: "var(--chart-take-home)",
      share: takeHome,
    },
    ...parts,
  ].filter((s) => (s.share ?? 0) > 0);
  const total = segments.reduce((sum, s) => sum + (s.share ?? 0), 0);
  if (total <= 0) return null;
  const summary = segments
    .map((s) => `${s.label} ${formatPercent((s.share ?? 0) / total)}`)
    .join(", ");
  return (
    <div className={styles.bar} role="img" aria-label={`Breakdown: ${summary}`}>
      {segments.map((s) => (
        <span
          key={s.key}
          className={styles.segment}
          style={{ flexGrow: s.share, background: s.color }}
        />
      ))}
    </div>
  );
}

export function Results({
  breakdown,
  inputs,
  shown,
  onShownChange,
  hasIncome,
  companion,
  headingRef,
}: {
  breakdown: Breakdown;
  inputs: Inputs;
  shown: Period;
  onShownChange: (p: Period) => void;
  hasIncome: boolean;
  companion: string;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const amount = formatMoney(breakdown.takeHome);
  const rows = lines(breakdown, inputs);
  return (
    <>
      <div className={styles.hero}>
        <h2 ref={headingRef} tabIndex={-1} className={styles.overline}>
          Your take-home pay
        </h2>
        <p
          className={styles.amount}
          style={{ "--chars": amount.length } as CSSProperties}
          data-testid="take-home"
        >
          {amount}
        </p>
        <p className={styles.per} data-testid="per-period">
          {hasIncome
            ? `${PER_PERIOD[shown]} · ${companion}`
            : "Enter your income to see your take-home pay."}
        </p>
      </div>
      <SegmentedControl
        legend="Show amounts per"
        name="shown-period"
        options={PERIOD_OPTIONS}
        value={shown}
        onChange={onShownChange}
      />
      {hasIncome && (
        <>
          <BreakdownBar takeHome={breakdown.takeHome} parts={rows} />
          <dl className={styles.rows} data-testid="breakdown">
            {rows.map((r) => (
              <div key={r.key} className={styles.row} data-row={r.key}>
                <dt className={styles.label}>
                  {r.color ? (
                    <span
                      className={styles.swatch}
                      style={{ background: r.color }}
                      aria-hidden="true"
                    />
                  ) : (
                    <span className={styles.swatchSpace} aria-hidden="true" />
                  )}
                  {r.label}
                  {r.note && <span className={styles.note}>{r.note}</span>}
                </dt>
                <dd className={styles.value}>{r.value}</dd>
              </div>
            ))}
            <div
              className={`${styles.row} ${styles.total}`}
              data-row="take-home"
            >
              <dt className={styles.label}>
                <span
                  className={styles.swatch}
                  style={{ background: "var(--chart-take-home)" }}
                  aria-hidden="true"
                />
                Take-home pay
              </dt>
              <dd className={styles.value}>{amount}</dd>
            </div>
          </dl>
        </>
      )}
      <p className={styles.footnote}>
        An estimate using {TAX_YEAR} rates from Inland Revenue: income tax, the
        ACC earners’ levy (capped at {formatWholeMoney(ACC_LEVY.maxEarnings)})
        and student loan repayments. Payroll rounds each pay, so yours can
        differ by a few cents. Not financial advice.
      </p>
    </>
  );
}
