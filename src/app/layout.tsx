import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AppShell from "@/components/AppShell";
import { ChatWidget } from "@/features/ChatWidget";
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
      <body>
        <AppShell>{children}</AppShell>
        <ChatWidget />
        <SpeedInsights />
      </body>
    </html>
  );
}
