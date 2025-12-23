import { getToken, clearStorage } from "./storageService";
import { toCamelCase, toSnakeCase } from "./caseConverter";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers as HeadersInit || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // If there's a JSON body and it's an object, convert keys to snake_case before sending
  const contentType = headers.get('Content-Type') || (init?.headers && (init.headers as any)['Content-Type']);
  const isJson = contentType && contentType.includes('application/json');

  const finalInit: RequestInit = { ...init, headers };

  if (finalInit.body && isJson) {
    try {
      let bodyObj: any = finalInit.body as any;
      if (typeof bodyObj === 'string') {
        bodyObj = JSON.parse(bodyObj);
      }
      const snake = toSnakeCase(bodyObj);
      finalInit.body = JSON.stringify(snake);
      headers.set('Content-Type', 'application/json');
    } catch (e) {
      // if parsing fails, leave body as-is
      console.warn('fetchWithAuth: failed to convert request body to snake_case', e);
    }
  }

  const res = await fetch(input, finalInit);

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

  // If response is JSON, parse, convert keys to camelCase and return a new Response
  try {
    const resContentType = res.headers.get('Content-Type') || '';
    if (resContentType.includes('application/json')) {
      const text = await res.text();
      // Empty body (204) will be empty string
      if (text && text.trim().length > 0) {
        const parsed = JSON.parse(text);
        const camel = toCamelCase(parsed);
        const newBody = JSON.stringify(camel);
        // Build a new Response preserving status, statusText and headers
        const newHeaders = new Headers(res.headers);
        // Ensure content-length is accurate in environments that use it
        newHeaders.set('content-length', String(newBody.length));
        const newRes = new Response(newBody, {
          status: res.status,
          statusText: res.statusText,
          headers: newHeaders,
        });
        return newRes;
      }
    }
  } catch (e) {
    console.warn('fetchWithAuth: failed to convert response body to camelCase', e);
    // fall through to return original response
  }

  return res;
}
