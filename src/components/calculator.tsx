"use client";

import { useDeferredValue, useId, useRef, useState } from "react";

import type { Inputs, Period, SecondaryCode } from "@/lib/tax";
import {
  formatAmountInput,
  formatMoney,
  formatPercent,
  formatWholeMoney,
  HOURS_PER_WEEK,
  parseAmount,
  parseHours,
  PER_PERIOD,
  PERIOD_LABEL,
} from "@/lib/format";
import {
  calculate,
  KIWISAVER_DEFAULT,
  PERIODS,
  perPeriod,
  TAX_YEAR,
  taxCode,
} from "@/lib/tax";

import type { IconName } from "./icons";
import { Button } from "./button";
import styles from "./calculator.module.css";
import { IncomeField, TaxCodeField } from "./field";
import { Icon } from "./icons";
import { OptionTile } from "./option-tile";
import { Results } from "./results";
import { SegmentedControl } from "./segmented-control";
import { SettingsDialog } from "./settings-dialog";

type OptionKey =
  "acc" | "kiwiSaver" | "secondary" | "studentLoan" | "taxCredits";
type Tab = "details" | "results";

const OPTIONS: { key: OptionKey; label: string; icon: IconName }[] = [
  { key: "acc", label: "ACC levy", icon: "stethoscope" },
  { key: "kiwiSaver", label: "KiwiSaver", icon: "wallet" },
  { key: "secondary", label: "Secondary income", icon: "travel-case" },
  { key: "studentLoan", label: "Student loan", icon: "education" },
  { key: "taxCredits", label: "Tax credits", icon: "currency-dollar" },
];
const PERIOD_OPTIONS = PERIODS.map((value) => ({
  value,
  label: PERIOD_LABEL[value],
}));

