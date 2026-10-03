// The design tokens: colour, space, radius, stroke, shadow and type.
import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  bgPage: "#f2f4f8",
  surfaceCard: "#fff",
  surfaceSubtle: "#f7f6fc",
  surfaceTint: "#eeedf8",
  textPrimary: "#272d2d",
  textSecondary: "#6b6b76",
  textAccent: "#6a63b8",
  textOnAccent: "#fff",
  textDanger: "#ca3131",
  accentFill: "#6a63b8",
  accentHover: "#5d56a8",
  accentBrand: "#9b96cf",
  borderField: "#928ea3",
  borderSubtle: "#e6e4ee",
  borderFocus: "#6a63b8",
  iconDefault: "#6b6b76",
  iconAccent: "#6a63b8",
  iconOnAccent: "#fff",
  chartTakeHome: "#6a63b8",
  chartPaye: "#9b96cf",
  chartAcc: "#c9c5ea",
  chartKiwiSaver: "#45b5bb",
  chartStudentLoan: "#5d94cc",
});

export const space = stylex.defineVars({
  s4: "4px",
  s8: "8px",
  s12: "12px",
  s16: "16px",
  s20: "20px",
  s24: "24px",
  s32: "32px",
  s40: "40px",
  s48: "48px",
  s64: "64px",
});

export const radii = stylex.defineVars({
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
  full: "9999px",
});

export const strokes = stylex.defineVars({
  thin: "1px",
  field: "1.5px",
  focus: "2px",
});

export const shadows = stylex.defineVars({
  card: "0 24px 64px rgba(133, 140, 166, 0.28)",
  raised: "0 2px 8px rgba(0, 0, 0, 0.08)",
  accent: "0 8px 24px rgba(106, 99, 184, 0.32)",
  docked: "0 -8px 16px -8px rgba(133, 140, 166, 0.32)",
  focusRing: "0 0 0 4px rgba(106, 99, 184, 0.22)",
});

// ExtraBold (800) lives in its own file; see src/app/fonts/README.md
export const fonts = stylex.defineVars({
  sans: "var(--font-lato), system-ui, sans-serif",
  heavy: "var(--font-lato-heavy), var(--font-lato), system-ui, sans-serif",
});

// Three layouts: phone (under 640px), a centred card on tablets (640 to 1199px),
// and side-by-side panes on desktop (1200px and up). Ranges that are used in the
// same property don't overlap, so no style depends on media query order.
export const breakpoints = stylex.defineConsts({
  phone: "@media (max-width: 639px)",
  tablet: "@media (min-width: 640px) and (max-width: 1199px)",
  tabletUp: "@media (min-width: 640px)",
  desktop: "@media (min-width: 1200px)",
  desktopNarrow: "@media (min-width: 1200px) and (max-width: 1359px)",
  desktopWide: "@media (min-width: 1360px)",
  fiveTiles: "@media (min-width: 540px)",
  under380: "@media (max-width: 379px)",
  from350To379: "@media (min-width: 350px) and (max-width: 379px)",
  under350: "@media (max-width: 349px)",
  under360: "@media (max-width: 359px)",
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
});
