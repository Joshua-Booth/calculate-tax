"use client";

import type { IconName } from "./icons";
import { Icon } from "./icons";
import styles from "./option-tile.module.css";

export function OptionTile({
  label,
  icon,
  checked,
  onChange,
}: {
  label: string;
  icon: IconName;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={styles.tile} data-checked={checked}>
      <input
        type="checkbox"
        className="visually-hidden"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <Icon name={icon} size={32} />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
