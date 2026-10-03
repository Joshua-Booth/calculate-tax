import { figma } from "@/storybook/figma";
import preview from "@/storybook/preview";
import * as stylex from "@stylexjs/stylex";
import { expect, fn } from "storybook/test";

import { IncomeField, TaxCodeField } from "./field";

// The width of a field in the design
const styles = stylex.create({
  frame: { width: 280 },
});

const meta = preview.meta({
  title: "Components/Field",
  component: IncomeField,
  args: { value: "", onChange: fn(), onBlur: fn() },
  parameters: figma("6212:20"),
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Story />
      </div>
    ),
  ],
});

export const Income = meta.story({
  // Only digits, commas and points get through
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Income" }), "8a");
    await expect(args.onChange).toHaveBeenNthCalledWith(1, "8");
    await expect(args.onChange).toHaveBeenNthCalledWith(2, "");
  },
});

export const IncomeFilled = meta.story({
  args: { value: "85,000" },
});

export const TaxCode = meta.story({
  render: () => <TaxCodeField code="M SL" />,
});

export const TaxCodeHelp = meta.story({
  parameters: figma("6241:202"),
  render: () => <TaxCodeField code="ME" />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "What does my tax code mean?" })
    );
    await expect(
      canvas.getByRole("heading", { name: "Your tax code" })
    ).toBeVisible();
  },
});
