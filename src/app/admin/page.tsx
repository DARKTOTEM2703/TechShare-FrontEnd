'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Página de redirección para /admin
 * Redirige automáticamente a /admin/users (primera sección del panel admin)
 * El RoleGuard en layout.tsx ya verifica permisos antes de llegar aquí
 */
export default function AdminDashboard() {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Prevenir múltiples redirecciones
    if (hasRedirected.current) return;
    
    hasRedirected.current = true;
    // Redirigir a la primera sección del admin
    router.replace('/admin/users');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirigiendo al panel de administración...</p>
      </div>
    </div>
  );
}

