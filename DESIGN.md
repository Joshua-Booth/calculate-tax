---
name: Calculate Tax
description: Work out your New Zealand take-home pay.
colors:
  bg-page: "#f2f4f8"
  surface-card: "#fff"
  surface-subtle: "#f7f6fc"
  surface-tint: "#eeedf8"
  text-primary: "#272d2d"
  text-secondary: "#6b6b76"
  text-accent: "#6a63b8"
  text-on-accent: "#fff"
  text-danger: "#ca3131"
  accent-fill: "#6a63b8"
  accent-hover: "#5d56a8"
  accent-brand: "#9b96cf"
  border-field: "#928ea3"
  border-subtle: "#e6e4ee"
  border-focus: "#6a63b8"
  icon-default: "#6b6b76"
  icon-accent: "#6a63b8"
  icon-on-accent: "#fff"
  chart-take-home: "#6a63b8"
  chart-paye: "#9b96cf"
  chart-acc: "#c9c5ea"
  chart-kiwisaver: "#45b5bb"
  chart-student-loan: "#5d94cc"
typography:
  display:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: "64px"
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "64px"
    fontWeight: 900
    lineHeight: 1.125
    letterSpacing: "-0.02em"
    fontFeature: '"tnum"'
  title:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "28px"
  field-label:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 800
    lineHeight: "24px"
  body:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-strong:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "24px"
  label:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: "20px"
  small:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  overline:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "16px"
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
  full: "9999px"
spacing:
  s4: "4px"
  s8: "8px"
  s12: "12px"
  s16: "16px"
  s20: "20px"
  s24: "24px"
  s32: "32px"
  s40: "40px"
  s48: "48px"
  s64: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent-fill}"
    textColor: "{colors.text-on-accent}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-accent}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-subtle}"
  input-field:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "48px"
  option-tile:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "12px 8px"
  option-tile-checked:
    backgroundColor: "{colors.accent-fill}"
    textColor: "{colors.text-on-accent}"
  segmented-track:
    backgroundColor: "{colors.surface-tint}"
    rounded: "{rounded.full}"
    padding: "4px"
  segment:
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "36px"
  segment-selected:
    backgroundColor: "{colors.accent-fill}"
    textColor: "{colors.text-on-accent}"
  chip-tax-year:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.xxl}"
    padding: "48px"
  results-pane:
    backgroundColor: "{colors.surface-subtle}"
    padding: "48px"
  dialog:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "24px"
    width: "480px"
  tab:
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    width: "120px"
    height: "44px"
  tab-selected:
    textColor: "{colors.text-primary}"
  brand-mark:
    backgroundColor: "{colors.accent-fill}"
    textColor: "{colors.icon-on-accent}"
    rounded: "{rounded.md}"
    size: "40px"
---

# Design System: Calculate Tax

## Overview

**Creative North Star: "The Friendly Payslip"**

Tax made calm and readable. One soft white card holds the whole job: the details you give on one side, and on the other a big plain take-home figure with every deduction listed under it, line by line, like a payslip you can actually read. The card floats on a pale lilac-to-sky haze, the background art from the 2020 design. That haze is the only atmosphere in the system. Inside the card everything is white, lilac and near-black.

It should feel calm, friendly and a little playful. Corners are generous, the palette is soft, and Lato carries all the type: Heavy for the title and field labels, Black for the one number that matters. Controls are tactile. Option tiles sit slightly raised and fill with Dusk Lilac and a lilac glow when they're on, so what you've ticked shows at a glance. Density is low: each screen asks for a handful of things and gives one answer.

The design began in March 2020 as a single mobile screen for Instagram, and the phone layout still follows it, with Details and Results as two tabs and the tiles three over two. Tablet and desktop extend that screen rather than replace it.

**Key Characteristics:**

- One white card on a lilac-to-sky haze. On desktop it splits into Details and a lavender-washed Results pane.
- One accent, Dusk Lilac, for every action, selection, label and the take-home total.
- Lato throughout, from Regular to Black, with Heavy for the title and field labels.
- Soft, raised, pressable controls that glow lilac when they're on.
- Money in tabular figures, to the cent, right-aligned in the breakdown.

## Colors

White and lilac with one strong accent, a green-tinged near-black for text, and three extra hues that exist only to tell the deductions apart.

### Primary

- **Dusk Lilac** (accent-fill; also text-accent, border-focus, icon-accent, chart-take-home): the one accent. It fills the primary button, checked tiles, the selected segment, the brand mark and the selected tab's underline. As text it marks field labels, legends, the tax-year chip, the footer link and the take-home total. As a stroke it draws the focused field and the secondary button's outline. It holds 5.13:1 on white and 4.78:1 on Lavender Wash.
- **Deep Dusk Lilac** (accent-hover): the primary button's hover, and nothing else.

