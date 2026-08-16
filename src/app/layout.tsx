import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import { ChatWidget } from "@/features/ChatWidget";
import "../styles/theme.css";
import "./globals.css";

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
      </body>
    </html>
  );
}
