/**
 * Central API Client for FastAPI backend integration with automatic
 * resilient mock fallback for offline hackathon demos.
 */

const DEFAULT_BACKEND_URL = 'http://localhost:8000';

export function getBackendBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('sih_api_base_url');
    if (override) return override;
  }
  return (import.meta as any).env?.VITE_API_BASE_URL || DEFAULT_BACKEND_URL;
}

export function setBackendBaseUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sih_api_base_url', url);
  }
}

export function isMockModeEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const val = localStorage.getItem('sih_mock_mode');
    if (val !== null) {
      return val === 'true';
    }
  }
  // Default to true for zero-config immediate demo if backend isn't actively up
  return true;
}

export function setMockMode(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sih_mock_mode', enabled ? 'true' : 'false');
  }
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 8000, ...fetchOptions } = options;
  const baseUrl = getBackendBaseUrl().replace(/\/+$/, '');
  const url = `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(fetchOptions.headers || {});
    if (!(fetchOptions.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Server error: ${response.status} ${response.statusText}`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) errorMessage = errorJson.detail;
        else if (errorJson.message) errorMessage = errorJson.message;
      } catch {
        // use fallback message
      }
      throw new Error(errorMessage);
    }

    return (await response.json()) as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The server took too long to respond.');
    }
    throw error;
  }
}
