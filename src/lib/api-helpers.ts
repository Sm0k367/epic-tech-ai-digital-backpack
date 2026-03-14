/**
 * Client-side API helper functions
 */

const BASE = '';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  apiKey?: string
): Promise<{ success: boolean; data?: T; error?: string; tier?: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  try {
    const res = await fetch(`${BASE}${path}`, { ...options, headers });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, error: 'Network error' };
  }
}

export const api = {
  get: <T>(path: string, apiKey?: string) => apiFetch<T>(path, { method: 'GET' }, apiKey),
  post: <T>(path: string, body: unknown, apiKey?: string) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }, apiKey),
  put: <T>(path: string, body: unknown, apiKey?: string) =>
    apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }, apiKey),
  delete: <T>(path: string, apiKey?: string) => apiFetch<T>(path, { method: 'DELETE' }, apiKey),
};
