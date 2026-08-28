import React, { createContext, useContext, useCallback } from 'react';
import { type User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication is intentionally disabled while the front-end is being built.
  // Keep the provider API stable so authentication can be restored later without
  // changing the application shell or dashboard components.
  const user: User | null = null;
  const authLoading = false;

  const logout = useCallback(async (): Promise<void> => {
    return Promise.resolve();
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the global AuthContext.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
