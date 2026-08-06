import { useCallback, useEffect, useState } from "react";
import {
  deleteSavedTutor,
  loadSavedTutors,
} from "./SavedTutorsModel";
import { Tutor } from "../../services/tutorService";
import { useAuth } from "../../context/AuthContext";

/* ==========================================================================
   useSavedTutorsViewModel
   --------------------------------------------------------------------------
   Owns the screen's React state for SavedTutorsView. Reads the current
   userId from AuthContext and passes it to every SavedTutorsModel call so
   data is always scoped to the signed-in user.

   If the user is not signed in, the list stays empty and no Firestore
   requests are made.
   ========================================================================== */

export interface SavedTutorsViewModel {
  savedTutors: Tutor[];
  loading: boolean;
  error: string | null;
  loadTutors: () => Promise<void>;
  removeTutor: (tutorId: string) => Promise<void>;
}

export const useSavedTutorsViewModel = (): SavedTutorsViewModel => {
  const { user } = useAuth();
  const userId = user?.uid ?? null;

  const [savedTutors, setSavedTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch the current saved-tutors list for the signed-in user.
   * No-ops silently if the user is not authenticated.
   */
  const loadTutors = useCallback(async (): Promise<void> => {
    if (!userId) {
      setSavedTutors([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await loadSavedTutors(userId);
      setSavedTutors(list);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Delete a saved tutor by id for the signed-in user.
   * The local list is updated optimistically after a successful Firestore write.
   */
  const removeTutor = useCallback(
    async (tutorId: string): Promise<void> => {
      if (!userId) return;
      try {
        await deleteSavedTutor(userId, tutorId);
        setSavedTutors((prev) => prev.filter((t) => t.id !== tutorId));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(message);
      }
    },
    [userId]
  );

  // Reload whenever the signed-in user changes.
  useEffect(() => {
    loadTutors();
  }, [loadTutors]);

  return {
    savedTutors,
    loading,
    error,
    loadTutors,
    removeTutor,
  };
};
