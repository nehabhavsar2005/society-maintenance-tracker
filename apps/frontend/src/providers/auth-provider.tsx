'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/services/auth.service';
import { getAccessToken, refreshAccessToken, setAccessToken } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  register: (payload: { name: string; email: string; password: string; phone?: string; flatNumber?: string; block?: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  const bootstrap = React.useCallback(async () => {
    setIsLoading(true);
    try {
      let token = getAccessToken();
      if (!token) {
        token = await refreshAccessToken();
      }
      if (token) {
        const profile = await authApi.me();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = React.useCallback(async (email: string, password: string, rememberMe = false) => {
    const result = await authApi.login({ email, password, rememberMe });
    setAccessToken(result.accessToken);
    setUser(result.user);
    return result.user;
  }, []);

  const register = React.useCallback(
    async (payload: { name: string; email: string; password: string; phone?: string; flatNumber?: string; block?: string }) => {
      const result = await authApi.register(payload);
      setAccessToken(result.accessToken);
      setUser(result.user);
      return result.user;
    },
    []
  );

  const logout = React.useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setAccessToken(null);
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshProfile: bootstrap,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
