export type AuthRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: AuthRole;
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  session: AuthSession;
}

export interface AuthSession {
  token: string;
  expiresAt: string;
}

export interface AuthUserResponse {
  success: boolean;
  message: string;
  user: AuthUser;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}