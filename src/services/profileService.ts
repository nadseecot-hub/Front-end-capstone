import {
  doc,
  collection,
  getDocs,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebaseService";

export type UserRole = "student" | "parent" | "tutor";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TutorProfile extends UserProfile {
  role: "tutor";
  bio: string;
  education: string;
  subjects: string;
  hourlyRate: number;
  photoURL: string;
  availability: string;
  experience?: string;
  isPublic?: boolean;
  profileCompleteness: number;
}

export function calculateProfileCompleteness(profile: Partial<TutorProfile>): number {
  if (!profile.name?.trim() || !profile.subjects?.trim()) return 0;
  if (profile.experience?.trim()) return 100;
  if (Number(profile.hourlyRate) > 0 && profile.photoURL?.trim()) return 85;
  return 60;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export async function createUserProfile(user: User, name: string, role: "student" | "parent"): Promise<void> {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid, name: name.trim(), email: user.email ?? "", role,
    photoURL: user.photoURL ?? null, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
}

export async function createTutorAccount(user: User, data: {
  name: string; email: string; subjects: string; bio?: string;
  experience?: string;
  education?: { institution: string; degree: string; fieldOfStudy: string; year?: string };
}): Promise<void> {
  const tutor: TutorProfile = {
    uid: user.uid, role: "tutor", name: data.name.trim(), email: data.email.trim().toLowerCase(),
    bio: data.bio?.trim() ?? "",
    education: data.education ? [data.education.institution, data.education.degree, data.education.fieldOfStudy, data.education.year].filter(Boolean).join(", ") : "",
    subjects: data.subjects.trim(), hourlyRate: 0, photoURL: user.photoURL ?? "", availability: "",
    profileCompleteness: 0, experience: data.experience?.trim() ?? "", isPublic: true,
  };
  tutor.profileCompleteness = calculateProfileCompleteness(tutor);
  const batch = writeBatch(db);
  batch.set(doc(db, "users", user.uid), { uid: user.uid, name: tutor.name, email: tutor.email, role: "tutor", photoURL: tutor.photoURL || null, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  batch.set(doc(db, "tutors", user.uid), { ...tutor, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await batch.commit();
}

export async function getTutorProfile(uid: string): Promise<TutorProfile | null> {
  const snapshot = await getDoc(doc(db, "tutors", uid));
  return snapshot.exists() ? (snapshot.data() as TutorProfile) : null;
}

export async function getPublicTutorProfiles(): Promise<TutorProfile[]> {
  const snapshot = await getDocs(collection(db, "tutors"));
  return snapshot.docs.map((item) => item.data() as TutorProfile).filter((item) => item.isPublic !== false);
}

export async function updateTutorProfile(uid: string, data: Partial<TutorProfile>): Promise<void> {
  const current = await getTutorProfile(uid);
  const next = { ...(current ?? {}), ...data };
  await updateDoc(doc(db, "tutors", uid), { ...data, profileCompleteness: calculateProfileCompleteness(next), updatedAt: serverTimestamp() });
  await updateDoc(doc(db, "users", uid), { name: next.name ?? "", photoURL: next.photoURL ?? null, updatedAt: serverTimestamp() });
}
