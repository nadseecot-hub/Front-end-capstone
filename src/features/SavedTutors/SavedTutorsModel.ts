import {
  addSavedTutor,
  getSavedTutors,
  removeSavedTutor,
} from "../../services/firebaseService";
import { Tutor } from "../../services/tutorService";

/* ==========================================================================
   SavedTutorsModel
   --------------------------------------------------------------------------
   Thin wrapper around the Firebase service for the Saved Tutors screen.
   All three functions now require a userId, which callers obtain from
   AuthContext — this module never imports firebase/auth or reads
   auth.currentUser directly.

   No React hooks, no loading state, no error state — the ViewModel owns
   those. Failures surface as rejected promises.
   ========================================================================== */

/**
 * Fetch every tutor the signed-in user has saved.
 * @param userId - The authenticated user's uid (from AuthContext).
 */
export const loadSavedTutors = async (userId: string): Promise<Tutor[]> => {
  return await getSavedTutors(userId);
};

/**
 * Persist a tutor to the signed-in user's saved-tutors collection.
 * @param userId - The authenticated user's uid (from AuthContext).
 * @param tutor  - The full Tutor object to save.
 */
export const saveTutor = async (userId: string, tutor: Tutor): Promise<void> => {
  await addSavedTutor(userId, tutor);
};

/**
 * Remove a tutor from the signed-in user's saved-tutors collection by id.
 * @param userId   - The authenticated user's uid (from AuthContext).
 * @param tutorId  - The id of the tutor to remove.
 */
export const deleteSavedTutor = async (userId: string, tutorId: string): Promise<void> => {
  await removeSavedTutor(userId, tutorId);
};
