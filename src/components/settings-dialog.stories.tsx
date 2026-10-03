import { useRef } from "react";

import type { ComponentProps } from "react";
import preview from "@/storybook/preview";
import { expect, fn } from "storybook/test";

import { KIWISAVER_DEFAULT } from "@/lib/tax";

import { Button } from "./button";
import { SettingsDialog } from "./settings-dialog";

// The dialog opens from a button, as it does in the calculator
function WithOpenButton(props: ComponentProps<typeof SettingsDialog>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button
        variant="secondary"
        icon="cog"
        onClick={() => dialogRef.current?.showModal()}
      >
        Advanced settings
      </Button>
      <SettingsDialog {...props} dialogRef={dialogRef} />
    </>
  );
}

// The dialog isn't in the Figma file: it was designed in code
const meta = preview.meta({
  title: "Components/Settings dialog",
  component: SettingsDialog,
  args: {
    dialogRef: { current: null },
    kiwiSaverRate: KIWISAVER_DEFAULT,
    onKiwiSaverRateChange: fn(),
    hoursText: "40",
    onHoursChange: fn(),
    secondaryCode: "S" as const,
    onSecondaryCodeChange: fn(),
  },
  render: (args) => <WithOpenButton {...args} />,
});

export const Open = meta.story({
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Advanced settings" })
    );
    await expect(
      canvas.getByRole("dialog", { name: "Advanced settings" })
    ).toBeVisible();
  },
});

export const InvalidHours = meta.story({
  args: { hoursText: "0" },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Advanced settings" })
    );
    await expect(
      canvas.getByRole("spinbutton", { name: "Hours a week" })
    ).toHaveAttribute("aria-invalid", "true");
    await expect(
      canvas.getByText("Enter between 1 and 168 hours.", { exact: false })
    ).toBeVisible();
  },
});
