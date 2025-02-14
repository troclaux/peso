'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    setAccessToken(accessToken);
    setUser(userData);

    // Store access token in memory (React Context)
    // Store refresh token in HTTP-only cookie for middleware
    setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      path: '/',  // Available across all pages
      maxAge: 60 * 60 * 24 * 30, // e.g., 30 days
    });
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);

    // Clear the refresh token cookie
    deleteCookie('refreshToken', { path: '/' });

    // Redirect to login
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
