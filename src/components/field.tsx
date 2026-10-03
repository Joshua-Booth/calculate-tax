"use client";

import { useId } from "react";

import {
  breakpoints,
  colors,
  fonts,
  radii,
  shadows,
  space,
  strokes,
} from "@/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

import { Icon } from "./icons";

const styles = stylex.create({
  field: {
    display: "flex",
    flexDirection: "column",
    gap: space.s8,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  code: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "clamp(108px, 32%, 200px)",
  },
  label: {
    fontFamily: fonts.heavy,
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 800,
    color: colors.textAccent,
  },
  box: {
    display: "flex",
    alignItems: "center",
    gap: space.s8,
    minHeight: 48,
    paddingBlock: 0,
    // The border thickens on focus, so the padding gives back the difference
    paddingInline: {
      default: space.s16,
      ":focus-within": `calc(${space.s16} - 0.5px)`,
    },
    backgroundColor: colors.surfaceCard,
    borderStyle: "solid",
    borderWidth: { default: strokes.field, ":focus-within": strokes.focus },
    borderColor: {
      default: colors.borderField,
      ":focus-within": colors.borderFocus,
    },
    borderRadius: radii.md,
    boxShadow: { default: "none", ":focus-within": shadows.focusRing },
  },
  prefix: {
    fontWeight: 700,
    color: colors.textSecondary,
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    minWidth: 0,
    height: 44,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    outlineStyle: "none",
    fontWeight: 700,
    color: colors.textPrimary,
    "::placeholder": {
      color: colors.textSecondary,
      fontWeight: 400,
    },
  },
  value: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    minWidth: 0,
    fontWeight: 700,
    color: colors.textPrimary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  // On a phone the tax code field drops its icon so the code fits, as in the design
  icon: {
    display: { default: "none", [breakpoints.tabletUp]: "block" },
    flexShrink: 0,
    color: colors.iconDefault,
  },
  help: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    flexShrink: 0,
    width: 32,
    height: 32,
    marginRight: `calc(${space.s8} * -1)`,
    padding: 0,
    borderWidth: 0,
    borderRadius: radii.full,
    backgroundColor: "transparent",
    color: { default: colors.iconDefault, ":hover": colors.iconAccent },
    cursor: "pointer",
  },
  popover: {
    width: "min(360px, calc(100vw - 32px))",
    padding: space.s24,
    borderWidth: 0,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceCard,
    color: colors.textPrimary,
    boxShadow: shadows.card,
    fontSize: 14,
    lineHeight: "20px",
  },
  popoverTitle: {
    marginBottom: space.s4,
    fontSize: 20,
    lineHeight: "28px",
    fontWeight: 700,
  },
  popoverList: {
    display: "grid",
    gap: space.s8,
    marginTop: space.s12,
    marginBottom: space.s20,
    marginInline: 0,
    paddingLeft: space.s20,
  },
  popoverClose: {
    minHeight: 44,
    paddingBlock: 0,
    paddingInline: space.s20,
    borderWidth: strokes.field,
    borderStyle: "solid",
    borderColor: colors.borderFocus,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceCard,
    color: colors.textAccent,
    fontWeight: 700,
    cursor: "pointer",
  },
});

export function IncomeField({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (text: string) => void;
  onBlur: () => void;
}) {
  const id = useId();
  return (
    <div {...stylex.props(styles.field)}>
      <label htmlFor={id} {...stylex.props(styles.label)}>
        Income
      </label>
      <div {...stylex.props(styles.box)}>
        <span {...stylex.props(styles.prefix)} aria-hidden="true">
          $
        </span>
        <input
          id={id}
          {...stylex.props(styles.input)}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          maxLength={15}
          value={value}
          onChange={(e) => {
            onChange(e.target.value.replaceAll(/[^\d.,]/g, ""));
          }}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}

export function TaxCodeField({ code }: { code: string }) {
  const labelId = useId();
  const helpId = useId();
  return (
    <div {...stylex.props(styles.field, styles.code)}>
      <span id={labelId} {...stylex.props(styles.label)}>
        Tax code
      </span>
      <div {...stylex.props(styles.box)}>
        <Icon name="document-currency" size={20} xstyle={styles.icon} />
        <output
          {...stylex.props(styles.value)}
          aria-labelledby={labelId}
          data-testid="tax-code"
        >
          {code}
        </output>
        <button
          type="button"
          {...stylex.props(styles.help)}
          popoverTarget={helpId}
          aria-label="What does my tax code mean?"
        >
          <Icon name="question" size={20} />
        </button>
      </div>
      <div id={helpId} popover="auto" {...stylex.props(styles.popover)}>
        <h2 {...stylex.props(styles.popoverTitle)}>Your tax code</h2>
        <p>It follows the options you pick.</p>
        <ul {...stylex.props(styles.popoverList)}>
          <li>
            <strong>M</strong> is for your main job.
          </li>
          <li>
            <strong>ME</strong> adds the independent earner tax credit, for
            incomes from $24,000 to $70,000.
          </li>
          <li>
            <strong>SB, S, SH, ST</strong> and <strong>SA</strong> are for a
            second job. Change the code in Advanced settings.
          </li>
          <li>
            <strong>SL</strong> on the end means you repay a student loan.
          </li>
        </ul>
        <button
          type="button"
          {...stylex.props(styles.popoverClose)}
          popoverTarget={helpId}
          popoverTargetAction="hide"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
