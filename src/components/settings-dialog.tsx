"use client";

import { useId } from "react";

import type { Ref, SelectHTMLAttributes } from "react";
import {
  colors,
  fonts,
  radii,
  shadows,
  space,
  strokes,
} from "@/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

import type { SecondaryCode } from "@/lib/tax";
import {
  formatPercent,
  formatWholeMoney,
  HOURS_PER_WEEK,
  parseHours,
} from "@/lib/format";
import {
  KIWISAVER_RATES,
  SECONDARY_CODE_OPTIONS,
  SECONDARY_CODES,
} from "@/lib/tax";

import { Button } from "./button";
import { Icon } from "./icons";

const styles = stylex.create({
  dialog: {
    width: "min(480px, calc(100vw - 32px))",
    maxHeight: "calc(100dvh - 32px)",
    padding: 0,
    borderWidth: 0,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceCard,
    color: colors.textPrimary,
    boxShadow: shadows.card,
  },
  form: {
    display: "grid",
    gap: space.s24,
    padding: space.s24,
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.s16,
  },
  title: {
    fontSize: 20,
    lineHeight: "28px",
    fontWeight: 700,
  },
  close: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    width: 44,
    height: 44,
    margin: `calc(${space.s8} * -1)`,
    padding: 0,
    borderWidth: 0,
    borderRadius: radii.full,
    backgroundColor: {
      default: "transparent",
      ":hover": colors.surfaceSubtle,
    },
    color: colors.iconDefault,
    cursor: "pointer",
  },
  field: {
    display: "grid",
    gap: space.s8,
  },
  label: {
    fontFamily: fonts.heavy,
    fontWeight: 800,
    color: colors.textAccent,
  },
  control: {
    width: "100%",
    minHeight: 48,
    paddingBlock: 0,
    paddingInline: space.s12,
    borderStyle: "solid",
    borderWidth: { default: strokes.field, ":focus-visible": strokes.focus },
    borderColor: {
      default: colors.borderField,
      ":focus-visible": colors.borderFocus,
    },
    borderRadius: radii.md,
    backgroundColor: colors.surfaceCard,
    outlineStyle: { default: null, ":focus-visible": "none" },
    boxShadow: { default: null, ":focus-visible": shadows.focusRing },
    fontWeight: 700,
  },
  // The browser's own arrow sits about 8px from the border, which looks
  // cramped, so selects draw a chevron with the same inset as their text
  select: {
    appearance: "none",
    paddingInlineEnd: `calc(${space.s12} * 2 + 20px)`,
  },
  selectBox: {
    position: "relative",
  },
  chevron: {
    position: "absolute",
    top: "50%",
    insetInlineEnd: space.s12,
    transform: "translateY(-50%)",
    color: colors.iconDefault,
    pointerEvents: "none",
  },
  // Stays red while focused, so the problem is still clear as you fix it
  controlInvalid: {
    borderColor: colors.textDanger,
  },
  error: {
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 700,
    color: colors.textDanger,
  },
  hint: {
    fontSize: 14,
    lineHeight: "20px",
    color: colors.textSecondary,
  },
  done: {
    justifySelf: "end",
  },
});

const isSecondaryCode = (value: string): value is SecondaryCode =>
  SECONDARY_CODE_OPTIONS.some((o) => o.code === value);

// The code and its income band. The rate goes in the hint below, so the label
// fits a phone-width select.
const codeLabel = ({
  code,
  from,
  upTo,
}: (typeof SECONDARY_CODE_OPTIONS)[number]) => {
  if (from === 0) return `${code}: up to ${formatWholeMoney(upTo)}`;
  if (upTo === Infinity) return `${code}: ${formatWholeMoney(from)} and over`;
  return `${code}: ${formatWholeMoney(from)} to ${formatWholeMoney(upTo)}`;
};

