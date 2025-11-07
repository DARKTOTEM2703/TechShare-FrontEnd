import { setTokenWithClaims, setUserEmail, clearStorage, getToken } from "@/services/storageService";

export const loginUser = async (email: string, password: string): Promise<string | null> => {
    try {
        const baseEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
        // Si no hay variable de entorno en desarrollo, usar backend en localhost:8080
        const fallbackApi = 'http://localhost:8080';
        const loginUrl = baseEnv && baseEnv.length > 0 ? `${baseEnv.replace(/\/$/, '')}/login` : `${fallbackApi}/login`;

        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Login failed');
        }

        // Primero intentar header Authorization
        const authHeader = response.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            setTokenWithClaims(token);
            setUserEmail(email);
            return token;
        }

        // Si no está en header, intentar body JSON { token }
        const body = await response.json().catch(() => null);
        const tokenFromBody = body?.token || body?.accessToken || null;
        if (tokenFromBody) {
            const token = String(tokenFromBody).replace(/^Bearer\s+/, '');
            setTokenWithClaims(token);
            setUserEmail(email);
            return token;
        }

        throw new Error('No token returned from login');
    } catch (error) {
        throw error;
    }
};

/**
 * Cierra la sesión del usuario.
 * 1. Intenta hacer POST a /auth/logout en el backend
 * 2. Limpia el token y datos del usuario de localStorage
 * 3. Retorna true si se cerró exitosamente, false si falló (pero igual limpia)
 * 
 * @returns Promise<boolean> - true si se cerró exitosamente
 */
export const logoutUser = async (): Promise<boolean> => {
    try {
        const token = getToken();
        const baseEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
        const fallbackApi = 'http://localhost:8080';
        const logoutUrl = baseEnv && baseEnv.length > 0 ? `${baseEnv.replace(/\/$/, '')}/auth/logout` : `${fallbackApi}/auth/logout`;

        // Intentar notificar al backend que cerramos sesión
        if (token) {
            try {
                await fetch(logoutUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch {
                // Si falla la llamada al backend, continuamos limpiando localmente
                console.warn('No se pudo notificar al backend del logout');
            }
        }

        // Limpiar siempre, incluso si falló el logout en backend
        clearStorage();
        return true;
    } catch (error) {
        console.error('Error durante logout:', error);
        // Limpiar siempre por seguridad
        clearStorage();
        return false;
    }
};

const fetchWithDynamicHeaders = (
    url: string,
    method: string,
    data: any
) => {
    // Leer token en tiempo de ejecución para evitar usar un valor stale
    const runtimeToken = getToken();
    // Asegurar prefijo Bearer solo si existe token
    const normalizedToken = typeof runtimeToken === 'string' && runtimeToken.length > 0
        ? (runtimeToken.startsWith('Bearer ') ? runtimeToken : `Bearer ${runtimeToken}`)
        : null;

    const headers: HeadersInit = {};

    if (normalizedToken) {
        headers['Authorization'] = normalizedToken;
    }

    // Si no es FormData, añadimos Content-Type: application/json
    const body = data instanceof FormData ? data : JSON.stringify(data);
    if (!(data instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    return fetch(url, {
        method,
        headers,
        body,
    })
    .then(response => {
        if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
    })
    .catch(async (errorResponse) => {
        try {
            const errorBody = await errorResponse.json();
            return Promise.reject(errorBody);
        } catch {
            return Promise.reject({ message: errorResponse.statusText });
        }
    });
};
