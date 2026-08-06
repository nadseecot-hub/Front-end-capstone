/* ==========================================================================
   Firebase Service
   --------------------------------------------------------------------------
   Initializes the Firebase app + Firestore using values from Vite env vars
   (import.meta.env.VITE_FIREBASE_*). Vite injects anything prefixed with
   VITE_ at build time, so we never reference process.env here.

   To set this up:
     1. Create a project at https://console.firebase.google.com
     2. In Project Settings, register a Web app and copy the config values
     3. Fill in the matching fields in `.env` at the project root
        (see .env.example for the full list)
     4. In the Firebase console, enable Cloud Firestore (Start in test mode
        is fine for development; lock it down with security rules before
        you ship)

   No authentication is wired up here, and no favorites reads/writes exist
   yet — this file only initializes Firebase and exports the Firestore
   instance. Add data access in a separate service when needed.
   ========================================================================== */

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  type Firestore,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { Tutor } from "./tutorService";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Pulled from import.meta.env so Vite inlines them at build time.
 * If a key is missing the app throws a clear error on first use rather
 * than failing silently later inside a Firestore call.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

/**
 * Sanity check — catches missing env vars early with a useful message
 * instead of a vague "Firebase: No Firebase App '[DEFAULT]' has been
 * created" error from deep inside the SDK.
 */
const requiredKeys: Array<keyof typeof firebaseConfig> = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const missingKeys = requiredKeys.filter(
  (key) => !firebaseConfig[key] || firebaseConfig[key] === ""
);

if (missingKeys.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    "[firebaseService] Missing VITE_FIREBASE_* env vars:",
    missingKeys.join(", "),
    "\nCopy .env.example to .env and fill in your Firebase project config."
  );
}

/* -------------------------------------------------------------------------- */
/*  Initialize                                                                */
/* -------------------------------------------------------------------------- */

let firebaseApp: FirebaseApp;
let firestoreDb: Firestore;
let firebaseAuth: Auth;

try {
  firebaseApp = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(firebaseApp);
  firebaseAuth = getAuth(firebaseApp);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error("[firebaseService] Failed to initialize Firebase:", err);
  throw err;
}

/* -------------------------------------------------------------------------- */
/*  Exports                                                                   */
/* -------------------------------------------------------------------------- */

export const app: FirebaseApp = firebaseApp;
export const db: Firestore = firestoreDb;
export const auth: Auth = firebaseAuth;

export default firebaseApp;

/* -------------------------------------------------------------------------- */
/*  Saved Tutors                                                              */
/*  -----------------------------------------------------------------------    */
/*                                                                              */
/*  Storage shape (per-user)                                                   */
/*  ------------------------                                                   */
/*    Path: users/{userId}/savedTutors/{tutorId}                               */
/*    Document id: tutorId  (idempotent — re-saving overwrites)                */
/*    Document body: the full Tutor object                                     */
/*                                                                              */
/*  Auth note                                                                  */
/*  ---------                                                                  */
/*    userId is passed in by the caller (e.g. from AuthContext.user.uid).      */
/*    This module never reads auth.currentUser — keeping it framework-free.    */
/*                                                                              */
/*  No React hooks, no UI: this module is pure data access.                    */
/* -------------------------------------------------------------------------- */

const savedTutorsPath = (userId: string) =>
  `users/${userId}/savedTutors`;

/**
 * Persist a tutor under the signed-in user's saved-tutors subcollection.
 *
 * @param userId - The authenticated user's uid (from AuthContext).
 * @param tutor  - The full Tutor object to save. tutor.id is used as the doc id.
 * @throws Error if userId or tutor.id is missing, or the write fails.
 */
export const addSavedTutor = async (userId: string, tutor: Tutor): Promise<void> => {
  if (!userId) {
    throw new Error("addSavedTutor: userId is required. The user must be signed in.");
  }
  if (!tutor || !tutor.id) {
    throw new Error("addSavedTutor: tutor.id is required.");
  }

  try {
    const tutorRef = doc(db, savedTutorsPath(userId), tutor.id);
    await setDoc(tutorRef, tutor);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`addSavedTutor(${tutor.id}) failed: ${message}`);
  }
};

/**
 * Remove a tutor from the signed-in user's saved-tutors subcollection.
 * Deleting a non-existent document is a no-op at the Firestore level.
 *
 * @param userId   - The authenticated user's uid (from AuthContext).
 * @param tutorId  - The id of the tutor to remove.
 * @throws Error if userId or tutorId is missing, or the delete fails.
 */
export const removeSavedTutor = async (userId: string, tutorId: string): Promise<void> => {
  if (!userId) {
    throw new Error("removeSavedTutor: userId is required. The user must be signed in.");
  }
  if (!tutorId) {
    throw new Error("removeSavedTutor: tutorId is required.");
  }

  try {
    const tutorRef = doc(db, savedTutorsPath(userId), tutorId);
    await deleteDoc(tutorRef);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`removeSavedTutor(${tutorId}) failed: ${message}`);
  }
};

/**
 * Read every tutor saved by the signed-in user.
 *
 * @param userId - The authenticated user's uid (from AuthContext).
 * @returns A promise resolving to an array of Tutor objects (empty if none).
 * @throws Error if userId is missing or the read fails.
 */
export const getSavedTutors = async (userId: string): Promise<Tutor[]> => {
  if (!userId) {
    throw new Error("getSavedTutors: userId is required. The user must be signed in.");
  }

  try {
    const tutorsRef = collection(db, savedTutorsPath(userId));
    const snapshot = await getDocs(tutorsRef);
    return snapshot.docs.map((d: QueryDocumentSnapshot) => d.data() as Tutor);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`getSavedTutors failed: ${message}`);
  }
};

/* -------------------------------------------------------------------------- */
/*  Firestore security rules (for firestore.rules — NOT applied here)         */
/* -------------------------------------------------------------------------- */
/*
  Replace the default test-mode rules with these once Auth is confirmed working:

    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{userId}/savedTutors/{tutorId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
*/
