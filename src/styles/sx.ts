import type { CompiledStyles, StyleXArray } from "@stylexjs/stylex";

import * as stylex from "@stylexjs/stylex";

type Style = StyleXArray<CompiledStyles | boolean | null | undefined>;

/**
 * Applies StyleX styles plus a stable class name. StyleX class names change with
 * every build, so tests and plain CSS target the hook instead.
 * @param hook - A stable class name, like "visually-hidden"
 * @param styles - StyleX styles to apply
 * @returns Props with the merged className
 */
export function sx(hook: string, ...styles: Style[]) {
  const props = stylex.props(...styles);

  return {
    ...props,
    className: [hook, props.className].filter(Boolean).join(" "),
  };
}
