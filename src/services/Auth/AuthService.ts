import { setTokenWithClaims, setUserEmail } from "@/services/storageService";

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

        const authHeader = response.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('No token in response');
        }
        const token = authHeader.replace('Bearer ', '');

    // Store token and extract claims (id, user_name)
    setTokenWithClaims(token);
    setUserEmail(email);

        return token;
    } catch (error) {
        throw error;
    }
};
