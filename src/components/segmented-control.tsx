"use client";

import { a11y } from "@/styles/shared";
import { sx } from "@/styles/sx";
import {
  breakpoints,
  colors,
  radii,
  space,
  strokes,
} from "@/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  control: {
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
  },
  legend: {
    float: "left",
    width: "100%",
    marginBottom: space.s8,
    padding: 0,
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 700,
    color: colors.textAccent,
  },
  // Segments hug their text with 12px either side, as in the design.
  // There's no gap: only the selected pill is visible, and the padding spaces the
  // labels. On small phones the text and padding shrink so all five periods fit
  // (checked down to 320px by the e2e width sweep).
  track: {
    clear: "both",
    display: "grid",
    gridAutoColumns: "max-content",
    gridAutoFlow: "column",
    width: "fit-content",
    maxWidth: "100%",
    padding: space.s4,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceTint,
  },
  segment: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
    minHeight: 36,
    paddingBlock: 0,
    paddingInline: {
      default: space.s12,
      [breakpoints.from350To379]: "10px",
      [breakpoints.under350]: "7px",
    },
    borderRadius: radii.full,
    fontSize: { default: 14, [breakpoints.under380]: 13 },
    lineHeight: "20px",
    fontWeight: 700,
    color: { default: colors.textSecondary, ":hover": colors.textPrimary },
    whiteSpace: "nowrap",
    cursor: "pointer",
    // The radio is visually hidden, so its keyboard focus shows on the pill
    outlineStyle: { default: "none", ":has(:focus-visible)": "solid" },
    outlineWidth: strokes.focus,
    outlineColor: colors.borderFocus,
    outlineOffset: 2,
  },
  selected: {
    backgroundColor: colors.accentFill,
    color: colors.textOnAccent,
  },
});

export function SegmentedControl<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset {...stylex.props(styles.control)}>
      <legend {...stylex.props(styles.legend)}>{legend}</legend>
      <div {...stylex.props(styles.track)}>
        {options.map((o) => (
          <label
            key={o.value}
            {...stylex.props(
              styles.segment,
              value === o.value && styles.selected
            )}
          >
            <input
              type="radio"
              {...sx("visually-hidden", a11y.visuallyHidden)}
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => {
                onChange(o.value);
              }}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
