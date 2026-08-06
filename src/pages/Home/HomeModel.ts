import { searchTutors, Tutor, TutorSearchFilters } from '../../services/tutorService';
import { addSavedTutor, getSavedTutors } from '../../services/firebaseService';

/**
 * Get tutors based on the provided filters.
 */
export async function getTutors(filters: TutorSearchFilters): Promise<Tutor[]> {
  return await searchTutors(filters);
}

/**
 * Load all tutors with no filters — called on Home screen mount.
 */
export async function initialTutors(): Promise<Tutor[]> {
  return await searchTutors({});
}

/**
 * Fetch all saved tutors for the signed-in user.
 * @param userId - The authenticated user's uid (from AuthContext).
 */
export async function fetchSavedTutors(userId: string): Promise<Tutor[]> {
  return await getSavedTutors(userId);
}

/**
 * Persist a tutor to the signed-in user's saved-tutors collection.
 * @param userId - The authenticated user's uid (from AuthContext).
 * @param tutor  - The tutor to save.
 */
export async function saveTutor(userId: string, tutor: Tutor): Promise<void> {
  await addSavedTutor(userId, tutor);
}