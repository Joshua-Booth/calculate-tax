import { figma } from "@/storybook/figma";
import preview from "@/storybook/preview";
import { space } from "@/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";
import { expect, fn } from "storybook/test";

import type { Inputs, Period } from "@/lib/tax";
import { formatWholeMoney, PER_PERIOD } from "@/lib/format";
import { calculate, KIWISAVER_DEFAULT, perPeriod } from "@/lib/tax";

import { Results } from "./results";

// The Results column on desktop: its width and the space between sections
const styles = stylex.create({
  frame: {
    display: "flex",
    flexDirection: "column",
    gap: space.s24,
    width: 480,
  },
});

/**
 * Works out the props the calculator would pass for these inputs.
 * @param overrides - Inputs that differ from the $85,000 worked example
 * @param shown - The period the amounts are shown per
 * @returns Props for Results
 */
function resultsFor(overrides: Partial<Inputs>, shown: Period = "year") {
  const inputs: Inputs = {
    income: 85_000,
    period: "year",
    hoursPerWeek: 40,
    kiwiSaverRate: KIWISAVER_DEFAULT,
    secondaryCode: "S",
    acc: true,
    kiwiSaver: true,
    secondary: false,
    studentLoan: true,
    taxCredits: false,
    ...overrides,
  };
  const annual = calculate(inputs);
  const week = perPeriod(annual, "week", inputs.hoursPerWeek);
  return {
    inputs,
    shown,
    breakdown: perPeriod(annual, shown, inputs.hoursPerWeek),
    hasIncome: annual.gross > 0,
    companion: `about ${formatWholeMoney(week.takeHome)} ${PER_PERIOD.week}`,
  };
}

const meta = preview.meta({
  title: "Components/Results",
  component: Results,
  args: {
    ...resultsFor({}),
    onShownChange: fn(),
    headingRef: { current: null },
  },
  parameters: figma("6213:105"),
  decorators: [
    (Story) => (
      <div {...stylex.props(styles.frame)}>
        <Story />
      </div>
    ),
  ],
});

// $85,000 a year on M SL with KiwiSaver at 3.5%
export const WorkedExample = meta.story({
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByTestId("take-home")).toHaveTextContent(
      "$55,305.36"
    );
    await userEvent.click(canvas.getByText("Week"));
    await expect(args.onShownChange).toHaveBeenCalledWith("week");
  },
});

export const Fortnightly = meta.story({
  args: resultsFor({}, "fortnight"),
});

export const TaxCredit = meta.story({
  args: resultsFor({
    income: 40_000,
    kiwiSaver: false,
    studentLoan: false,
    taxCredits: true,
  }),
});

export const SecondJob = meta.story({
  args: resultsFor({ income: 30_000, secondary: true, secondaryCode: "SB" }),
});

export const NoIncome = meta.story({
  args: resultsFor({ income: 0 }),
});
