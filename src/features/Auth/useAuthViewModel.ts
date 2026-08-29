import { useState } from "react";
import { type User } from "firebase/auth";
import { AuthModel } from "./AuthModel";
import { getUserProfile } from "../../services/profileService";
import type { AuthMode } from '../../types';

export type { AuthMode } from '../../types';

export type UserRole = "tutor" | "parent-student";

export interface UseAuthViewModelReturn {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  showConfirmPassword: boolean;
  toggleShowConfirmPassword: () => void;
  mode: AuthMode;
  role: UserRole;
  loading: boolean;
  error: string | null;
  handleSubmit: (e?: React.FormEvent) => Promise<User | null>;
  toggleMode: () => void;
  setRole: (role: UserRole) => void;
}

export const useAuthViewModel = (initialMode?: "login" | "register" | null): UseAuthViewModelReturn => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [mode, setMode] = useState<AuthMode>(initialMode === "register" ? "register" : "login");
  const [role, setRole] = useState<UserRole>("parent-student");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e?: React.FormEvent): Promise<User | null> => {
    if (e) {
      e.preventDefault();
    }

    setError(null);

    if (mode === "register" && !name.trim()) {
      setError("Enter your name");
      return null;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      return null;
    }

    setLoading(true);

    try {
      let user: User;
      if (mode === "login") {
        user = await AuthModel.login(email, password);
        const profile = await getUserProfile(user.uid);
        const selectedRole = role === "tutor" ? "tutor" : "student";
        const roleMatches = profile?.role === "tutor"
          ? selectedRole === "tutor"
          : selectedRole === "student" && (profile?.role === "student" || profile?.role === "parent");
        if (!roleMatches) {
          await AuthModel.logout();
          throw new Error("This account belongs to a different sign-in type. Choose the correct option and try again.");
        }
      } else {
        user = await AuthModel.register(email, password, name, "student");
      }
      setPassword("");
      setConfirmPassword("");
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
    mode,
    role,
    loading,
    error,
    handleSubmit,
    toggleMode,
    setRole,
  };
};

export default useAuthViewModel;
