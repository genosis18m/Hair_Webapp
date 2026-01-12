import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { userApi } from '../services/api';

interface UserData {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  credits: number;
  createdAt: string;
  analyses: Array<{
    id: string;
    topResult: string;
    confidence: number;
    createdAt: string;
  }>;
  subscription: {
    plan: string;
    status: string;
  } | null;
}

export const useUserData = () => {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync user with backend (create if not exists)
  const syncUser = useCallback(async () => {
    if (!user) return null;

    try {
      const result = await userApi.syncUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || user.firstName || undefined,
        imageUrl: user.imageUrl || undefined,
      });
      setUserData(result.user);
      setError(null);
      return result.user;
    } catch (err) {
      console.error('Error syncing user:', err);
      setError('Failed to sync user data');
      return null;
    }
  }, [user]);

  // Fetch user data from backend
  const fetchUserData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const result = await userApi.getUser(user.id);
      setUserData(result.user);
      setError(null);
    } catch (err: any) {
      // If user not found (404), sync/create them
      if (err.response?.status === 404) {
        console.log('User not found, syncing...');
        await syncUser();
      } else {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user data');
      }
    } finally {
      setLoading(false);
    }
  }, [user, syncUser]);

  // Update credits locally after an action
  const updateCredits = useCallback((newCredits: number) => {
    setUserData(prev => prev ? { ...prev, credits: newCredits } : null);
  }, []);

  // Refresh user data
  const refresh = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Initial fetch when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    } else if (isLoaded && !user) {
      setLoading(false);
      setUserData(null);
    }
  }, [isLoaded, user, fetchUserData]);

  // Refresh credits every 10 seconds while on dashboard pages
  useEffect(() => {
    if (!isLoaded || !user) return;
    
    const interval = setInterval(() => {
      fetchUserData();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [isLoaded, user, fetchUserData]);

  return {
    userData,
    loading: !isLoaded || loading,
    error,
    credits: userData?.credits ?? 0,
    updateCredits,
    refresh,
    syncUser,
  };
};

export default useUserData;
