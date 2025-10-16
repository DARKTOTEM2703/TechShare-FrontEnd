'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRoleCheck } from '@/hooks/useRoleCheck';

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
  const { isLoading, isAdmin, isAuthenticated, userData } = useRoleCheck();

  useEffect(() => {
    if (isLoading) return; // Esperar a que termine de cargar

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Si requiere rol ADMIN pero no lo tiene, redirigir a acceso denegado
    if (requiredRole === 'ADMIN' && !isAdmin) {
      router.push('/access-denied');
      return;
    }
  }, [isLoading, isAuthenticated, isAdmin, requiredRole, router]);

  // Mostrar un loading mientras verifica permisos
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no tiene permiso, no mostrar nada (ya se redirigió)
  if (!isAuthenticated || (requiredRole === 'ADMIN' && !isAdmin)) {
    return null;
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
}
