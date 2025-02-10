import endpoints from "@/app/infraestructure/config/configAPI";
import { error } from "console";

export const loginUser = async (email: string, password: string): Promise<string | null> => {
    try {
        const response = await fetch(endpoints.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            // Primero intentamos obtener el texto del error
            const errorText = await response.text();
            
            try {
                // Intentamos parsearlo como JSON
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.message || `Error de autenticación: ${response.status}`);
            } catch (parseError) {
                // Si no es JSON, usamos el texto directamente
                throw new Error(errorText || `Error de autenticación: ${response.statusText}`);
            }
        }

        const token = response.headers.get('Authorization');
        if (!token) {
            console.warn('Token no encontrado en el header "Authorization".');
            return null;
        }

        return token;
    } catch (error) {
        throw error;
    }
};
