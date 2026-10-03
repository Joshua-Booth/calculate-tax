import { figma } from "@/storybook/figma";
import preview from "@/storybook/preview";
import { expect } from "storybook/test";

import Calculator from "./calculator";

const meta = preview.meta({
  title: "Screens/Calculator",
  component: Calculator,
  args: { year: 2026 },
  parameters: { layout: "fullscreen" },
});

export const Desktop = meta.story({
  parameters: figma("6213:14"),
  globals: { viewport: { value: "desktop" } },
});

export const PhoneDetails = meta.story({
  parameters: figma("6214:98"),
  globals: { viewport: { value: "phone" } },
});

// The worked example, from typing an income to the Results tab
export const PhoneResults = meta.story({
  parameters: figma("6214:190"),
  globals: { viewport: { value: "phone" } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Income" }),
      "85000"
    );
    await userEvent.click(canvas.getByText("KiwiSaver"));
    await userEvent.click(canvas.getByText("Student loan"));
    await userEvent.click(canvas.getByRole("button", { name: "Calculate" }));
    await expect(canvas.getByTestId("take-home")).toHaveTextContent(
      "$55,305.36"
    );
    await expect(canvas.getByTestId("tax-code")).toHaveTextContent("M SL");
  },
});
