import { useState } from "react";
import { type User } from "firebase/auth";
import { AuthModel } from "./AuthModel";
import type { AuthMode } from '../../types';

// Re-export so any view importing AuthMode from here continues to work
export type { AuthMode } from '../../types';

export interface UseAuthViewModelReturn {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  mode: AuthMode;
  loading: boolean;
  error: string | null;
  handleSubmit: (e?: React.FormEvent) => Promise<User | null>;
  toggleMode: () => void;
}

/**
 * Custom ViewModel hook for managing Auth screen state and actions.
 */
export const useAuthViewModel = (): UseAuthViewModelReturn => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError(null);
    setPassword("");
  };

  const handleSubmit = async (e?: React.FormEvent): Promise<User | null> => {
    if (e) {
      e.preventDefault();
    }

    setError(null);
    setLoading(true);

    try {
      let user: User;
      if (mode === "login") {
        user = await AuthModel.login(email, password);
      } else {
        user = await AuthModel.register(email, password);
      }
      setPassword("");
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
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  };
};

export default useAuthViewModel;
