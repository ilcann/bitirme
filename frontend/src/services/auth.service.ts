import { apiRequest } from './api';
import type { AuthUserResponse, LoginRequest, LoginResponse, LogoutResponse } from './types';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/public/auth/login.php', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function getCurrentUser(): Promise<AuthUserResponse> {
  return apiRequest<AuthUserResponse>('/public/auth/me.php', {
    method: 'GET',
  });
}

export async function logout(): Promise<LogoutResponse> {
  return apiRequest<LogoutResponse>('/public/auth/logout.php', {
    method: 'POST',
  });
}