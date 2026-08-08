import { Tutor } from '../../services/tutorService';
import { searchTutors } from '../../services/tutorService';
import { getFitSummary } from '../../services/aiFitService';

/**
 * Get a tutor by their ID.
 * @param id - The tutor's ID.
 * @returns A promise that resolves to the tutor if found, or null if not found.
 */
export const getTutorById = async (id: string): Promise<Tutor | null> => {
  // Since we don't have a direct "get by id" service, we fetch all and filter.
  // In a real app, this would be an API call like /tutors/${id}.
  const allTutors = await searchTutors({}); // empty filters => all tutors
  return allTutors.find(t => t.id === id) ?? null;
};

/**
 * Get an AI-generated fit summary for a tutor given the user's need.
 * @param tutorId - The tutor's ID.
 * @param userNeed - The user's stated learning need.
 * @returns A promise that resolves to the generated summary string.
 * @throws Error if the tutor is not found or the AI service fails.
 */
export const getFitSummaryForTutor = async (
  tutorId: string,
  userNeed: string
): Promise<string> => {
  const tutor = await getTutorById(tutorId);
  if (!tutor) {
    throw new Error(`Tutor with id ${tutorId} not found`);
  }
  return await getFitSummary(userNeed, tutor);
};