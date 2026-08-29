import { searchTutors, type Tutor } from "../../services/tutorService";
import { getPublicTutorProfiles } from "../../services/profileService";

export type TutorBadge = "Top Rated" | "Recommended";
export type FindTutor = Tutor & { experienceYears: number; region: "Remote"; badge: TutorBadge; tags: string[] };

export const subjectOptions = ["All Subjects", "Mathematics", "Science", "English", "Computer Science", "Physics"];
export const experienceOptions = ["All Experience", "1+ Years", "3+ Years", "5+ Years", "10+ Years"];
export const regionOptions = ["Any region", "Remote"];
export const priceBounds = { min: 10, max: 100 };

const subjectTags: Record<string, string[]> = {
  Mathematics: ["Mathematics", "Algebra", "Calculus"],
  Science: ["Science", "Biology", "Experiments"],
  "English Literature": ["English", "Writing", "Literature"],
  History: ["History", "Research", "Essays"],
  Physics: ["Physics", "Mechanics", "Thermodynamics"],
  Chemistry: ["Chemistry", "Organic", "Biochemistry"],
  Biology: ["Biology", "Ecology", "Lab Skills"],
  "Computer Science": ["Programming", "Python", "Data Structures"],
  Spanish: ["Spanish", "Conversation", "Grammar"],
  English: ["English", "Grammar", "Writing"],
  Art: ["Art", "Drawing", "Composition"],
};

export async function getFindTutors(): Promise<FindTutor[]> {
  const tutors = await searchTutors();
  try {
    const publicProfiles = await getPublicTutorProfiles();
    const firestoreTutors: Tutor[] = publicProfiles.map((profile) => ({
      id: profile.uid, name: profile.name, subject: profile.subjects.split(",")[0]?.trim() || "Tutor",
      level: "beginner", bio: profile.bio || "", price: Number(profile.hourlyRate) || 0, rating: 0,
      availability: profile.availability || "",
    }));
    return [...firestoreTutors, ...tutors.filter((tutor) => !firestoreTutors.some((item) => item.id === tutor.id))].map((tutor) => ({
      ...tutor, experienceYears: tutor.level === "advanced" ? 8 : tutor.level === "intermediate" ? 4 : 1,
      region: "Remote", badge: tutor.rating >= 4.8 ? "Top Rated" : "Recommended",
      tags: subjectTags[tutor.subject] ?? [tutor.subject, "Personalized Learning"],
    }));
  } catch {
    // Keep existing discovery available if Firestore is unavailable.
  }
  return tutors.map((tutor) => ({
    ...tutor,
    experienceYears: tutor.level === "advanced" ? 8 : tutor.level === "intermediate" ? 4 : 1,
    region: "Remote",
    badge: tutor.rating >= 4.8 ? "Top Rated" : "Recommended",
    tags: subjectTags[tutor.subject] ?? [tutor.subject, "Personalized Learning"],
  }));
}
