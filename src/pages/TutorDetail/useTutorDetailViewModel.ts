import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTutorById, getFitSummaryForTutor } from './TutorDetailModel';
import { Tutor } from '../../services/tutorService';
import { loadSavedTutors, saveTutor } from '../SavedTutors/SavedTutorsModel';

export const useTutorDetailViewModel = (
  tutorId: string,
  userNeed: string
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.uid ?? null;

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [fitSummary, setFitSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setSaveError(null);
      setTutor(null);
      setFitSummary(null);
      setIsSaved(false);

      try {
        // Fetch tutor
        const tutorData = await getTutorById(tutorId);
        if (!tutorData) {
          throw new Error(`Tutor with id ${tutorId} not found`);
        }
        setTutor(tutorData);

        if (userId) {
          const savedTutors = await loadSavedTutors(userId);
          setIsSaved(savedTutors.some((savedTutor) => savedTutor.id === tutorId));
        }

        // Fetch AI-generated fit summary
        const summary = await getFitSummaryForTutor(tutorId, userNeed);
        setFitSummary(summary);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    // Only proceed if tutorId is non-empty
    if (tutorId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [tutorId, userNeed, userId]);

  const handleSaveTutor = useCallback(async (): Promise<void> => {
    if (!tutor) return;

    if (!userId) {
      navigate('/auth');
      return;
    }

    if (isSaved) return;

    setSaveError(null);
    setSaving(true);

    try {
      await saveTutor(userId, tutor);
      setIsSaved(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  }, [isSaved, navigate, tutor, userId]);

  return { tutor, fitSummary, loading, error, saving, saveError, isSaved, handleSaveTutor };
};