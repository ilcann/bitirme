import { apiRequest } from './api';
import type { LoginRequest, LoginResponse } from './types';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/public/auth/login.php', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}