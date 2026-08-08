import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSavedTutors, getTutors, initialTutors, saveTutor } from './HomeModel';
import { Tutor, TutorSearchFilters } from '../../services/tutorService';
import { useAuth } from '../../context/AuthContext';

export const useHomeViewModel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.uid ?? null;

  const [subject, setSubject] = useState<string>('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced' | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [userNeed, setUserNeed] = useState<string>('');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Per-tutor in-flight tracking so each Save button shows its own "Saving…" state.
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  // Track saved tutor IDs locally, seeded from Firestore on mount.
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Load all tutors and existing saved IDs on initial mount (or on auth change).
  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const [initial, saved] = await Promise.all([
          initialTutors(),
          userId ? fetchSavedTutors(userId).catch(() => []) : Promise.resolve([]),
        ]);
        setTutors(initial);
        setSavedIds(new Set(saved.map((t) => t.id)));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, [userId]); // re-run when user signs in or out

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: TutorSearchFilters = {};
      if (subject) filters.subject = subject;
      if (level) filters.level = level;
      if (maxPrice !== undefined) filters.maxPrice = maxPrice;
      const result = await getTutors(filters);
      setTutors(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save a tutor. If the user is not signed in, redirect to /auth instead.
   * All save logic lives here in the ViewModel — TutorCard fires onSave and
   * this function decides what to do.
   */
  const handleSaveTutor = useCallback(
    async (tutor: Tutor): Promise<void> => {
      // Guard: redirect unauthenticated users to the auth page.
      if (!userId) {
        navigate('/auth');
        return;
      }

      // Guard: don't double-save.
      if (savedIds.has(tutor.id)) return;

      setSaveError(null);
      setSavingId(tutor.id);
      try {
        await saveTutor(userId, tutor);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.add(tutor.id);
          return next;
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setSaveError(message);
      } finally {
        setSavingId(null);
      }
    },
    [userId, savedIds, navigate]
  );

  return {
    subject,
    setSubject,
    level,
    setLevel,
    maxPrice,
    setMaxPrice,
    userNeed,
    setUserNeeded: setUserNeed,
    setUserNeed,
    tutors,
    loading,
    error,
    handleSearch,
    savingId,
    saveError,
    savedIds,
    handleSaveTutor,
  };
};