### Secondary

- **Soft Lavender** (accent-brand; also chart-paye): the 2020 brand colour (#9b96d0, now #9b96cf), kept as a supporting tone. It's the hover border on option tiles and the PAYE segment of the breakdown. At 2.74:1 on white it never carries text.

### Tertiary

Breakdown series, for data only:

- **Pale Lavender** (chart-acc): the ACC earners' levy.
- **Harbour Teal** (chart-kiwisaver): KiwiSaver.
- **Cornflower** (chart-student-loan): student loan repayments.

### Neutral

- **Morning Haze** (bg-page): the page colour under the background art, from 640px up. Phones are plain white.
- **Card White** (surface-card): the card, fields, unchecked tiles, the dialog, the popover and the tab bar.
- **Lavender Wash** (surface-subtle): the desktop Results pane, and the hover fill for secondary and close buttons.
- **Lilac Tint** (surface-tint): the segmented control's track.
- **Ink** (text-primary): headings, values and typed text. A near-black with a hint of green-grey. The darkest colour in the system.
- **Slate** (text-secondary, icon-default): subtitles, hints, unselected labels, the footnote, and icons at rest.
- **Field Grey** (border-field): the 1.5px border of fields and selects at rest (3.17:1 on white).
- **Hairline** (border-subtle): row dividers, unchecked tile borders, the chip outline, the unselected tab underline and the stuck tab bar's edge.
- **Error Red** (text-danger): an invalid field's border and its message. Errors only.

### Named Rules

**The One Voice Rule.** Dusk Lilac is the only colour that means "act" or "chosen". There is no second accent, and the series hues never appear on controls.

**The Series Rule.** Each deduction owns one series colour, used for its segment in the bar and its swatch in the row, and nowhere else.

**The Lavender Isn't Text Rule.** Soft Lavender and Pale Lavender are too light for text on white. Text in the lilac family is Dusk Lilac, and never on Lilac Tint, where it drops to 4.43:1. That's why the tax-year chip is white with a hairline instead of tinted.

## Typography

**Display Font:** Lato Heavy (800), self-hosted, falling back to Lato, system-ui and sans-serif
**Body Font:** Lato (400, 700, 900), with system-ui and sans-serif

**Character:** One family does all the work. Lato's rounded, warm shapes keep the heavy weights friendly, and the jump from Regular to Heavy and Black gives the hierarchy without a second face.

### Hierarchy

- **Display** (800, 56px/64px, -0.01em; 36px/44px and -0.005em under 1200px): the page title, "Tax Calculator". One per page.
- **Figure** (900, up to 64px, line height 1.125, -0.02em, tabular): the take-home amount. It scales with its container, at `min(64px, 100cqi ÷ (characters × 0.62))`, so a long amount never wraps or overflows.
- **Title** (700, 20px/28px): section and dialog headings, such as "Select all that apply" and "Advanced settings".
- **Field label** (800, 16px/24px, Dusk Lilac): labels above fields, such as "Income" and "Tax code".
- **Body** (400, 16px/24px): running text and the per-period line under the figure. The subtitle steps up to 18px/26px on desktop.
- **Body strong** (700, 16px/24px): button text, typed values and breakdown values.
- **Label** (700, 14px/20px): legends (in Dusk Lilac), segments, tiles, tabs and the chip. Tiles and segments drop to 13px on the narrowest phones.
- **Small** (400, 14px/20px, Slate): the footnote, hints, the settings summary and the footer.
- **Overline** (700, 12px/16px, 0.08em, uppercase, Slate): "Your take-home pay". The only uppercase text.

### Named Rules

**The Weight Ladder Rule.** Hierarchy comes from weight, not new faces: 400 to read, 700 for anything you act on or read as a value, 800 for the title and field labels, and 900 for the take-home figure alone.

**The Tabular Money Rule.** Every amount of money uses tabular figures and never wraps. In the breakdown, amounts sit right-aligned and deductions carry a true minus sign (−$17,927.50).

## Layout

Three layouts, on breakpoints whose ranges don't overlap, so no style depends on media query order:

- **Phone (under 640px):** full-bleed white with 24px side padding and no card. Details and Results are two tabs. The tab bar sticks to the bottom of a screen too short for the pane, and gains a hairline and a soft shadow while stuck. Tiles run three over two.
- **Tablet (640px to 1199px):** a card up to 640px wide, centred on the haze, with 40px inside. The tabs stay.
- **Desktop (1200px and up):** a card up to 1280px wide, split 11:9 into Details and Results, 48px inside each. Results update as you type, so the Calculate button and the tabs go. The page has 40px side padding up to 1359px and 80px from 1360px.

All five tiles sit in one row from 540px. Below 380px, segment padding and type step down by a pixel or two so all five periods still fit.

Spacing runs on a 4px scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64). Blocks in a pane are 24px apart (32px in desktop Details). Related controls such as fields and tiles are 12px apart. A label sits 8px above its control, and a subtitle 4px under its heading.

