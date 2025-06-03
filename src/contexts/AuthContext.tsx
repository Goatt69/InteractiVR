'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { IUser } from '@/types/user.types';
import authService from '@/services/auth.service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Check if we have a token and it's not expired
        const token = authService.getToken();
        const storedUser = authService.getUser();

        if (token && storedUser && !authService.isTokenExpired(token)) {
          // Token exists and is valid, verify by fetching profile
          try {
            const response = await authService.getProfile();
            if (response.success) {
              // Ensure we're not storing any sensitive data in state
              const { password, ...safeUserData } = response.data as any;
              setUser(safeUserData as IUser);
            } else {
              // If token is invalid or expired, clear auth
              await authService.logout();
              setUser(null);
            }
          } catch (err) {
            // API error, clear auth
            console.error('Error fetching user profile:', err);
            await authService.logout();
            setUser(null);
          }
        } else if (token && authService.isTokenExpired(token)) {
          // Token exists but is expired, clear it
          console.log('Token expired, logging out');
          await authService.logout();
          setUser(null);
        }
      } catch (err) {
        console.error('Auth init error:', err);
        await authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        // Ensure we're not storing any sensitive data in state
        const { password, ...safeUserData } = response.data.user as any;
        setUser(safeUserData as IUser);
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to log in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.register({ name, email, password });

      if (response.success) {
        // After successful registration, log the user in
        await login(email, password);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
