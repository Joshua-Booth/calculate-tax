# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People working in New Zealand who want to know what they'll actually take home. They have a gross figure from a job offer, a payslip, a pay rise or a second job, as an hourly rate, a weekly, fortnightly or monthly amount, or a yearly salary. They want the net number, with the deductions that apply to them.

A second audience looks at the site as Joshua Booth's work, such as people hiring. The footer credits him, and `/storybook` shows every component with play tests, accessibility checks and links to its Figma frame. They come second. Nothing done for them may cost the person working out their pay.

## Product Purpose

Calculate Tax works out take-home pay in New Zealand: PAYE income tax, the ACC earners' levy, KiwiSaver, student loan repayments and the independent earner tax credit, with secondary tax codes for a second job. It uses the current tax year's Inland Revenue rates (2026–27).

Success is someone entering their income, ticking what applies, and getting a take-home figure they trust, with each deduction shown, for whatever period they think in.

## Positioning

What it offers over IRD's own calculator and the ad-supported ones:

- **Nothing in the way.** No ads, no accounts, no data collection. The codebase has no analytics or storage.
- **Carefully made and accessible.** The design and the build quality are the difference: it works at every screen width, by keyboard and with a screen reader, and is tested to prove it.

## Operating Context

- One page, built as a static export and hosted on Netlify. Storybook is served at `/storybook`.
- Three layouts. On a phone, Details and Results are two tabs. On a tablet, the same tabs sit in a centred card. From 1200px, Details and Results sit side by side and the results update as you type.
- The rates change each 1 April. The yearly update to `src/lib/tax.ts`, with its IRD sources and the tests that pin worked examples, is part of keeping the product working.
- Design lives in a private Figma file. Each story links to its frame.
- History: designed in March 2020 as an Instagram post, one mobile screen with a Results tab that was never drawn. In 2026 the design was tidied in Figma, the missing screens and a desktop layout were designed, and it was rebuilt in Next.js.

## Capabilities and Constraints

**Does now:**

- Income per hour, week, fortnight, month or year.
- Options: ACC levy (on by default), KiwiSaver, Secondary income, Student loan, Tax credits.
- Advanced settings: KiwiSaver rate (3%, 3.5% default, 4%, 6%, 8% or 10%), hours a week (40 until set) to convert hourly pay, and a secondary tax code (SB, S, SH, ST, SA).
- Works out the tax code from the options, with an explainer.
- Results: take-home pay with a second figure for scale, a breakdown bar and a row per deduction, shown per any period.

**Constraints:**

- It stays one calculator. New features stay inside the take-home pay job. Comparing offers, contractor or schedular pay, self-employment and past tax years are out of scope.
- Every rate cites its Inland Revenue page. A rate changes only with its IRD source. `src/lib` stays at 100% test coverage and imports no UI.
- It's an estimate. It works on a year's income, and payroll rounds each pay, so a real payslip can differ by a few cents. The results say so, and say it's not financial advice.
- Static site: no server, no accounts, nothing stored about the user.
- New Zealand English (`lang="en-NZ"`, cspell).
- Terms follow IRD: take-home pay, gross income, PAYE income tax, ACC earners' levy, KiwiSaver, student loan, independent earner tax credit (IETC), secondary income, tax code.

## Brand Commitments

- Name: Calculate Tax.
- Credit: "Designed and built by Joshua Booth", linking to joshuabooth.nz.
- Licence: all rights reserved. The code isn't open source.
- Voice, read from the shipped copy (not separately confirmed): plain New Zealand English, short sentences, sentence case, second person ("Your take-home pay", "Enter your details"). It is honest about limits: "An estimate", "Not financial advice".

## Evidence on Hand

- Rates and their IRD citations: `src/lib/tax.ts`, summarised in the README's rates table.
- Worked examples pinned in `src/lib/tax.test.ts`, and every combination of options and codes in `src/lib/tax.matrix.test.ts`.
- Assets: the 2020 background art (`public/background.webp`) and the site icon (`src/app/icon.svg`).
- The private Figma file, linked from each story.
- None of these exist, and none may be invented: user numbers, usage analytics, testimonials, reviews, press, or endorsement by Inland Revenue.

## Product Principles

1. **The number comes first.** People come for their take-home pay. Get them there with the fewest inputs, then show how it was reached.
2. **Trust comes from sources, not claims.** Every rate traces to Inland Revenue, and the product is plain about being an estimate.
3. **Nothing in the way.** No ads, accounts, tracking or paid tier, and no showcase flourish that slows the task down.
4. **Craft is the difference.** Every screen width, every input method and every screen reader gets the same care.
5. **One job, kept current.** Features stay inside take-home pay. The yearly April rates update is part of the product.

## Accessibility & Inclusion

- WCAG 2.2 AA. axe runs on every story and in the end-to-end tests.
- Every width from 320px to 1920px is checked for overflow and clipped text.
- Keyboard: the phone tabs follow the tabs pattern, settings is a modal dialog, and Calculate moves focus to the results heading.
- Screen readers: the take-home figure is announced once typing settles, and the breakdown bar has a text alternative.
- Motion respects `prefers-reduced-motion`.
