import { type User } from "firebase/auth";
import { registerUser, loginUser, logoutUser } from "../../services/authService";

/**
 * Validates and normalizes email and password input.
 */
const validateCredentials = (
  email: string,
  password: string
): { normalizedEmail: string; validPassword: string } => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  return { normalizedEmail, validPassword: password };
};

/**
 * Registers a new user after validation.
 */
export const register = async (email: string, password: string): Promise<User> => {
  const { normalizedEmail, validPassword } = validateCredentials(email, password);
  return await registerUser(normalizedEmail, validPassword);
};

/**
 * Logs in an existing user after validation.
 */
export const login = async (email: string, password: string): Promise<User> => {
  const { normalizedEmail, validPassword } = validateCredentials(email, password);
  return await loginUser(normalizedEmail, validPassword);
};

/**
 * Logs out the current user.
 */
export const logout = async (): Promise<void> => {
  return await logoutUser();
};

export const AuthModel = {
  register,
  login,
  logout,
};

export default AuthModel;
