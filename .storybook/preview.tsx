import { colors, fonts } from "@/styles/tokens.stylex";
import * as addonA11y from "@storybook/addon-a11y/preview";
import * as addonDocs from "@storybook/addon-docs/preview";
import { definePreview } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";

import "../src/app/global.css";
import "./fonts.css";

// In dev, the StyleX plugin serves its CSS from a virtual module
if (import.meta.env.DEV) void import("virtual:stylex:runtime");

// The text styles src/app/layout.tsx puts on <body>
const styles = stylex.create({
  root: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: "24px",
    color: colors.textPrimary,
    WebkitFontSmoothing: "antialiased",
  },
});

export default definePreview({
  addons: [addonDocs, addonA11y],
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.root)}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    docs: {
      toc: true,
    },
    // The frame sizes in the Figma file, plus a tablet in between and a short phone
    viewport: {
      options: {
        phone: {
          name: "Phone 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
        phoneShort: {
          name: "Short phone 375 × 667",
          styles: { width: "375px", height: "667px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet 834",
          styles: { width: "834px", height: "1112px" },
          type: "tablet",
        },
        desktop: {
          name: "Desktop 1440",
          styles: { width: "1440px", height: "960px" },
          type: "desktop",
        },
      },
    },
    a11y: {
      // Fail the component tests on any WCAG issue, as the e2e axe scan does
      test: "error",
    },
  },
  tags: ["autodocs"],
});
