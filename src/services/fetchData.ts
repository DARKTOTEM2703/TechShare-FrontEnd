// Función genérica para realizar una solicitud fetch
const fetchData = async (url:any, token:any) => {
    try {
        // Normalize token header: ensure it includes 'Bearer ' prefix when needed
        let authHeader = token || '';
        if (typeof authHeader === 'string' && authHeader.length > 0 && !authHeader.startsWith('Bearer ')) {
            authHeader = `Bearer ${authHeader}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
        });

        // Si la respuesta es 204 No Content, devuelve un array vacío
        if (response.status === 204) {
            console.log('No hay contenido, respuesta', response.status)
            return [];
        }

        // Manejar autorización: para endpoints que esperan listas, devolver array vacío y loggear
        if (response.status === 401 || response.status === 403) {
            console.warn('Unauthorized response from', url, response.status);
            return [];
        }

        // Verifica si hay contenido antes de intentar parsearlo
        const contentType = response.headers.get("Content-Type") || "";
        let data: any = null;
        if (contentType.includes("application/json")) {
            data = await response.json();
        } else if (contentType.includes("text/")) {
            // Log textual responses for debugging (HTML error pages, etc.)
            const text = await response.text();
            console.warn('Non-JSON response body for', url, ':', text);
            data = text;
        }

        // Normalizar respuestas: si el endpoint devuelve un array, devolverlo.
        // Si devuelve un objeto con campos comunes que contienen arrays (data, items, content), extraerlos.
        // En caso contrario, devolver [] para las llamadas que esperan listas.
        if (Array.isArray(data)) {
            return data.reverse(); // Aplica reverse para mostrar los más antiguos primero.
        }

        if (data && typeof data === 'object') {
            const possibleArrays = [data.data, data.items, data.content, data.results];
            for (const candidate of possibleArrays) {
                if (Array.isArray(candidate)) {
                    return candidate.reverse();
                }
            }
        }

    // Si no hay array, devolvemos un array vacío para evitar errores en componentes que esperan listas
    console.warn('fetchData: expected array but got', typeof data, data, 'from', url);
    return [];
    } catch (error) {
        console.error("Error:", error);
        throw error; // Repropaga el error si necesitas manejarlo más arriba.
    }
};

export default fetchData;
