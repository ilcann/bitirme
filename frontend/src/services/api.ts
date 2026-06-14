const DEFAULT_API_BASE_URL = '/ilcan21/api';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

type ApiResponse = Record<string, unknown> | null;

function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function parseJsonResponse(response: Response): Promise<ApiResponse> {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as ApiResponse;
  } catch {
    return { message: responseText };
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers,
  });

  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      (data && typeof data.message === 'string' && data.message) ||
        `Request failed with status ${response.status}`
    );
  }

  return data as T;
}