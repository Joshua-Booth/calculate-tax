// The 2026 design lives in a private Figma file, so these frames only open for
// people with access to it.
const FILE_URL =
  "https://www.figma.com/design/ilshQWWWEDFVvLEkuBLAty/Tax-Calculator";

/**
 * Shows a Figma frame in the Design panel beside a story.
 * @param nodeId - The frame's node id, like "6212:57"
 * @returns Story parameters for the designs addon
 */
export function figma(nodeId: string) {
  return {
    design: {
      type: "figma",
      url: `${FILE_URL}?node-id=${nodeId.replace(":", "-")}`,
    },
  };
}
