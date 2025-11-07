'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useCallback } from 'react';
import { useRoleCheck } from '@/providers/RoleCheckProvider';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
}

/**
 * Componente de protección de rutas por rol
 * - Verifica que el usuario esté autenticado
 * - Verifica que tenga el rol requerido
 * - Redirige a /login si no está autenticado
 * - Redirige a /access-denied si no tiene el rol necesario
 */
export default function RoleGuard({ children, requiredRole = 'ADMIN' }: RoleGuardProps) {
  const router = useRouter();
  const { isLoading, isAdmin, isAuthenticated } = useRoleCheck();
  const hasRedirected = useRef(false);

  const performRedirect = useCallback((destination: string, reason: string) => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    console.log(`${reason}, redirigiendo a ${destination}`);
    router.replace(destination);
  }, [router]);

  useEffect(() => {
    if (isLoading) return;
    if (hasRedirected.current) return;

    console.log(`🔐 RoleGuard: Verificando - isAuthenticated: ${isAuthenticated}, isAdmin: ${isAdmin}, requiredRole: ${requiredRole}`);

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      performRedirect('/login', '🔒 RoleGuard: Usuario no autenticado');
      return;
    }

    // Si requiere rol ADMIN pero no lo tiene, redirigir a acceso denegado
    if (requiredRole === 'ADMIN' && !isAdmin) {
      performRedirect('/access-denied', '⛔ RoleGuard: Usuario sin permisos de ADMIN');
      return;
    }

    console.log('✅ RoleGuard: Permisos verificados correctamente, mostrando contenido');
  }, [isLoading, isAuthenticated, isAdmin, requiredRole, performRedirect]);

  // Mostrar un loading mientras verifica permisos
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si está verificado pero no tiene permisos, mostrar un loading durante la redirección
  if (!isAuthenticated || (requiredRole === 'ADMIN' && !isAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
}
