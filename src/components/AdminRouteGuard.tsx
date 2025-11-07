'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin, isAuthenticated } from '@/utils/authUtils';
import '@/styles/containers.css';
import '@/styles/buttons.css';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

/**
 * Componente protector de rutas de administrador
 * 
 * Verifica que el usuario:
 * 1. Esté autenticado
 * 2. Tenga rol de ADMIN
 * 
 * Si no cumple, muestra mensaje claro y botón para logout
 */
export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Verificar autenticación y permisos
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const isAdminUser = isAdmin();
      
      console.log('AdminRouteGuard - Authenticated:', authenticated);
      console.log('AdminRouteGuard - Is Admin:', isAdminUser);
      
      if (!authenticated) {
        // Si no está autenticado, redirigir a login
        router.push('/login');
        return;
      }
      
      if (!isAdminUser) {
        // Si está autenticado pero no es admin, mostrar mensaje
        setHasAccess(false);
        setIsChecking(false);
        return;
      }
      
      // Si es admin, permitir acceso
      setHasAccess(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  // Mostrar loading mientras verifica
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="form-container text-center">
          <h2 className="text-primary font-bold mb-4">VERIFICANDO PERMISOS</h2>
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p className="text-gray-600">Por favor espera...</p>
        </div>
      </div>
    );
  }

  // Si no tiene acceso, mostrar mensaje claro
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="form-container text-center max-w-md">
          <div className="mb-6">
            <svg 
              className="mx-auto h-16 w-16 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            ACCESO DENEGADO
          </h1>
          
          <p className="text-gray-700 text-lg mb-3">
            No tienes permisos para acceder a esta sección.
          </p>
          
          <p className="text-gray-600 mb-6">
            Esta área está reservada solo para <strong>administradores</strong>.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg 
                  className="h-5 w-5 text-yellow-400" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Si crees que deberías tener acceso, contacta a un administrador.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/home')}
              className="button button-primary w-full"
            >
              Ir al Inicio
            </button>
            
            <button
              onClick={() => router.push('/logout')}
              className="button button-secondary w-full"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si tiene acceso, mostrar el contenido
  return <>{children}</>;
}
