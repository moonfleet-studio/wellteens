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
