import { getToken, clearStorage } from "./storageService";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers as HeadersInit || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(input, { ...init, headers });

  // If token expired or invalid, clear storage and redirect to login (client-side)
  if (res.status === 401) {
    try {
      clearStorage();
      if (typeof window !== 'undefined') {
        // force navigation to login
        window.location.assign('/login');
      }
    } catch {
      // ignore
    }
  }

  return res;
}
