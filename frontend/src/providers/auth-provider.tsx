import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login as loginRequest, logout as logoutRequest } from '@/services/auth.service';
import type { AuthSession, AuthUser, LoginRequest } from '@/services/types/auth.types';
import { AUTH_TOKEN_STORAGE_KEY } from '@/services/api';

type AuthState = {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (credentials: LoginRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
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

function readStoredSession() {
  try {
    const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (!storedToken) {
      return null;
    }

    return {
      token: storedToken,
      expiresAt: localStorage.getItem(`${AUTH_TOKEN_STORAGE_KEY}-expiresAt`) || '',
    } as AuthSession;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, session.token);
      localStorage.setItem(`${AUTH_TOKEN_STORAGE_KEY}-expiresAt`, session.expiresAt);
      return;
    }

    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(`${AUTH_TOKEN_STORAGE_KEY}-expiresAt`);
  }, [session]);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!session?.token) {
        return;
      }

      try {
        const response = await getCurrentUser();

        if (isMounted) {
          setUser(response.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setSession(null);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    session,
    isAuthenticated: Boolean(user),
    isLoginOpen,
    openLogin: () => setIsLoginOpen(true),
    closeLogin: () => setIsLoginOpen(false),
    login: async (credentials: LoginRequest) => {
      const response = await loginRequest(credentials);

      setUser(response.user);
      setSession(response.session);
      setIsLoginOpen(false);

      return response.user;
    },
    logout: async () => {
      try {
        await logoutRequest();
      } catch {
        // Clear local auth state even if the server-side revoke fails.
      }

      setUser(null);
      setSession(null);
      setIsLoginOpen(false);
    },
  }), [isLoginOpen, session, user]);

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