A slim header sits above the card at its width: the brand mark and name on the left, the tax-year chip on the right. The credit sits centred below the card.

**The Every Width Rule.** Every width from 320px to 1920px renders without overflow or clipped text. On small phones, padding and type shrink a step before any content is dropped.

## Elevation & Depth

A hybrid. The card lifts off the haze on a wide, cool shadow, the tiles sit slightly raised inside it, and things that are on glow lilac. Shadows are part of the softness, not only a state signal, so any raised surface can use one, from the vocabulary below.

### Shadow Vocabulary

- **Card** (`box-shadow: 0 24px 64px rgba(133, 140, 166, 0.28)`): the card from 640px up, the settings dialog and the tax code popover. Wide, cool and diffuse.
- **Raised** (`box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)`): option tiles at rest. Just enough to say "press me".
- **Accent glow** (`box-shadow: 0 8px 24px rgba(106, 99, 184, 0.32)`): the primary button and checked tiles. Lilac, not grey.
- **Docked** (`box-shadow: 0 -8px 16px -8px rgba(133, 140, 166, 0.32)`): the phone tab bar while it's stuck over scrolling content, paired with a 1px Hairline above it.
- **Focus ring** (`box-shadow: 0 0 0 4px rgba(106, 99, 184, 0.22)`): a soft halo around a focused field, while its border turns 2px Dusk Lilac.

Modal backdrops dim with Ink: 32% under the dialog and 24% under the popover, because the popover is a hint, not a task.

**The Cool Shadow Rule.** Shadows on surfaces are cool grey-lilac, rgba(133, 140, 166), never flat black. The only exception is the tile's faint 8% raise. The accent glow is the only coloured shadow, and it is always Dusk Lilac.

## Shapes

Soft, generous rounding that grows with the surface: 12px for buttons, fields, selects and the brand mark (8px for the mark on phones), 16px for option tiles, 24px for the dialog and popover, and 32px for the card. Tracks, tags and dots are full pills: the segmented control, the chip, the breakdown bar, its swatches and the round icon buttons.

Strokes are thin. Hairlines are 1px, field and secondary-button borders are 1.5px, and focus is 2px.

Icons are solid, filled glyphs drawn for this design on a 24px grid. They take the text colour: 20px in buttons and fields, 24px in the brand mark, and 32px on tiles.

**The Nested Radius Rule.** Bigger surfaces get bigger radii, and nothing inside the card is rounder than the card except pills.

## Components

Soft and pressable: rounded, slightly raised, and clearly lit up when on.

### Buttons

- **Shape:** gently rounded (12px), 48px tall, 24px side padding, with an optional 20px icon 8px before the text.
- **Primary:** Dusk Lilac fill, white bold text and the accent glow. Hover deepens to Deep Dusk Lilac. One per view: Calculate, which shows below 1200px only.
- **Secondary:** white, with a 1.5px Dusk Lilac outline and Dusk Lilac text. Hover fills with Lavender Wash. Used for "Advanced settings" (shortened to "Settings" on phones) and "Done". The popover's "Got it" is the same style at 44px tall with 20px side padding.
- **Icon buttons:** round and transparent, with a 44px target (dialog close) or 32px (tax code help). Slate icon. Hover fills with Lavender Wash or turns the icon Dusk Lilac.
- **Focus:** the global 2px Dusk Lilac outline, 2px out.

### Chips

- **Style:** the tax-year chip is a white pill with a Hairline border and 14px bold Dusk Lilac text. It reads "2026–27 tax year", shortened to "2026–27" on phones.
- **State:** static. It labels; it doesn't filter.

### Cards / Containers

- **Corner Style:** 32px.
- **Background:** Card White. The desktop Results pane is Lavender Wash.
- **Shadow Strategy:** the Card shadow from 640px up. None on phones, where the page is full bleed.
- **Border:** none.
- **Internal Padding:** 40px on tablets and 48px on desktop. On phones the page padding does the job.
- **Dialog and popover:** the settings dialog is up to 480px wide, the help popover up to 360px. Both are 24px radius with 24px padding, the Card shadow and an Ink backdrop.

