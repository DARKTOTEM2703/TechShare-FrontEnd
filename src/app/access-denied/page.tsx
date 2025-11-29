'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle, FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';
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
    <div className="flex items-center justify-center min-h-screen bg-[#7C93C3]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <FaExclamationTriangle className="text-red-500 text-7xl mx-auto mb-4 animate-pulse" />
        
        <h1 className="text-4xl font-bold text-red-600 mb-3">
          ⛔ ACCESO DENEGADO
        </h1>
        
        <p className="text-gray-700 text-lg mb-2">
          No tienes permisos para acceder a esta sección.
        </p>
        
        <p className="text-gray-600 mb-6">
          Esta área está reservada solo para <strong>administradores</strong>.
          Has iniciado sesión correctamente, pero tu cuenta no tiene privilegios de administrador.
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
          <p className="text-sm text-yellow-700">
            💡 <strong>¿Necesitas acceso?</strong><br />
            Contacta a un administrador del sistema para solicitar permisos de administrador.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link 
            href="/home" 
            className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition font-semibold"
          >
            <FaHome /> Ir al Inicio
          </Link>
          
          <Link 
            href="/profile" 
            className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            <FaUser /> Ver Mi Perfil
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Si crees que esto es un error, cierra sesión e intenta iniciar sesión nuevamente.
          </p>
        </div>
      </div>
    </div>
  );
}
