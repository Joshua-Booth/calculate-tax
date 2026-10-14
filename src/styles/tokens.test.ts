import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

// Plain CSS and the viewport meta can't read StyleX variables, so they copy
// token colours by hand. This catches a copy left behind when a token changes.
const COPIES = ["../app/global.css", "../app/layout.tsx"];

const read = (file: string) =>
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- only the fixed files above
  readFileSync(new URL(file, import.meta.url), "utf8");

const toHex = (channels: string[]) =>
  `#${channels.map((c) => Number(c).toString(16).padStart(2, "0")).join("")}`;

/**
 * Every colour in some source text, as six-digit hex. The alpha of an rgba()
 * is dropped, since a copy may fade a token.
 * @param text - Source code or CSS
 * @returns The colours, lowercased
 */
function colours(text: string) {
  const fromHex = [...text.matchAll(/#([\da-f]{6}|[\da-f]{3})\b/gi)].map(
    ([, h = ""]) => `#${h.replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3")}`.toLowerCase()
  );
  const fromRgb = [...text.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g)].map(
    ([, r = "", g = "", b = ""]) => toHex([r, g, b])
  );
  return [...fromHex, ...fromRgb];
}

const tokens = read("tokens.stylex.ts");
const colorTokens = new Set(
  colours(tokens.slice(0, tokens.indexOf("export const space")))
);

describe("colours copied from the tokens", () => {
  it.each(COPIES)("%s only uses token colours", (file) => {
    const copied = colours(read(file));
    expect(copied.length).toBeGreaterThan(0);
    for (const colour of copied) expect(colorTokens).toContain(colour);
  });
});
