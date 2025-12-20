import { apiFetch, clearAuthData, setAuthData } from './client';

export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
}

export interface User {
  id: number;
  updatedAt: string | null;
  createdAt: string;
  email: string;
  sessions: Session[];
  collection: string;
  _strategy: string;
}

export interface LoginResponse {
  message: string;
  exp: number;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  exp: number;
  token: string;
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true,
  });

  // Store the token and expiration
  try {
    await setAuthData(response.token, response.exp);
  } catch (storageError) {
    console.error('Failed to store auth data:', storageError);
    throw new Error('Failed to save login credentials securely');
  }

  return response;
}

/**
 * Register a new user
 */
export async function register(credentials: RegisterCredentials): Promise<RegisterResponse> {
  const response = await apiFetch<RegisterResponse>('/api/users', {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true,
  });

  // Store the token and expiration (auto-login after registration)
  await setAuthData(response.token, response.exp);

  return response;
}

/**
 * Logout and clear session
 */
export async function logout(): Promise<void> {
  try {
    // Optionally call logout endpoint if your API supports it
    // await apiFetch('/api/users/logout', { method: 'POST' });
  } catch {
    // Ignore logout API errors
  } finally {
    await clearAuthData();
  }
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

/**
 * Request password reset email
 */
export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const response = await apiFetch<ForgotPasswordResponse>('/api/users/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuth: true,
  });

  return response;
}

/**
 * Reset password with token
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const response = await apiFetch<ResetPasswordResponse>('/api/users/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuth: true,
  });

  return response;
}
