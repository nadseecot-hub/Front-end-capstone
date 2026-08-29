import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AppShell from "@/components/AppShell";
import DeferredChatWidget from "@/components/DeferredChatWidget";
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-manrope" });
import "../styles/theme.css";
import "./globals.css";
import "./status.css";

export const metadata: Metadata = {
  title: "TutorFinder",
  description: "Find the right tutor for every learner.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable}`}>
        <AppShell>{children}</AppShell>
        <DeferredChatWidget />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