### Inputs / Fields

- **Style:** 48px tall, 12px radius, a 1.5px Field Grey border on white. Typed text is bold Ink and the placeholder is Regular Slate. A Slate "$" prefix or a 20px icon leads.
- **Focus:** the border turns 2px Dusk Lilac and the Focus ring appears. The padding gives back the extra half pixel so the text doesn't move.
- **Error:** the border turns Error Red and stays red while focused, with a 14px bold red message below.
- **Selects:** the native arrow is hidden. A 20px chevron sits 12px from the edge, the same inset as the text.
- **Computed value:** the tax code uses the same box, shows the worked-out code, and ends in a help button that opens the popover.

### Navigation

- **Header:** the brand mark (a Dusk Lilac rounded square with a white calculator glyph, 28px on phones and 40px from 640px) beside "Calculate Tax" in bold.
- **Tab bar (under 1200px):** "Details" and "Results", each 120px wide and 44px tall, in 14px bold. A 3px underline is Hairline when unselected and Dusk Lilac when selected, and the text goes from Slate to Ink. The bar sticks to the bottom of the screen, and takes the Docked shadow while stuck.

### Option tiles

The signature control.

- Square checkbox tiles, 16px radius, with a 32px icon over a 14px bold centred label. A two-line label makes the row taller, and every tile in the row matches.
- **Off:** white, Hairline border, Slate icon and text, Raised shadow. Hover turns the border Soft Lavender and the text Ink.
- **On:** Dusk Lilac fill, white icon and text, and the accent glow.
- Background, colour and shadow change over 120ms, or instantly with reduced motion.
- The checkbox is visually hidden, so keyboard focus draws a 2px Dusk Lilac outline 3px outside the tile.

### Segmented control

- A Lilac Tint pill track with 4px inside. Segments hug their text (12px each side, 36px tall), with no dividers. Only the selected segment shows, as a Dusk Lilac pill with white text.
- A 14px bold Dusk Lilac legend sits above it ("Income is per", "Show amounts per").
- The radios are visually hidden, so keyboard focus draws an outline around the pill.

### Breakdown

The payslip itself.

- **Hero:** the overline, the take-home Figure, and a per-period line that adds a second figure for scale ("a year · about $1,064 a week").
- **Bar:** a 16px pill split into series segments with 2px gaps, each as wide as its share and at least 2px wide. It has a text alternative listing each share.
- **Rows:** the label on the left with a 10px series swatch, an optional Slate note (the rate, or "12% over $24,128") pushed right, and the value on the right in bold tabular figures. 12px above and below, with a Hairline between rows.
- **Total:** "Take-home pay" in bold with its value in Dusk Lilac, and no rule under it.
- **Footnote:** Small Slate text under the rows that says what the estimate covers and that it isn't financial advice.

## Do's and Don'ts

### Do:

- **Do** take every colour, space, radius, stroke and shadow from `src/styles/tokens.stylex.ts`. `global.css` repeats only the focus outline and backdrop colours, and must stay in sync with it.
- **Do** keep Dusk Lilac as the single accent for actions, selections and the take-home total.
- **Do** set every money amount in tabular figures that never wrap, right-aligned in lists.
- **Do** make new controls soft and pressable: 12px to 16px radius, white at rest, Dusk Lilac and the accent glow when on, and a visible 2px Dusk Lilac focus outline.
- **Do** give any new deduction its own series colour, used in both the bar and its row's swatch.
- **Do** check new UI at every width from 320px to 1920px with `mise run test:e2e`, and shrink type or padding a step on small phones before dropping content.
- **Do** keep the phone layout true to the 2020 screen: Details and Results as tabs, tiles three over two.
- **Do** keep transitions at 120ms on colour, background and shadow, and drop them to 0s under `prefers-reduced-motion`.

### Don't:

- **Don't** add a second accent colour, or use the series hues on controls.
- **Don't** set text in Soft Lavender or Pale Lavender, or Dusk Lilac text on Lilac Tint (4.43:1, under AA).
- **Don't** use pure black for text. Ink (#272d2d) is the darkest colour.
- **Don't** add a second typeface. Hierarchy comes from Lato's weights.
- **Don't** put flat black shadows on surfaces. Use the Card, Raised or Docked shadows, or the accent glow.
- **Don't** set anything in uppercase except the one overline.
- **Don't** hard-code a colour or a space that a token already covers.
