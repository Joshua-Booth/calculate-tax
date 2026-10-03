"use client";

import { useDeferredValue, useId, useRef, useState } from "react";

import { a11y } from "@/styles/shared";
import { sx } from "@/styles/sx";
import {
  breakpoints,
  colors,
  fonts,
  radii,
  shadows,
  space,
  strokes,
} from "@/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

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
import { IncomeField, TaxCodeField } from "./field";
import { Icon } from "./icons";
import { OptionTile } from "./option-tile";
import { Results } from "./results";
import { SegmentedControl } from "./segmented-control";
import { SettingsDialog } from "./settings-dialog";

// Three layouts:
// phone (under 640px): full-bleed white, Details and Results as tabs
// tablet (640 to 1199px): a centred card on the 2020 background art, still with tabs
// desktop (1200px and up): the card splits into Details and Results side by side
// Desktop starts at 1200px because below that the Details pane is too narrow for five tiles.
const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: { default: space.s24, [breakpoints.desktop]: space.s32 },
    minHeight: "100vh",
    paddingTop: { default: space.s16, [breakpoints.tabletUp]: space.s40 },
    paddingInline: {
      default: space.s24,
      [breakpoints.desktopNarrow]: space.s40,
      [breakpoints.desktopWide]: 80,
    },
    paddingBottom: 0,
    // From tablet up, the card sits on the 2020 background art
    backgroundColor: { default: null, [breakpoints.tabletUp]: colors.bgPage },
    backgroundImage: {
      default: null,
      [breakpoints.tabletUp]: 'url("/background.webp")',
    },
    backgroundPosition: "50% -260px",
    backgroundSize: "max(1440px, 100%) auto",
    backgroundRepeat: "no-repeat",
  },
  top: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.s16,
    width: "100%",
    maxWidth: { default: 1280, [breakpoints.tablet]: 640 },
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: { default: space.s8, [breakpoints.tabletUp]: space.s12 },
    fontSize: { default: 14, [breakpoints.tabletUp]: 16 },
    lineHeight: { default: "20px", [breakpoints.tabletUp]: "24px" },
    fontWeight: 700,
  },
  mark: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    width: { default: 28, [breakpoints.tabletUp]: 40 },
    height: { default: 28, [breakpoints.tabletUp]: 40 },
    borderRadius: { default: radii.sm, [breakpoints.tabletUp]: radii.md },
    backgroundColor: colors.accentFill,
    color: colors.iconOnAccent,
  },
  markIcon: {
    width: { default: 20, [breakpoints.tabletUp]: 24 },
    height: { default: 20, [breakpoints.tabletUp]: 24 },
  },
  // White with a hairline border: accent text on the lilac tint was 4.4:1, under AA
  chip: {
    paddingBlock: space.s4,
    paddingInline: space.s12,
    borderWidth: strokes.thin,
    borderStyle: "solid",
    borderColor: colors.borderSubtle,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceCard,
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 700,
    color: colors.textAccent,
    whiteSpace: "nowrap",
  },
  chipLong: {
    display: { default: "none", [breakpoints.tabletUp]: "inline" },
  },
  card: {
    display: "grid",
    gridTemplateColumns: {
      default: null,
      [breakpoints.desktop]: "minmax(0, 11fr) minmax(0, 9fr)",
    },
    width: "100%",
    maxWidth: { default: 1280, [breakpoints.tablet]: 640 },
    borderRadius: { default: null, [breakpoints.tabletUp]: radii.xxl },
    backgroundColor: colors.surfaceCard,
    boxShadow: { default: null, [breakpoints.tabletUp]: shadows.card },
    overflow: { default: null, [breakpoints.tabletUp]: "clip" },
  },
  pane: {
    display: "flex",
    flexDirection: "column",
    gap: space.s24,
    minWidth: 0,
    paddingTop: {
      default: 0,
      [breakpoints.tablet]: space.s40,
      [breakpoints.desktop]: space.s48,
    },
    paddingInline: {
      default: 0,
      [breakpoints.tablet]: space.s40,
      [breakpoints.desktop]: space.s48,
    },
    paddingBottom: { default: 0, [breakpoints.desktop]: space.s48 },
  },
  // Below desktop only the selected tab's pane shows; on desktop both do
  paneHidden: {
    display: { default: "none", [breakpoints.desktop]: "flex" },
  },
  details: {
    gap: { default: space.s24, [breakpoints.desktop]: space.s32 },
  },
  results: {
    backgroundColor: {
      default: null,
      [breakpoints.desktop]: colors.surfaceSubtle,
    },
  },
  heading: {
    display: "grid",
    gap: space.s4,
  },
  title: {
    fontFamily: fonts.heavy,
    fontSize: { default: 36, [breakpoints.desktop]: 56 },
    lineHeight: { default: "44px", [breakpoints.desktop]: "64px" },
    fontWeight: 800,
    letterSpacing: { default: "-0.005em", [breakpoints.desktop]: "-0.01em" },
  },
  subtitle: {
    fontSize: { default: null, [breakpoints.desktop]: 18 },
    lineHeight: { default: null, [breakpoints.desktop]: "26px" },
    color: colors.textSecondary,
  },
  fields: {
    display: "flex",
    gap: space.s12,
  },
  options: {
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
  },
  optionsHeading: {
    float: "left",
    width: "100%",
    marginBottom: space.s12,
    padding: 0,
    fontSize: 20,
    lineHeight: "28px",
    fontWeight: 700,
  },
  // Explicit columns: three and two on phones, as in the design, then all five
  // in a row, so the tiles never leave one on its own
  tiles: {
    clear: "both",
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(3, minmax(0, 1fr))",
      [breakpoints.fiveTiles]: "repeat(5, minmax(0, 1fr))",
    },
    // A two-line label can make a tile taller than square; every row matches it
    gridAutoRows: "1fr",
    gap: space.s12,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: space.s12,
    columnGap: space.s16,
  },
  // Results are always in view on desktop, so Calculate isn't needed there
  calculate: {
    display: { default: "inline-flex", [breakpoints.desktop]: "none" },
    flexGrow: { default: 1, [breakpoints.tabletUp]: 0 },
    flexShrink: 1,
    flexBasis: { default: 160, [breakpoints.tabletUp]: "auto" },
  },
  longLabel: {
    display: { default: "none", [breakpoints.tabletUp]: "inline" },
  },
  shortLabel: {
    display: { default: null, [breakpoints.tabletUp]: "none" },
  },
  summary: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: { default: "100%", [breakpoints.tabletUp]: 200 },
    fontSize: 14,
    lineHeight: "20px",
    color: colors.textSecondary,
  },
  tabs: {
    position: "sticky",
    bottom: 0,
    display: { default: "flex", [breakpoints.desktop]: "none" },
    justifyContent: "center",
    gap: space.s16,
    marginTop: { default: space.s24, [breakpoints.tabletUp]: space.s32 },
    paddingTop: space.s12,
    paddingInline: 0,
    paddingBottom: {
      default: `calc(${space.s12} + env(safe-area-inset-bottom))`,
      [breakpoints.tabletUp]: `calc(${space.s16} + env(safe-area-inset-bottom))`,
    },
    backgroundColor: colors.surfaceCard,
  },
  tab: {
    width: 120,
    minHeight: 44,
    paddingTop: 0,
    paddingInline: 0,
    paddingBottom: space.s8,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomStyle: "solid",
    borderBottomColor: colors.borderSubtle,
    backgroundColor: "transparent",
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 700,
    color: colors.textSecondary,
    cursor: "pointer",
  },
  tabSelected: {
    borderBottomColor: colors.accentFill,
    color: colors.textPrimary,
  },
  footer: {
    paddingBottom: space.s24,
    fontSize: 14,
    lineHeight: "20px",
    color: colors.textSecondary,
    textAlign: "center",
  },
  footerLink: {
    fontWeight: 700,
    color: colors.textAccent,
    textDecorationLine: "underline",
    textDecorationThickness: { default: "auto", ":hover": "2px" },
    textUnderlineOffset: "2px",
  },
});

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
    <div {...stylex.props(styles.page)}>
      <header {...stylex.props(styles.top)}>
        <span {...stylex.props(styles.brand)}>
          <span {...stylex.props(styles.mark)} aria-hidden="true">
            <Icon name="calculator" xstyle={styles.markIcon} />
          </span>
          Calculate Tax
        </span>
        <span {...stylex.props(styles.chip)}>
          {TAX_YEAR}
          <span {...stylex.props(styles.chipLong)}> tax year</span>
        </span>
      </header>

      <main {...stylex.props(styles.card)}>
        <section
          id={panelIds.details}
          {...stylex.props(
            styles.pane,
            styles.details,
            tab !== "details" && styles.paneHidden
          )}
          role="tabpanel"
          aria-labelledby={tabIds.details}
        >
          <div {...stylex.props(styles.heading)}>
            <h1 {...stylex.props(styles.title)}>Tax Calculator</h1>
            <p {...stylex.props(styles.subtitle)}>Enter your details</p>
          </div>
          <div {...stylex.props(styles.fields)}>
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
          <fieldset {...stylex.props(styles.options)}>
            <legend {...stylex.props(styles.optionsHeading)}>
              Select all that apply
            </legend>
            <div {...stylex.props(styles.tiles)}>
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
          <div {...stylex.props(styles.actions)}>
            <Button
              icon="calculator"
              xstyle={styles.calculate}
              onClick={showResults}
            >
              Calculate
            </Button>
            <Button
              variant="secondary"
              icon="cog"
              onClick={() => dialogRef.current?.showModal()}
            >
              <span {...stylex.props(styles.longLabel)}>Advanced settings</span>
              <span {...stylex.props(styles.shortLabel)}>Settings</span>
            </Button>
            <span {...stylex.props(styles.summary)}>{summary}</span>
          </div>
        </section>

        <section
          id={panelIds.results}
          {...stylex.props(
            styles.pane,
            styles.results,
            tab !== "results" && styles.paneHidden
          )}
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

        <div
          {...stylex.props(styles.tabs)}
          role="tablist"
          aria-label="Calculator"
        >
          {(["details", "results"] as const).map((t) => (
            <button
              key={t}
              id={tabIds[t]}
              type="button"
              role="tab"
              aria-selected={tab === t}
              aria-controls={panelIds[t]}
              {...stylex.props(styles.tab, tab === t && styles.tabSelected)}
              onClick={() => (t === "results" ? showResults() : setTab(t))}
            >
              {t === "details" ? "Details" : "Results"}
            </button>
          ))}
        </div>
      </main>

      <footer {...stylex.props(styles.footer)}>
        © {year} Designed and built by{" "}
        <a {...stylex.props(styles.footerLink)} href="https://joshuabooth.nz">
          Joshua Booth
        </a>
      </footer>

      <p {...sx("visually-hidden", a11y.visuallyHidden)} aria-live="polite">
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
