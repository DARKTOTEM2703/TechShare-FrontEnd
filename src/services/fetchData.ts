// Función genérica para realizar una solicitud fetch
const fetchData = async (url:any, token:any) => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
        });

        // Si la respuesta es 204 No Content, devuelve un array vacío
        if (response.status === 204) {
            console.log('No hay contenido, respuesta', response.status)
            return [];
        }

        // Verifica si hay contenido antes de intentar parsearlo
        const contentType = response.headers.get("Content-Type") || "";
        const data = contentType.includes("application/json")
            ? await response.json()
            : null;

        if (Array.isArray(data)) {
            return data.reverse(); // Aplica reverse para mostrar los más antiguos primero.
        }

        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error; // Repropaga el error si necesitas manejarlo más arriba.
    }
};

export default fetchData;
