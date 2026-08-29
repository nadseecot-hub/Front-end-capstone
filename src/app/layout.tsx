import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Serif_Display, Manrope } from "next/font/google";
import AppShell from "@/components/AppShell";
import DeferredChatWidget from "@/components/DeferredChatWidget";
const dmSerifDisplay = DM_Serif_Display({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-dm-serif" });
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
      <body className={`${dmSerifDisplay.variable} ${manrope.variable}`}>
        <AppShell>{children}</AppShell>
        <DeferredChatWidget />
      </body>
    </html>
  );
}
