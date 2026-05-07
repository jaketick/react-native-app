import { Platform } from 'react-native';

// const API_BASE_URL =
//   Platform.OS === 'android' ? 'http://10.0.2.2:9000/api' : 'http://localhost:9000/api';
const API_BASE_URL = 'http://192.168.100.197:84/exam1';
// const API_KEY = 'demo-x-api-key';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // 'x-api': API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`HTTP ${response.status}: ${detail || 'Request failed'}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: Record<string, unknown>) => request<T>('POST', path, body),
  put: <T>(path: string, body: Record<string, unknown>) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
