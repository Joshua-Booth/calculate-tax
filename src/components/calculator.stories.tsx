import { figma } from "@/storybook/figma";
import preview from "@/storybook/preview";
import { expect, waitFor } from "storybook/test";

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

// On a short phone the results scroll under the tab bar, which shows an edge
// until it comes to rest below them
export const ShortPhoneResults = meta.story({
  parameters: figma("6214:190"),
  globals: { viewport: { value: "phoneShort" } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Income" }),
      "85000"
    );
    await userEvent.click(canvas.getByRole("button", { name: "Calculate" }));
    // Calculate scrolls to the top and focuses the heading in the next frame
    await waitFor(() =>
      expect(
        canvas.getByRole("heading", { name: "Your take-home pay" })
      ).toHaveFocus()
    );
    const tabs = canvas.getByRole("tablist");
    const shadow = () => getComputedStyle(tabs).boxShadow;
    window.scrollTo({ top: document.documentElement.scrollHeight });
    await waitFor(() => expect(shadow()).toBe("none"));
    window.scrollTo({ top: 0 });
    await waitFor(() => expect(shadow()).not.toBe("none"));
  },
});
