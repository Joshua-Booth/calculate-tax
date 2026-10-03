import { Lato } from "next/font/google";
import localFont from "next/font/local";

import type { Metadata, Viewport } from "next";
import { sx } from "@/styles/sx";
import { colors, fonts } from "@/styles/tokens.stylex";
import * as stylex from "@stylexjs/stylex";

import "./global.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});
// Google Fonts has no ExtraBold, so the title and field labels use Lato 2.0 Heavy (see app/fonts/README.md)
const latoHeavy = localFont({
  src: "./fonts/lato-heavy.woff2",
  weight: "800",
  variable: "--font-lato-heavy",
  display: "swap",
});

const styles = stylex.create({
  html: {
    WebkitFontSmoothing: "antialiased",
  },
  body: {
    minHeight: "100vh",
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: "24px",
    color: colors.textPrimary,
    backgroundColor: colors.surfaceCard,
  },
});

export const metadata: Metadata = {
  title: "Calculate Tax: your New Zealand take-home pay",
  description:
    "Work out your take-home pay in New Zealand, with income tax, the ACC levy, KiwiSaver and student loan repayments, using 2026–27 rates.",
};

export const viewport: Viewport = {
  themeColor: "#6a63b8",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NZ"
      {...sx(`${lato.variable} ${latoHeavy.variable}`, styles.html)}
    >
      <body {...stylex.props(styles.body)}>{children}</body>
    </html>
  );
}
