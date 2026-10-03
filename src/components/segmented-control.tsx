"use client";

import styles from "./segmented-control.module.css";

export function SegmentedControl<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className={styles.control}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.track}>
        {options.map((o) => (
          <label key={o.value} className={styles.segment}>
            <input
              type="radio"
              className={`visually-hidden ${styles.radio}`}
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            <span className={styles.text}>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
