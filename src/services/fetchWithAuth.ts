import { getToken, clearStorage } from "./storageService";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers as HeadersInit || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(input, { ...init, headers });

  // Si token expirado o inválido (401), limpiar storage y redirigir a login
  if (res.status === 401) {
    try {
      clearStorage();
      if (typeof window !== 'undefined') {
        // Forzar navegación a login
        window.location.assign('/login');
      }
    } catch {
      // ignorar
    }
  }

  // Si acceso prohibido (403), redirigir a access-denied
  if (res.status === 403) {
    try {
      if (typeof window !== 'undefined') {
        // Redirigir a página de acceso denegado
        window.location.assign('/access-denied');
      }
    } catch {
      // ignorar
    }
  }

  return res;
}
