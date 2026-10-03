import { figma } from "@/storybook/figma";
import preview from "@/storybook/preview";
import * as stylex from "@stylexjs/stylex";
import { expect, fn } from "storybook/test";

import { OptionTile } from "./option-tile";

// The size of a tile in the desktop design
const styles = stylex.create({
  frame: { width: 112 },
});

const meta = preview.meta({
  title: "Components/Option tile",
  component: OptionTile,
  args: {
    label: "KiwiSaver",
    icon: "wallet" as const,
    checked: false,
    onChange: fn(),
  },
  parameters: figma("6212:47"),
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Story />
      </div>
    ),
  ],
});

export const Off = meta.story({
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("KiwiSaver"));
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
});

export const On = meta.story({
  args: { checked: true },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("KiwiSaver"));
    await expect(args.onChange).toHaveBeenCalledWith(false);
  },
});

export const TwoLineLabel = meta.story({
  args: { label: "Secondary income", icon: "travel-case" },
});