// `year` comes from the page at build time, so the footer stays current without a client clock
export default function Calculator({ year }: { year: number }) {
  const [incomeText, setIncomeText] = useState("");
  const [period, setPeriod] = useState<Period>("year");
  const [shownChoice, setShownChoice] = useState<Period | null>(null);
  const [options, setOptions] = useState<Record<OptionKey, boolean>>({
    acc: true,
    kiwiSaver: false,
    secondary: false,
    studentLoan: false,
    taxCredits: false,
  });
  const [kiwiSaverRate, setKiwiSaverRate] = useState(KIWISAVER_DEFAULT);
  const [hoursText, setHoursText] = useState(String(HOURS_PER_WEEK.fallback));
  const [secondaryCode, setSecondaryCode] = useState<SecondaryCode>("S");
  const [tab, setTab] = useState<Tab>("details");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const detailsTabId = useId();
  const resultsTabId = useId();
  const detailsPanelId = useId();
  const resultsPanelId = useId();
  const tabIds = { details: detailsTabId, results: resultsTabId };
  const panelIds = { details: detailsPanelId, results: resultsPanelId };

  // Until the hours are valid, the sums use a 40-hour week (the dialog says so)
  const hoursPerWeek = parseHours(hoursText) ?? HOURS_PER_WEEK.fallback;
  const income = parseAmount(incomeText);
  const inputs: Inputs = {
    income,
    period,
    hoursPerWeek,
    kiwiSaverRate,
    secondaryCode,
    ...options,
  };
  const annual = calculate(inputs);
  const shown = shownChoice ?? period;
  const breakdown = perPeriod(annual, shown, hoursPerWeek);
  // A second figure for scale: a week for a year or month, a year for a week or hour
  const companionPeriod: Period =
    shown === "year" || shown === "month" ? "week" : "year";
  const companion = `about ${formatWholeMoney(perPeriod(annual, companionPeriod, hoursPerWeek).takeHome)} ${PER_PERIOD[companionPeriod]}`;
  const code = taxCode(inputs, annual.gross);
  const hasIncome = annual.gross > 0;
  // Announced to screen readers once typing settles, rather than on every key
  const announcement = useDeferredValue(
    hasIncome
      ? `Take-home pay ${formatMoney(breakdown.takeHome)} ${PER_PERIOD[shown]}`
      : ""
  );

  const summary = [
    options.kiwiSaver ? `KiwiSaver ${formatPercent(kiwiSaverRate)}` : null,
    options.secondary ? `Code ${secondaryCode}` : null,
    `${hoursPerWeek} hours a week`,
  ]
    .filter(Boolean)
    .join(" · ");

  function showResults() {
    setTab("results");
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0 });
      resultsHeadingRef.current?.focus();
    });
  }

  function formatIncome() {
    if (incomeText === "") return;
    const n = parseAmount(incomeText);
    setIncomeText(n > 0 ? formatAmountInput(n) : "");
  }

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <span className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            <Icon name="calculator" />
          </span>
          Calculate Tax
        </span>
        <span className={styles.chip}>
          {TAX_YEAR}
          <span className={styles.chipLong}> tax year</span>
        </span>
      </header>

      <main className={styles.card} data-tab={tab}>
        <section
          id={panelIds.details}
          className={styles.details}
          role="tabpanel"
          aria-labelledby={tabIds.details}
        >
          <div className={styles.heading}>
            <h1 className={styles.title}>Tax Calculator</h1>
            <p className={styles.subtitle}>Enter your details</p>
          </div>
          <div className={styles.fields}>
            <IncomeField
              value={incomeText}
              onChange={setIncomeText}
              onBlur={formatIncome}
            />
            <TaxCodeField code={code} />
          </div>
          <SegmentedControl
            legend="Income is per"
            name="income-period"
            options={PERIOD_OPTIONS}
            value={period}
            onChange={setPeriod}
          />
          <fieldset className={styles.options}>
            <legend className={styles.optionsHeading}>
              Select all that apply
            </legend>
            <div className={styles.tiles}>
              {OPTIONS.map((o) => (
                <OptionTile
                  key={o.key}
                  label={o.label}
                  icon={o.icon}
                  checked={options[o.key]}
                  onChange={(checked) =>
                    setOptions((prev) => ({ ...prev, [o.key]: checked }))
                  }
                />
              ))}
            </div>
          </fieldset>
          <div className={styles.actions}>
            <Button
              icon="calculator"
              className={styles.calculate}
              onClick={showResults}
            >
              Calculate
            </Button>
            <Button
              variant="secondary"
              icon="cog"
              onClick={() => dialogRef.current?.showModal()}
            >
              <span className={styles.longLabel}>Advanced settings</span>
              <span className={styles.shortLabel}>Settings</span>
            </Button>
            <span className={styles.summary}>{summary}</span>
          </div>
        </section>

        <section
          id={panelIds.results}
          className={styles.results}
          role="tabpanel"
          aria-labelledby={tabIds.results}
        >
          <Results
            breakdown={breakdown}
            inputs={inputs}
            shown={shown}
            onShownChange={setShownChoice}
            hasIncome={hasIncome}
            companion={companion}
            headingRef={resultsHeadingRef}
          />
        </section>

        <div className={styles.tabs} role="tablist" aria-label="Calculator">
          {(["details", "results"] as const).map((t) => (
            <button
              key={t}
              id={tabIds[t]}
              type="button"
              role="tab"
              aria-selected={tab === t}
              aria-controls={panelIds[t]}
              className={styles.tab}
              onClick={() => (t === "results" ? showResults() : setTab(t))}
            >
              {t === "details" ? "Details" : "Results"}
            </button>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        © {year} Designed and built by{" "}
        <a className={styles.footerLink} href="https://joshuabooth.nz">
          Joshua Booth
        </a>
      </footer>

      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>

      <SettingsDialog
        dialogRef={dialogRef}
        kiwiSaverRate={kiwiSaverRate}
        onKiwiSaverRateChange={setKiwiSaverRate}
        hoursText={hoursText}
        onHoursChange={setHoursText}
        secondaryCode={secondaryCode}
        onSecondaryCodeChange={setSecondaryCode}
      />
    </div>
  );
}
