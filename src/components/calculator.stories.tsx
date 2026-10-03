import { figma } from "@/storybook/figma";
import preview from "@/storybook/preview";
import { expect, userEvent, waitFor, within } from "storybook/test";

import Calculator from "./calculator";

const meta = preview.meta({
  title: "Screens/Calculator",
  component: Calculator,
  args: { year: 2026 },
  parameters: { layout: "fullscreen" },
});

/**
 * Fills in the worked example the Figma frames show: $85,000 a year, with
 * KiwiSaver and a student loan on top of the ACC levy.
 * @param canvasElement - The story's root element
 */
async function fillWorkedExample(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await userEvent.type(
    canvas.getByRole("textbox", { name: "Income" }),
    "85000"
  );
  await userEvent.click(canvas.getByText("KiwiSaver"));
  await userEvent.click(canvas.getByText("Student loan"));
  await expect(canvas.getByTestId("tax-code")).toHaveTextContent("M SL");
}

// First load, before an income is entered
export const DesktopEmpty = meta.story({
  parameters: figma("6245:535"),
  globals: { viewport: { value: "desktop" } },
});

export const DesktopWorkedExample = meta.story({
  parameters: figma("6213:14"),
  globals: { viewport: { value: "desktop" } },
  play: async ({ canvas, canvasElement }) => {
    await fillWorkedExample(canvasElement);
    await expect(canvas.getByTestId("take-home")).toHaveTextContent(
      "$55,305.36"
    );
  },
});

// Between phone and desktop: one centred card, with the phone's tabs
export const Tablet = meta.story({
  parameters: figma("6245:663"),
  globals: { viewport: { value: "tablet" } },
  play: async ({ canvasElement }) => {
    await fillWorkedExample(canvasElement);
  },
});

export const PhoneDetails = meta.story({
  parameters: figma("6214:98"),
  globals: { viewport: { value: "phone" } },
  play: async ({ canvasElement }) => {
    await fillWorkedExample(canvasElement);
  },
});

// The worked example on the Results tab, shown per week as in the Figma frame
export const PhoneResults = meta.story({
  parameters: figma("6214:190"),
  globals: { viewport: { value: "phone" } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await fillWorkedExample(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Calculate" }));
    await expect(canvas.getByTestId("take-home")).toHaveTextContent(
      "$55,305.36"
    );
    const shownPer = canvas.getByRole("group", { name: "Show amounts per" });
    await userEvent.click(within(shownPer).getByText("Week"));
    await expect(canvas.getByTestId("take-home")).toHaveTextContent(
      "$1,063.57"
    );
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
