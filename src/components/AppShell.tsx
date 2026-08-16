"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
