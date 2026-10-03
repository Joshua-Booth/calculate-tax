import { figma } from "@/storybook/figma";
import preview from "@/storybook/preview";
import { colors, space } from "@/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

import { Icon, ICON_NAMES } from "./icons";

const styles = stylex.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 120px)",
    gap: space.s24,
  },
  cell: {
    display: "grid",
    justifyItems: "center",
    gap: space.s8,
    fontSize: 14,
    lineHeight: "20px",
    color: colors.textSecondary,
  },
  icon: {
    color: colors.iconAccent,
  },
});

const meta = preview.meta({
  title: "Components/Icon",
  component: Icon,
  args: { name: "calculator" as const, size: 24 },
  argTypes: {
    name: { control: "select", options: ICON_NAMES },
  },
  parameters: figma("6210:97"),
});

export const Single = meta.story({});

export const All = meta.story({
  render: () => (
    <div {...stylex.props(styles.grid)}>
      {ICON_NAMES.map((name) => (
        <div key={name} {...stylex.props(styles.cell)}>
          <Icon name={name} xstyle={styles.icon} />
          {name}
        </div>
      ))}
    </div>
  ),
});
