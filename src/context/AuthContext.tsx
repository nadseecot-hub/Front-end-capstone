import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User } from 'firebase/auth';
import { logoutUser, subscribeToAuthChanges } from '@/services/authService';
import { getUserProfile, type UserProfile } from '@/services/profileService';

export interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;
  profile: UserProfile | null;
  role: UserProfile['role'] | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => subscribeToAuthChanges(async (nextUser) => {
    setUser(nextUser);
    setProfile(nextUser ? await getUserProfile(nextUser.uid).catch(() => null) : null);
    setAuthLoading(false);
  }), []);
  const refreshProfile = async () => { if (user) setProfile(await getUserProfile(user.uid)); };
  const logout = () => logoutUser();

  return (
    <AuthContext.Provider value={{ user, authLoading, logout, profile, role: profile?.role ?? null, refreshProfile }}>
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
