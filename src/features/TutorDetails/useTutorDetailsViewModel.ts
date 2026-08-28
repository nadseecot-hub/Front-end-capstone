"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { loadSavedTutors, saveTutor } from "../SavedTutors/SavedTutorsModel";
import { getTutorProfile, type TutorProfile } from "./TutorDetailsModel";

export function useTutorDetailsViewModel(tutorId: string) {
  const router = useRouter();
  const { user } = useAuth();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => { let mounted = true; setLoading(true); getTutorProfile(tutorId).then(async (profile) => { if (!mounted) return; if (!profile) { setError("Tutor not found"); setLoading(false); return; } setTutor(profile); if (user) { const saved = await loadSavedTutors(user.uid); if (mounted) setIsSaved(saved.some((item) => item.id === tutorId)); } setLoading(false); }).catch(() => { if (mounted) { setError("We couldn't load this tutor right now."); setLoading(false); } }); return () => { mounted = false; }; }, [tutorId, user]);

  const save = useCallback(async () => { if (!tutor) return; if (!user) { router.push("/auth"); return; } if (isSaved) return; setSaving(true); try { await saveTutor(user.uid, { ...tutor, availability: "Flexible" }); setIsSaved(true); } finally { setSaving(false); } }, [isSaved, router, tutor, user]);
  const bookSession = useCallback(() => router.push(`/dashboard/bookings?tutorId=${tutorId}`), [router, tutorId]);
  const messageTutor = useCallback(() => router.push(`/messages?tutorId=${tutorId}`), [router, tutorId]);
  const shareTutor = useCallback(async () => { const url = window.location.href; if (navigator.share) await navigator.share({ title: tutor ? `${tutor.name} on TutorFinder` : "TutorFinder tutor", url }); else await navigator.clipboard?.writeText(url); }, [tutor]);

  return { tutor, loading, error, isSaved, saving, selectedDay, setSelectedDay, activeTab, setActiveTab, save, bookSession, messageTutor, shareTutor };
}
