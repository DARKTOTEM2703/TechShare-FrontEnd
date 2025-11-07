'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
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

interface RoleCheckContextType {
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  userData: UserData | null;
  error: string | null;
}

const RoleCheckContext = createContext<RoleCheckContextType | undefined>(undefined);

export function RoleCheckProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RoleCheckContextType>({
    isLoading: true,
    isAdmin: false,
    isAuthenticated: false,
    userData: null,
    error: null,
  });

  // useRef para evitar múltiples ejecuciones, incluso en React Strict Mode
  const hasExecuted = useRef(false);

  useEffect(() => {
    // Si ya ejecutamos, no hacer nada
    if (hasExecuted.current) {
      console.log('✅ RoleCheckProvider: Ya ejecutado, saltando...');
      return;
    }

    // Marcar como ejecutado ANTES de cualquier operación async
    hasExecuted.current = true;

    console.log('🔍 RoleCheckProvider: Iniciando verificación de roles (GLOBAL)...');

    // Asegurar que estamos en el cliente y el DOM está listo
    if (typeof window === 'undefined') {
      console.log('⚠️ RoleCheckProvider: No estamos en el cliente, saltando');
      return;
    }

    const checkRole = async () => {
      try {
        const token = getToken();
        console.log('🔑 RoleCheckProvider: Token encontrado:', token ? `${token.substring(0, 20)}...` : 'NO');

        if (!token) {
          console.log('🔒 RoleCheckProvider: No hay token, usuario no autenticado');
          setState({
            isLoading: false,
            isAdmin: false,
            isAuthenticated: false,
            userData: null,
            error: null,
          });
          return;
        }

        console.log(`📡 RoleCheckProvider: Fetching ${endpoints.users.getUserDetails} con token...`);

        const response = await fetch(endpoints.users.getUserDetails, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Incluir cookies si es necesario
        });

        console.log(`📊 RoleCheckProvider: Response status: ${response.status}`);

        if (response.status === 401) {
          console.warn('⚠️ RoleCheckProvider: Token inválido o expirado (401)');
          console.warn('🔑 Token enviado:', token.substring(0, 50) + '...');
          console.warn('📋 Detalles: El backend rechazó el token. Posibles causas:');
          console.warn('   1. Token expirado');
          console.warn('   2. Token inválido o modificado');
          console.warn('   3. Backend tiene diferente clave secreta');
          setState({
            isLoading: false,
            isAdmin: false,
            isAuthenticated: false,
            userData: null,
            error: 'Token inválido o expirado',
          });
          return;
        }

        if (!response.ok) {
          console.warn('⚠️ RoleCheckProvider: Error HTTP:', response.status, response.statusText);
          setState({
            isLoading: false,
            isAdmin: false,
            isAuthenticated: false,
            userData: null,
            error: `Error ${response.status}`,
          });
          return;
        }

        const data: UserData = await response.json();
        console.log('📦 RoleCheckProvider: Data recibido:', JSON.stringify(data));

        const hasAdminRole = data.roles.some(role => {
          const normalizedRole = role.toUpperCase();
          const isAdmin = normalizedRole.includes('ADMIN');
          console.log(`   → Role: ${role} (${normalizedRole}) = isAdmin: ${isAdmin}`);
          return isAdmin;
        });

        console.log(`✅ RoleCheckProvider: Usuario autenticado - isAdmin: ${hasAdminRole}, roles: ${data.roles.join(', ')}`);

        setState({
          isLoading: false,
          isAdmin: hasAdminRole,
          isAuthenticated: true,
          userData: data,
          error: null,
        });
      } catch (err) {
        console.error('❌ RoleCheckProvider: Error:', err);
        setState({
          isLoading: false,
          isAdmin: false,
          isAuthenticated: false,
          userData: null,
          error: err instanceof Error ? err.message : 'Error desconocido',
        });
      }
    };

    checkRole();
  }, []); // Se ejecuta UNA sola vez al montar

  return (
    <RoleCheckContext.Provider value={state}>
      {children}
    </RoleCheckContext.Provider>
  );
}

export function useRoleCheck(): RoleCheckContextType {
  const context = useContext(RoleCheckContext);
  if (!context) {
    throw new Error('useRoleCheck debe estar dentro de RoleCheckProvider');
  }
  return context;
}
