import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { auth } from "./firebaseService";

/**
 * Format Firebase Auth errors into friendly, human-readable error messages.
 */
const formatAuthError = (err: unknown): Error => {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    switch (code) {
      case "auth/email-already-in-use":
        return new Error("This email is already in use. Please log in instead.");
      case "auth/invalid-email":
        return new Error("Invalid email address format.");
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return new Error("Invalid email or password.");
      case "auth/weak-password":
        return new Error("Password must be at least 6 characters long.");
      case "auth/too-many-requests":
        return new Error("Access temporarily disabled due to too many failed attempts.");
      case "auth/api-key-not-valid":
      case "auth/invalid-api-key":
        return new Error(
          "Invalid Firebase API key. Please fill in your real Firebase credentials in the root .env file."
        );
      case "auth/operation-not-allowed":
        return new Error(
          "Email/Password sign-in is not enabled in Firebase Console. Go to Build -> Authentication -> Sign-in method to enable it."
        );
      default:
        if ("message" in err && typeof (err as { message: string }).message === "string") {
          return new Error((err as { message: string }).message);
        }
    }
  }
  return err instanceof Error ? err : new Error(String(err));
};

/**
 * Register a new user with email and password using Firebase Authentication.
 */
export const registerUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    throw formatAuthError(err);
  }
};

/**
 * Log in an existing user with email and password using Firebase Authentication.
 */
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    throw formatAuthError(err);
  }
};

/**
 * Log out the current user.
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (err) {
    throw formatAuthError(err);
  }
};

/**
 * Subscribe to Firebase authentication state changes.
 */
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};
