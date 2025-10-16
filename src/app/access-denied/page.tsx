'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';
import { removeToken } from '@/services/storageService';

export default function AccessDenied() {
  const router = useRouter();

  const handleLogout = () => {
    // Cerrar sesión eliminando el token
    removeToken();
    // Redirigir al login
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6">
          No tienes permisos para acceder a esta página. 
          Solo los administradores pueden acceder al panel de control.
        </p>
        <div className="space-y-3">
          <Link 
            href="/" 
            className="block w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition"
          >
            Ir al inicio
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar sesión e iniciar con otra cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
