# Calculate Tax

[![Netlify Status](https://api.netlify.com/api/v1/badges/5dd901ac-5ae2-435d-863e-f7c4c9337a05/deploy-status)](https://app.netlify.com/projects/calculatetax/deploys)
[![CI](https://github.com/Joshua-Booth/calculate-tax/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/Joshua-Booth/calculate-tax/actions/workflows/ci.yml)

Work out your take-home pay in New Zealand: income tax, the ACC earners' levy,
KiwiSaver, student loan repayments and the independent earner tax credit, using
2026–27 rates from Inland Revenue.

I designed it in March 2020 as an Instagram post: one mobile screen, with a
Results tab that was never drawn. In 2026 I tidied the design in Figma, designed
the missing screens and a desktop layout, and built it as this site.

## How it works

- `src/lib/tax.ts` holds the tax rules as plain functions with no UI. Every rate
  cites its Inland Revenue page. It works on a year's income, so it's an
  estimate: payroll rounds each pay, which can move the total by a few cents.
- `src/components` is the UI. It's styled with [StyleX](https://stylexjs.com),
  compiled to static CSS at build time, and the design tokens live in
  `src/styles/tokens.stylex.ts`.
- On desktop, Details and Results sit side by side and update as you type. On a
  phone they're two tabs, as in the 2020 design.
- The site is a static export (`out/`), hosted on Netlify.

## Run it

This project uses [mise](https://mise.jdx.dev) for Node, pnpm and every task.

```sh
mise install        # Node 24 and pnpm
pnpm install
mise run dev        # http://localhost:3000
mise run check      # every CI check
```

| Task                 | What it does                                                 |
| -------------------- | ------------------------------------------------------------ |
| `mise run build`     | Builds the static site into `out/`                           |
| `mise run preview`   | Serves the build on port 4173                                |
| `mise run test`      | Unit tests, including every combination of options and codes |
| `mise run coverage`  | Unit tests with coverage; `src/lib` must stay at 100%        |
| `mise run test:e2e`  | Browser tests and a width sweep from 320px to 1920px         |
| `mise run lint`      | ESLint, with fixes                                           |
| `mise run format`    | Prettier                                                     |
| `mise run stylelint` | Stylelint                                                    |
| `mise run typecheck` | TypeScript for the app and the config files                  |
| `mise run knip`      | Unused files, exports and dependencies                       |
| `mise run depcruise` | Dependency rules, including that `src/lib` stays UI-free     |
| `mise run spell`     | cspell, in New Zealand English                               |
| `mise run audit`     | High-severity advisories                                     |

The lint, format, commit and CI setup follows my
[creact](https://github.com/Joshua-Booth/creact) template, adapted for Next.js.
Commits use Conventional Commits, checked by commitlint.

## Rates (2026–27)

| Rule                          | Value                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------- |
| Income tax                    | 10.5% to $15,600, 17.5% to $53,500, 30% to $78,100, 33% to $180,000, 39% over |
| ACC earners' levy             | 1.75%, on earnings up to $156,641                                             |
| Student loan                  | 12% over $24,128 a year; 12% of all income from a second job                  |
| KiwiSaver                     | 3.5% default from 1 April 2026; 3%, 4%, 6%, 8% or 10%                         |
| Independent earner tax credit | $520 a year from $24,000 to $66,000, less 13c a dollar to $70,000             |
| Secondary tax codes           | SB 10.5%, S 17.5%, SH 30%, ST 33%, SA 39%                                     |

When the rates change, update `src/lib/tax.ts` with the new IRD source, then the
tests that pin the worked examples.

## Licence

© 2020–2026 Joshua Booth. All rights reserved. The code isn't open source, so
please ask before reusing it.

The Lato font is © tyPoland Lukasz Dziedzic, under the SIL Open Font License
1.1. See `src/app/fonts/README.md`.
