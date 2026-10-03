"use client";

import { a11y } from "@/styles/shared";
import { sx } from "@/styles/sx";
import {
  breakpoints,
  colors,
  radii,
  shadows,
  space,
  strokes,
} from "@/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

import type { IconName } from "./icons";
import { Icon } from "./icons";

const styles = stylex.create({
  tile: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: space.s8,
    // Square when the label fits; otherwise the row grows and every tile fills it
    aspectRatio: "1",
    height: "100%",
    minWidth: 0,
    paddingBlock: { default: space.s12, [breakpoints.under360]: space.s8 },
    paddingInline: { default: space.s8, [breakpoints.under360]: space.s4 },
    borderWidth: strokes.thin,
    borderStyle: "solid",
    borderColor: { default: colors.borderSubtle, ":hover": colors.accentBrand },
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceCard,
    color: { default: colors.textSecondary, ":hover": colors.textPrimary },
    boxShadow: shadows.raised,
    cursor: "pointer",
    userSelect: "none",
    transitionProperty: "background-color, color, box-shadow",
    transitionDuration: { default: "120ms", [breakpoints.reducedMotion]: "0s" },
    // The checkbox is visually hidden, so its keyboard focus shows on the tile
    outlineStyle: { default: "none", ":has(:focus-visible)": "solid" },
    outlineWidth: strokes.focus,
    outlineColor: colors.borderFocus,
    outlineOffset: 3,
  },
  checked: {
    borderColor: colors.accentFill,
    backgroundColor: colors.accentFill,
    color: colors.textOnAccent,
    boxShadow: shadows.accent,
  },
  label: {
    maxWidth: "100%",
    // Three tiles across a small phone leaves about 80px each, so the label shrinks
    fontSize: { default: 14, [breakpoints.under360]: 13 },
    lineHeight: { default: "20px", [breakpoints.under360]: "18px" },
    fontWeight: 700,
    textAlign: "center",
    overflowWrap: "anywhere",
  },
});

export function OptionTile({
  label,
  icon,
  checked,
  onChange,
}: {
  label: string;
  icon: IconName;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label {...stylex.props(styles.tile, checked && styles.checked)}>
      <input
        type="checkbox"
        {...sx("visually-hidden", a11y.visuallyHidden)}
        checked={checked}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
      />
      <Icon name={icon} size={32} />
      <span {...stylex.props(styles.label)}>{label}</span>
    </label>
  );
}
