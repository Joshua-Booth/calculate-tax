import type { StyleXStyles } from "@stylexjs/stylex";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { colors, radii, shadows, space, strokes } from "@/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

import type { IconName } from "./icons";
import { Icon } from "./icons";

const styles = stylex.create({
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.s8,
    minHeight: 48,
    paddingBlock: 0,
    paddingInline: space.s24,
    borderRadius: radii.md,
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  primary: {
    borderWidth: 0,
    backgroundColor: {
      default: colors.accentFill,
      ":hover": colors.accentHover,
    },
    color: colors.textOnAccent,
    boxShadow: shadows.accent,
  },
  secondary: {
    borderWidth: strokes.field,
    borderStyle: "solid",
    borderColor: colors.borderFocus,
    backgroundColor: {
      default: colors.surfaceCard,
      ":hover": colors.surfaceSubtle,
    },
    color: colors.textAccent,
  },
});

export function Button({
  variant = "primary",
  icon,
  children,
  xstyle,
  type = "button",
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "style"> & {
  variant?: "primary" | "secondary";
  icon?: IconName;
  children: ReactNode;
  xstyle?: StyleXStyles;
}) {
  return (
    <button
      type={type}
      {...props}
      {...stylex.props(styles.button, styles[variant], xstyle)}
    >
      {icon !== undefined && <Icon name={icon} size={20} />}
      {children}
    </button>
  );
}
