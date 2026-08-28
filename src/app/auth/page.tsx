"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthView from "@/features/Auth/AuthView";

export default function AuthPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return null;
  }

  if (user) {
    return null;
  }

  return <AuthView initialMode={searchParams.get("mode") as "login" | "register" | null} />;
}
