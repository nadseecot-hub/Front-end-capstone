import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from 'firebase/auth';
import { subscribeToAuthChanges, logoutUser } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const logout = async (): Promise<void> => {
    await logoutUser();
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, logout }}>
      {authLoading ? (
        <div className="auth-context-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', fontFamily: 'var(--font-body)', color: 'var(--color-amber)' }}>
          Loading authentication session...
        </div>
      ) : (
        children
      )}
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
