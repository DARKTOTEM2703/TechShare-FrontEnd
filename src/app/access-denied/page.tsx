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
    <div className="flex items-center justify-center min-h-screen bg-[#7C93C3] px-4 py-6">
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform transition-all hover:scale-[1.01]">
        <FaExclamationTriangle className="text-red-500 text-5xl md:text-6xl mx-auto mb-4 animate-pulse" />
        
        <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-2">
          ⛔ ACCESO DENEGADO
        </h1>
        
        <p className="text-gray-700 text-sm md:text-base mb-2">
          No tienes permisos para acceder a esta sección.
        </p>
        
        <p className="text-gray-600 text-xs md:text-sm mb-5">
          Esta área está reservada solo para <strong>administradores</strong>.
          Has iniciado sesión correctamente, pero tu cuenta no tiene privilegios de administrador.
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4 mb-5 text-left rounded-r-lg">
          <p className="text-xs md:text-sm text-yellow-700">
            💡 <strong>¿Necesitas acceso?</strong><br />
            Contacta a un administrador del sistema para solicitar permisos de administrador.
          </p>
        </div>
        
        <div className="space-y-2.5">
          <Link 
            href="/home" 
            className="flex items-center justify-center gap-2 w-full bg-primary text-white py-2.5 md:py-3 px-4 rounded-lg hover:bg-primary/90 transition-all font-semibold text-sm md:text-base shadow-md hover:shadow-lg"
          >
            <FaHome className="text-base md:text-lg" /> Ir al Inicio
          </Link>
          
          <Link 
            href="/profile" 
            className="flex items-center justify-center gap-2 w-full bg-blue-500 text-white py-2.5 md:py-3 px-4 rounded-lg hover:bg-blue-600 transition-all font-semibold text-sm md:text-base shadow-md hover:shadow-lg"
          >
            <FaUser className="text-base md:text-lg" /> Ver Mi Perfil
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-800 py-2.5 md:py-3 px-4 rounded-lg hover:bg-gray-300 transition-all font-semibold text-sm md:text-base shadow-md hover:shadow-lg"
          >
            <FaSignOutAlt className="text-base md:text-lg" /> Cerrar Sesión
          </button>
        </div>
        
        <div className="mt-5 pt-5 border-t border-gray-200">
          <p className="text-[10px] md:text-xs text-gray-500">
            Si crees que esto es un error, cierra sesión e intenta iniciar sesión nuevamente.
          </p>
        </div>
      </div>
    </div>
  );
}
