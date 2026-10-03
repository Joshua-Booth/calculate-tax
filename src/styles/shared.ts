import * as stylex from "@stylexjs/stylex";

export const a11y = stylex.create({
  // Off screen but still read by screen readers, and still focusable for inputs
  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
});
