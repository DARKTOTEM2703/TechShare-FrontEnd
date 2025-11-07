'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/services/Auth/AuthService';
import { useToast } from '@/components/Ui/ToastContext';
import '@/styles/containers.css';
import '@/styles/buttons.css';

/**
 * Página de Logout
 * Se encarga de:
 * 1. Llamar a logoutUser() para notificar al backend y limpiar storage
 * 2. Redirigir a /login después de que se complete el logout
 */
export default function LogoutPage() {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const success = await logoutUser();
        
        if (success) {
          toast.addToast('success', 'Sesión cerrada exitosamente');
        } else {
          toast.addToast('info', 'Sesión cerrada (con algunos problemas de sincronización)');
        }

        // Redirigir a login después de 1 segundo para que vea el toast
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        toast.addToast('error', 'Error al cerrar sesión');
        
        // Redirigir a login de todas formas
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    };

    performLogout();
  }, [router, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="form-container text-center">
        <h1 className="text-primary font-bold mb-6">CERRANDO SESIÓN</h1>
        
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>

        <p className="text-gray-600 mb-4">Por favor espera mientras cerramos tu sesión...</p>
        
        <p className="text-sm text-gray-500">Serás redirigido a la página de login en breve.</p>
      </div>
    </div>
  );
}