function Select({
  children,
  ...props
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "style">) {
  return (
    <div {...stylex.props(styles.selectBox)}>
      <select {...props} {...stylex.props(styles.control, styles.select)}>
        {children}
      </select>
      <Icon name="chevron-down" size={20} xstyle={styles.chevron} />
    </div>
  );
}

export function SettingsDialog({
  dialogRef,
  kiwiSaverRate,
  onKiwiSaverRateChange,
  hoursText,
  onHoursChange,
  secondaryCode,
  onSecondaryCodeChange,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  kiwiSaverRate: number;
  onKiwiSaverRateChange: (rate: number) => void;
  hoursText: string;
  onHoursChange: (text: string) => void;
  secondaryCode: SecondaryCode;
  onSecondaryCodeChange: (code: SecondaryCode) => void;
}) {
  const titleId = useId();
  const ksId = useId();
  const hoursId = useId();
  const codeId = useId();
  const codeHintId = useId();
  const hoursHintId = useId();
  const hoursErrorId = useId();
  const hoursInvalid = parseHours(hoursText) === null;
  return (
    <dialog
      ref={dialogRef}
      {...stylex.props(styles.dialog)}
      aria-labelledby={titleId}
    >
      {/* noValidate: hours are checked below with a clear message, not a browser pop-up */}
      <form method="dialog" {...stylex.props(styles.form)} noValidate>
        <div {...stylex.props(styles.head)}>
          <h2 id={titleId} {...stylex.props(styles.title)}>
            Advanced settings
          </h2>
          <button
            type="submit"
            {...stylex.props(styles.close)}
            aria-label="Close"
          >
            <Icon name="close" />
          </button>
        </div>

        <div {...stylex.props(styles.field)}>
          <label htmlFor={ksId} {...stylex.props(styles.label)}>
            KiwiSaver contribution
          </label>
          <Select
            id={ksId}
            value={kiwiSaverRate}
            onChange={(e) => onKiwiSaverRateChange(Number(e.target.value))}
          >
            {KIWISAVER_RATES.map(({ rate, isDefault }) => (
              <option key={rate} value={rate}>
                {formatPercent(rate)}
                {isDefault ? " (default)" : ""}
              </option>
            ))}
          </Select>
          <p {...stylex.props(styles.hint)}>
            3.5% is the default from 1 April 2026. 3% needs a temporary rate
            reduction.
          </p>
        </div>

        <div {...stylex.props(styles.field)}>
          <label htmlFor={hoursId} {...stylex.props(styles.label)}>
            Hours a week
          </label>
          <input
            id={hoursId}
            {...stylex.props(
              styles.control,
              hoursInvalid && styles.controlInvalid
            )}
            type="number"
            inputMode="decimal"
            min={1}
            max={168}
            step={0.5}
            value={hoursText}
            onChange={(e) => onHoursChange(e.target.value)}
            aria-invalid={hoursInvalid}
            aria-describedby={
              hoursInvalid ? `${hoursErrorId} ${hoursHintId}` : hoursHintId
            }
          />
          {hoursInvalid && (
            <p id={hoursErrorId} {...stylex.props(styles.error)}>
              Enter between {HOURS_PER_WEEK.min} and {HOURS_PER_WEEK.max} hours.
              Until then it uses {HOURS_PER_WEEK.fallback}.
            </p>
          )}
          <p id={hoursHintId} {...stylex.props(styles.hint)}>
            Turns hourly pay into a year, and shows amounts per hour.
          </p>
        </div>

        <div {...stylex.props(styles.field)}>
          <label htmlFor={codeId} {...stylex.props(styles.label)}>
            Secondary tax code
          </label>
          <Select
            id={codeId}
            aria-describedby={codeHintId}
            value={secondaryCode}
            onChange={(e) => {
              if (isSecondaryCode(e.target.value))
                onSecondaryCodeChange(e.target.value);
            }}
          >
            {SECONDARY_CODE_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {codeLabel(option)}
              </option>
            ))}
          </Select>
          <p id={codeHintId} {...stylex.props(styles.hint)}>
            Used when Secondary income is on. Pick the band your total income
            from all your jobs is in. {secondaryCode} takes{" "}
            {formatPercent(SECONDARY_CODES[secondaryCode])} of every dollar from
            that job.
          </p>
        </div>

        <Button type="submit" xstyle={styles.done}>
          Done
        </Button>
      </form>
    </dialog>
  );
}
