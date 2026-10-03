"use client";

import { useId } from "react";

import type { Ref } from "react";

import type { SecondaryCode } from "@/lib/tax";
import {
  formatPercent,
  formatWholeMoney,
  HOURS_PER_WEEK,
  parseHours,
} from "@/lib/format";
import { KIWISAVER_RATES, SECONDARY_CODE_OPTIONS } from "@/lib/tax";

import { Button } from "./button";
import { Icon } from "./icons";
import styles from "./settings-dialog.module.css";

const isSecondaryCode = (value: string): value is SecondaryCode =>
  SECONDARY_CODE_OPTIONS.some((o) => o.code === value);

const codeLabel = ({
  code,
  rate,
  from,
  upTo,
}: (typeof SECONDARY_CODE_OPTIONS)[number]) => {
  const range =
    upTo === Infinity
      ? `${formatWholeMoney(from)} and over`
      : `${formatWholeMoney(from)} to ${formatWholeMoney(upTo)}`;
  return `${code}: ${formatPercent(rate)}, total income ${range}`;
};

export function SettingsDialog({
  dialogRef,
  kiwiSaverRate,
  onKiwiSaverRateChange,
  hoursText,
  onHoursChange,
  secondaryCode,
  onSecondaryCodeChange,
}: {
  dialogRef: Ref<HTMLDialogElement>;
  kiwiSaverRate: number;
  onKiwiSaverRateChange: (rate: number) => void;
  hoursText: string;
  onHoursChange: (text: string) => void;
  secondaryCode: SecondaryCode;
  onSecondaryCodeChange: (code: SecondaryCode) => void;
}) {
  const titleId = useId();
  const ksId = useId();
  const hoursId = useId();
  const codeId = useId();
  const hoursHintId = useId();
  const hoursErrorId = useId();
  const hoursInvalid = parseHours(hoursText) === null;
  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId}>
      {/* noValidate: hours are checked below with a clear message, not a browser pop-up */}
      <form method="dialog" className={styles.form} noValidate>
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            Advanced settings
          </h2>
          <button type="submit" className={styles.close} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>

        <div className={styles.field}>
          <label htmlFor={ksId} className={styles.label}>
            KiwiSaver contribution
          </label>
          <select
            id={ksId}
            className={styles.control}
            value={kiwiSaverRate}
            onChange={(e) => onKiwiSaverRateChange(Number(e.target.value))}
          >
            {KIWISAVER_RATES.map(({ rate, isDefault }) => (
              <option key={rate} value={rate}>
                {formatPercent(rate)}
                {isDefault ? " (default)" : ""}
              </option>
            ))}
          </select>
          <p className={styles.hint}>
            3.5% is the default from 1 April 2026. 3% needs a temporary rate
            reduction.
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor={hoursId} className={styles.label}>
            Hours a week
          </label>
          <input
            id={hoursId}
            className={styles.control}
            type="number"
            inputMode="decimal"
            min={1}
            max={168}
            step={0.5}
            value={hoursText}
            onChange={(e) => onHoursChange(e.target.value)}
            aria-invalid={hoursInvalid}
            aria-describedby={
              hoursInvalid ? `${hoursErrorId} ${hoursHintId}` : hoursHintId
            }
          />
          {hoursInvalid && (
            <p id={hoursErrorId} className={styles.error}>
              Enter between {HOURS_PER_WEEK.min} and {HOURS_PER_WEEK.max} hours.
              Until then it uses {HOURS_PER_WEEK.fallback}.
            </p>
          )}
          <p id={hoursHintId} className={styles.hint}>
            Turns hourly pay into a year, and shows amounts per hour.
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor={codeId} className={styles.label}>
            Secondary tax code
          </label>
          <select
            id={codeId}
            className={styles.control}
            value={secondaryCode}
            onChange={(e) => {
              if (isSecondaryCode(e.target.value))
                onSecondaryCodeChange(e.target.value);
            }}
          >
            {SECONDARY_CODE_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {codeLabel(option)}
              </option>
            ))}
          </select>
          <p className={styles.hint}>
            For a second job. Pick the code for your total income from all your
            jobs.
          </p>
        </div>

        <Button type="submit" className={styles.done}>
          Done
        </Button>
      </form>
    </dialog>
  );
}
