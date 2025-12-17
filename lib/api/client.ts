import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const API_BASE_URL = 'https://wellteens.mfleet.io';

export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';
export const AUTH_EXP_KEY = 'auth_exp';

/**
 * Get the stored auth token
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Store auth data securely
 */
export async function setAuthData(token: string, exp: number): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_EXP_KEY, exp.toString());
    } else {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStore.setItemAsync(AUTH_EXP_KEY, exp.toString());
    }
  } catch (error) {
    console.error('Error storing auth data:', error);
    throw error;
  }
}

/**
 * Clear all auth data
 */
export async function clearAuthData(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_EXP_KEY);
    } else {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(AUTH_USER_KEY);
      await SecureStore.deleteItemAsync(AUTH_EXP_KEY);
    }
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}

/**
 * Check if token is expired
 */
export async function isTokenExpired(): Promise<boolean> {
  try {
    let exp: string | null = null;
    
    if (Platform.OS === 'web') {
      exp = localStorage.getItem(AUTH_EXP_KEY);
    } else {
      exp = await SecureStore.getItemAsync(AUTH_EXP_KEY);
    }
    
    if (!exp) return true;
    
    const expTimestamp = parseInt(exp, 10) * 1000; // Convert to milliseconds
    return Date.now() >= expTimestamp;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

/**
 * Authenticated fetch wrapper
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, headers = {}, ...rest } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (!skipAuth) {
    const token = await getAuthToken();
    if (token) {
      (requestHeaders as Record<string, string>)['Authorization'] = `JWT ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: requestHeaders,
    ...rest,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

/**
 * Custom API error class
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
