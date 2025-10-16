import { useState, useEffect } from 'react';
import { getToken } from '@/services/storageService';
import endpoints from '@/app/infraestructure/config/configAPI';

interface UserData {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

interface UseRoleCheckResult {
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  userData: UserData | null;
  error: string | null;
}

/**
 * Hook personalizado para verificar el rol del usuario autenticado
 * Llama al endpoint /user/me para obtener los datos y roles del usuario
 * 
 * @returns {UseRoleCheckResult} Estado con datos del usuario y verificación de roles
 */
export function useRoleCheck(): UseRoleCheckResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = getToken();
        
        // Si no hay token, no está autenticado
        if (!token) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Llamar al endpoint /user/me
        const response = await fetch(endpoints.users.getUserDetails, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener información del usuario');
        }

        const data: UserData = await response.json();
        
        setUserData(data);
        setIsAuthenticated(true);
        
        // Verificar si tiene rol ADMIN (puede venir como "ROLE_ADMIN" o "admin")
        const hasAdminRole = data.roles.some(role => 
          role.toUpperCase().includes('ADMIN')
        );
        
        setIsAdmin(hasAdminRole);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkRole();
  }, []);

  return { isLoading, isAdmin, isAuthenticated, userData, error };
}
