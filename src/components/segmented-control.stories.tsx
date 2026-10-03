import { figma } from "@/storybook/figma";
import preview from "@/storybook/preview";
import { expect, fn } from "storybook/test";

import { PERIOD_LABEL } from "@/lib/format";
import { PERIODS } from "@/lib/tax";

import { SegmentedControl } from "./segmented-control";

const meta = preview.meta({
  title: "Components/Segmented control",
  component: SegmentedControl,
  args: {
    legend: "Income is per",
    name: "income-period",
    options: PERIODS.map((value) => ({ value, label: PERIOD_LABEL[value] })),
    value: "year",
    onChange: fn(),
  },
  parameters: figma("6212:27"),
});

export const Year = meta.story({
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Fortnight"));
    await expect(args.onChange).toHaveBeenCalledWith("fortnight");
  },
});

export const Hour = meta.story({
  args: { value: "hour" },
});
