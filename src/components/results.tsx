"use client";

import type { Ref } from "react";
import { colors, radii, space, strokes } from "@/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

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

import { SegmentedControl } from "./segmented-control";

const styles = stylex.create({
  hero: {
    display: "grid",
    gap: space.s4,
    containerType: "inline-size",
  },
  overline: {
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.textSecondary,
    outlineStyle: "none",
  },
  amount: {
    lineHeight: 1.125,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    color: colors.textPrimary,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  // Shrinks long amounts so they never overflow their column
  amountSize: (chars: number) => ({
    fontSize: `min(64px, calc(100cqi / (${chars} * 0.62)))`,
  }),
  per: {
    color: colors.textSecondary,
  },
  bar: {
    display: "flex",
    gap: 2,
    height: 16,
    borderRadius: radii.full,
    overflow: "hidden",
  },
  segment: {
    flexBasis: 0,
    minWidth: 2,
  },
  segmentShare: (share: number) => ({
    flexGrow: share,
  }),
  rows: {
    margin: 0,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: space.s12,
    paddingBlock: space.s12,
    paddingInline: 0,
    borderBottomWidth: strokes.thin,
    borderBottomStyle: "solid",
    borderBottomColor: colors.borderSubtle,
  },
  totalRow: {
    borderBottomWidth: 0,
  },
  label: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: space.s12,
    minWidth: 0,
  },
  totalLabel: {
    fontWeight: 700,
  },
  swatch: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    width: 10,
    height: 10,
    borderRadius: radii.full,
  },
  note: {
    marginLeft: "auto",
    fontSize: 14,
    lineHeight: "20px",
    color: colors.textSecondary,
  },
  value: {
    margin: 0,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  totalValue: {
    color: colors.textAccent,
  },
  footnote: {
    fontSize: 14,
    lineHeight: "20px",
    color: colors.textSecondary,
  },
});

// One colour per part of the pay, shared by the bar and the row swatches
const series = stylex.create({
  takeHome: { backgroundColor: colors.chartTakeHome },
  paye: { backgroundColor: colors.chartPaye },
  acc: { backgroundColor: colors.chartAcc },
  kiwiSaver: { backgroundColor: colors.chartKiwiSaver },
  studentLoan: { backgroundColor: colors.chartStudentLoan },
});

type Series = keyof typeof series;

const PERIOD_OPTIONS = PERIODS.map((value) => ({
  value,
  label: PERIOD_LABEL[value],
}));

interface Line {
  key: string;
  label: string;
  note?: string;
  value: string;
  series?: Series;
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
    series: "paye",
    share: b.incomeTax,
  });
  if (inputs.acc)
    out.push({
      key: "acc",
      label: "ACC earners’ levy",
      note: formatPercent(ACC_LEVY.rate),
      value: formatDeduction(b.acc),
      series: "acc",
      share: b.acc,
    });
  if (inputs.kiwiSaver)
    out.push({
      key: "kiwisaver",
      label: "KiwiSaver",
      note: formatPercent(inputs.kiwiSaverRate),
      value: formatDeduction(b.kiwiSaver),
      series: "kiwiSaver",
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
      series: "studentLoan",
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
  const takeHomeSegment: Pick<Line, "key" | "label" | "series" | "share"> = {
    key: "take-home",
    label: "Take-home pay",
    series: "takeHome",
    share: takeHome,
  };
  const segments = [takeHomeSegment, ...parts].filter(
    (s) => (s.share ?? 0) > 0
  );
  const total = segments.reduce((sum, s) => sum + (s.share ?? 0), 0);
  if (total <= 0) return null;
  const summary = segments
    .map((s) => `${s.label} ${formatPercent((s.share ?? 0) / total)}`)
    .join(", ");
  return (
    <div
      {...stylex.props(styles.bar)}
      role="img"
      aria-label={`Breakdown: ${summary}`}
    >
      {segments.map((s) => (
        <span
          key={s.key}
          {...stylex.props(
            styles.segment,
            styles.segmentShare(s.share ?? 0),
            s.series !== undefined && series[s.series]
          )}
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
      <div {...stylex.props(styles.hero)}>
        <h2 ref={headingRef} tabIndex={-1} {...stylex.props(styles.overline)}>
          Your take-home pay
        </h2>
        <p
          {...stylex.props(styles.amount, styles.amountSize(amount.length))}
          data-testid="take-home"
        >
          {amount}
        </p>
        <p {...stylex.props(styles.per)} data-testid="per-period">
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
          <dl {...stylex.props(styles.rows)} data-testid="breakdown">
            {rows.map((r) => (
              <div key={r.key} {...stylex.props(styles.row)} data-row={r.key}>
                <dt {...stylex.props(styles.label)}>
                  {r.series !== undefined && (
                    <span
                      {...stylex.props(styles.swatch, series[r.series])}
                      aria-hidden="true"
                    />
                  )}
                  {r.label}
                  {r.note && (
                    <span {...stylex.props(styles.note)}>{r.note}</span>
                  )}
                </dt>
                <dd {...stylex.props(styles.value)}>{r.value}</dd>
              </div>
            ))}
            <div
              {...stylex.props(styles.row, styles.totalRow)}
              data-row="take-home"
            >
              <dt {...stylex.props(styles.label, styles.totalLabel)}>
                <span
                  {...stylex.props(styles.swatch, series.takeHome)}
                  aria-hidden="true"
                />
                Take-home pay
              </dt>
              <dd {...stylex.props(styles.value, styles.totalValue)}>
                {amount}
              </dd>
            </div>
          </dl>
        </>
      )}
      <p {...stylex.props(styles.footnote)}>
        An estimate using {TAX_YEAR} rates from Inland Revenue: income tax, the
        ACC earners’ levy (capped at {formatWholeMoney(ACC_LEVY.maxEarnings)})
        and student loan repayments. Payroll rounds each pay, so yours can
        differ by a few cents. Not financial advice.
      </p>
    </>
  );
}
