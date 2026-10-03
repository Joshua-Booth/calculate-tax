import { figma } from "@/storybook/figma";
import preview from "@/storybook/preview";
import { expect, fn } from "storybook/test";

import { Button } from "./button";

const meta = preview.meta({
  title: "Components/Button",
  component: Button,
  args: { children: "Calculate", icon: "calculator" as const, onClick: fn() },
  parameters: figma("6212:57"),
});

export const Primary = meta.story({
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Calculate" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
});

export const Secondary = meta.story({
  args: { variant: "secondary", icon: "cog", children: "Advanced settings" },
});

export const TextOnly = meta.story({
  args: { icon: undefined, children: "Done" },
});
