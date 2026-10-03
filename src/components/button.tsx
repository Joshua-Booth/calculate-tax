import type { ButtonHTMLAttributes, ReactNode } from "react";

import type { IconName } from "./icons";
import styles from "./button.module.css";
import { Icon } from "./icons";

export function Button({
  variant = "primary",
  icon,
  children,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  icon?: IconName;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
      {...props}
    >
      {icon !== undefined && <Icon name={icon} size={20} />}
      {children}
    </button>
  );
}
