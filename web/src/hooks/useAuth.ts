import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types/auth';
import {
  getCurrentUserProfile,
  subscribeToAuthChanges,
  loginUser,
  registerUser,
  logoutUser,
  updateUserDisplayName,
} from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentUserProfile());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateName = useCallback(async (name: string): Promise<UserProfile> => {
    const updated = await updateUserDisplayName(name);
    setUser(updated);
    return updated;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    updateName,
  };
}
