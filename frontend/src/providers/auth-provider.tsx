import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '@/services/auth.service';
import type { AuthUser, LoginRequest } from '@/services/types/auth.types';

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (credentials: LoginRequest) => Promise<AuthUser>;
  logout: () => void;
};

const AUTH_STORAGE_KEY = 'bitirme-auth-user';

const AuthContext = createContext<AuthState | undefined>(undefined);

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  const value = useMemo<AuthState>(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoginOpen,
    openLogin: () => setIsLoginOpen(true),
    closeLogin: () => setIsLoginOpen(false),
    login: async (credentials: LoginRequest) => {
      const response = await loginRequest(credentials);

      setUser(response.user);
      setIsLoginOpen(false);

      return response.user;
    },
    logout: () => {
      setUser(null);
      setIsLoginOpen(false);
    },
  }), [isLoginOpen, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}