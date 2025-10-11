'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import links from './navlinks.json';
import * as FaIcons from 'react-icons/fa';
import { removeToken } from '@/services/storageService';
import '@/styles/side-nav.css';

export default function NavLinks() {
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const router = useRouter();

  const handleLinkClick = (name: string) => {
    setSelectedLink(name);
  };

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      removeToken();
      router.push('/login');
    }
  };

  return (
    <div className="md:flex md:items-center md:justify-start">
      {/* Contenedor para pantallas pequeñas */}
      <div className="fixed left-0 w-full h-screen bg-white shadow-lg z-50 md:hidden p-4 flex flex-col justify-start gap-2">
        {links.map((link) => {
          const LinkIcon = FaIcons[link.icon as keyof typeof FaIcons];
          const isSelected = selectedLink === link.name;

          return (
            <div key={link.name} className="flex justify-center w-full">
              <Link
                href={link.href}
                className={`flex h-[48px] items-center justify-center gap-2 w-full rounded-md p-3 text-sm font-medium text-secondary md:flex-none md:justify-start md:p-2 md:px-3 transition-all duration-300 ease-in-out ${isSelected ? 'bg-secondary text-white transform scale-105' : 'hover:bg-sky-100 hover:text-blue-600'}`}
                onClick={() => handleLinkClick(link.name)}
              >
                {LinkIcon && <LinkIcon />}
                <h2 className={`font-medium text-xl ${isSelected ? 'nav-link-text-selected' : 'nav-link-text'}`}>
                  {link.name}
                </h2>
              </Link>
            </div>
          );
        })}
        
        {/* Botón de Cerrar Sesión - Pantallas pequeñas */}
        <div className="flex justify-center w-full mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex h-[48px] items-center justify-center gap-2 w-full rounded-md p-3 text-sm font-medium logout-btn hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out"
          >
            <FaIcons.FaSignOutAlt />
            <h2 className="font-medium text-xl">
              Cerrar Sesión
            </h2>
          </button>
        </div>
      </div>

      {/* Contenedor para pantallas grandes */}
      <div className="w-full">
        {links.map((link) => {
          const LinkIcon = FaIcons[link.icon as keyof typeof FaIcons];
          const isSelected = selectedLink === link.name;

          return (
            <div key={link.name} className="flex justify-center md:justify-start md:mr-4">
              <Link
                href={link.href}
                className={`flex h-[48px] w-full items-center justify-center gap-2 rounded-md p-3 text-sm font-medium text-secondary md:flex-none md:justify-start md:p-2 md:px-3 transition-all duration-300 ease-in-out ${isSelected ? 'bg-secondary text-white transform scale-105' : 'hover:bg-sky-100 hover:text-blue-600'}`}
                onClick={() => handleLinkClick(link.name)}
              >
                {LinkIcon && <LinkIcon />}
                <h2 className={`font-medium text-xl ${isSelected ? 'nav-link-text-selected' : 'nav-link-text'}`}>
                  {link.name}
                </h2>
              </Link>
            </div>
          );
        })}
        
        {/* Botón de Cerrar Sesión - Pantallas grandes */}
        <div className="flex justify-center md:justify-start md:mr-4 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md p-3 text-sm font-medium logout-btn hover:bg-red-50 hover:text-red-600 transition-all duration-300 ease-in-out md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <FaIcons.FaSignOutAlt />
            <h2 className="font-medium text-xl">
              Cerrar Sesión
            </h2>
          </button>
        </div>
      </div>
    </div>
  );
}
