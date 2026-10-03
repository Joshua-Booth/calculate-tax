import { Lato } from "next/font/google";
import localFont from "next/font/local";

import type { Metadata, Viewport } from "next";

import "./globals.css";

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
    <html lang="en-NZ" className={`${lato.variable} ${latoHeavy.variable}`}>
      <body>{children}</body>
    </html>
  );
}
