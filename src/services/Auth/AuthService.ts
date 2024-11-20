import endpoints from "@/app/infraestructure/config/configAPI";

export const loginUser = async (email: string, password: string): Promise<string | null> => {
    try {
        const response = await fetch(endpoints.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.statusText}`);
        }

        const token = response.headers.get('Authorization');
        if (!token) {
            console.warn('Token no encontrado en el header "Authorization".');
            return null;
        }

        return token;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};
