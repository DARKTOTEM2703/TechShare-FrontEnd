'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
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
  recheck: () => void;
}

const RoleCheckContext = createContext<RoleCheckContextType | undefined>(undefined);

export function RoleCheckProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<RoleCheckContextType, 'recheck'>>({
    isLoading: true,
    isAdmin: false,
    isAuthenticated: false,
    userData: null,
    error: null,
  });

  const checkRole = useCallback(async () => {
    setState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const token = getToken();

      if (!token) {
        setState({
          isLoading: false,
          isAdmin: false,
          isAuthenticated: false,
          userData: null,
          error: null,
        });
        return;
      }

      const response = await fetch(endpoints.users.getUserDetails, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401) {
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

      const hasAdminRole = data.roles.some(role => {
        const normalizedRole = role.toUpperCase();
        return normalizedRole.includes('ADMIN');
      });

      setState({
        isLoading: false,
        isAdmin: hasAdminRole,
        isAuthenticated: true,
        userData: data,
        error: null,
      });
    } catch (err) {
      setState({
        isLoading: false,
        isAdmin: false,
        isAuthenticated: false,
        userData: null,
        error: err instanceof Error ? err.message : 'Error desconocido',
      });
    }
  }, []);

  useEffect(() => {
    checkRole();
  }, [checkRole]);

  const contextValue = {
    ...state,
    recheck: checkRole,
  };

  return (
    <RoleCheckContext.Provider value={contextValue}>
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
