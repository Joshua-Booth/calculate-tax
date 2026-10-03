"use client";

import { useId } from "react";

import styles from "./field.module.css";
import { Icon } from "./icons";

export function IncomeField({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (text: string) => void;
  onBlur: () => void;
}) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        Income
      </label>
      <div className={styles.box}>
        <span className={styles.prefix} aria-hidden="true">
          $
        </span>
        <input
          id={id}
          className={styles.input}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          maxLength={15}
          value={value}
          onChange={(e) => onChange(e.target.value.replaceAll(/[^\d.,]/g, ""))}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}

export function TaxCodeField({ code }: { code: string }) {
  const labelId = useId();
  const helpId = useId();
  return (
    <div className={`${styles.field} ${styles.code}`}>
      <span id={labelId} className={styles.label}>
        Tax code
      </span>
      <div className={styles.box}>
        <Icon name="document-currency" size={20} className={styles.icon} />
        <output
          className={styles.value}
          aria-labelledby={labelId}
          data-testid="tax-code"
        >
          {code}
        </output>
        <button
          type="button"
          className={styles.help}
          popoverTarget={helpId}
          aria-label="What does my tax code mean?"
        >
          <Icon name="question" size={20} />
        </button>
      </div>
      <div id={helpId} popover="auto" className={styles.popover}>
        <h2 className={styles.popoverTitle}>Your tax code</h2>
        <p>It follows the options you pick.</p>
        <ul>
          <li>
            <strong>M</strong> is for your main job.
          </li>
          <li>
            <strong>ME</strong> adds the independent earner tax credit, for
            incomes from $24,000 to $70,000.
          </li>
          <li>
            <strong>SB, S, SH, ST</strong> and <strong>SA</strong> are for a
            second job. Change the code in Advanced settings.
          </li>
          <li>
            <strong>SL</strong> on the end means you repay a student loan.
          </li>
        </ul>
        <button
          type="button"
          className={styles.popoverClose}
          popoverTarget={helpId}
          popoverTargetAction="hide"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
