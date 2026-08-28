import { searchTutors, type Tutor } from "../../services/tutorService";

export interface TutorReview { name: string; role: "Student" | "Parent"; rating: number; text: string; }
export type TutorProfile = Omit<Tutor, "availability"> & { reviewCount: number; recommendPercent: number; studentsTaught: number; experienceYears: number; location: string; languages: string[]; education: Array<{ degree: string; school: string; years: string }>; subjects: string[]; availability: Record<string, string[]>; reviews: TutorReview[]; };

const reviewCopy = [
  { role: "Student" as const, text: "Explains concepts so clearly and makes every lesson feel manageable." },
  { role: "Parent" as const, text: "Patient, organized, and genuinely invested in steady progress." },
  { role: "Student" as const, text: "The step-by-step approach helped me feel confident with difficult topics." },
];

export async function getTutorProfile(id: string): Promise<TutorProfile | null> {
  const tutors = await searchTutors();
  const tutor = tutors.find((item) => item.id === id);
  if (!tutor) return null;
  const years = tutor.level === "advanced" ? 8 : tutor.level === "intermediate" ? 4 : 1;
  const reviewCount = 90 + Number(tutor.id) * 7;
  const subjects = Array.from(new Set([tutor.subject, ...(tutor.subject === "Mathematics" ? ["Algebra", "Calculus", "Geometry"] : tutor.subject === "Physics" ? ["Mechanics", "Thermodynamics"] : ["Foundations", "Problem Solving"]) ]));
  return {
    ...tutor,
    reviewCount,
    recommendPercent: Math.min(99, 92 + Number(tutor.id) % 7),
    studentsTaught: 75 + Number(tutor.id) * 5,
    experienceYears: years,
    location: "Remote, serving learners worldwide",
    languages: ["English"],
    education: [{ degree: `M.S. in ${tutor.subject}`, school: "TutorFinder Learning Institute", years: "2018–2020" }, { degree: `B.S. in ${tutor.subject}`, school: "University Learning Network", years: "2014–2018" }],
    subjects,
    availability: { Mon: ["9:00 AM – 12:00 PM", "4:00 PM – 8:00 PM"], Tue: ["4:00 PM – 8:00 PM"], Wed: ["9:00 AM – 12:00 PM"], Thu: ["4:00 PM – 8:00 PM"], Fri: ["9:00 AM – 12:00 PM"], Sat: ["10:00 AM – 2:00 PM"], Sun: [] },
    reviews: reviewCopy.map((review, index) => ({ name: ["Jessica M.", "Daniel R.", "Amina K."][index], ...review, rating: index === 2 ? 4 : 5 })),
  };
}
