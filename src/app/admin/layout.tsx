'use client';

import type { Metadata } from "next";
import SideNav from "@/components/SideNav/SideNav";
import 'react-image-crop/dist/ReactCrop.css'
import { ToastProvider } from '@/components/Ui/ToastContext';
import RoleGuard from '@/components/Auth/RoleGuard';
import { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';

export default function AdminLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const [isNavVisible, setNavVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth < 768;
      setIsSmallScreen(smallScreen);
      if (!smallScreen) {
        setNavVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleNav = () => setNavVisible(!isNavVisible);
  const closeSidebar = () => setNavVisible(false);

  return (
    <ToastProvider>
      <RoleGuard requiredRole="ADMIN">
        {/* Botón hamburguesa fijo - solo visible en móvil */}
        {isSmallScreen && (
          <button
            onClick={toggleNav}
            className="fixed top-4 left-4 z-[1001] bg-primary text-white p-3 rounded-lg shadow-lg hover:bg-primary/90 transition-all md:hidden"
            aria-label="Abrir menú de navegación"
            title="Menú"
          >
            <FaBars className="text-xl" />
          </button>
        )}

        {/* Overlay oscuro cuando sidebar abierto */}
        {isSmallScreen && isNavVisible && (
          <div 
            className="fixed inset-0 bg-black/50 z-[999]"
            onClick={closeSidebar}
          />
        )}

        <div className={`horizontal-flex`}>
          <div className="side-nav">
            <SideNav 
              isNavVisible={isNavVisible} 
              toggleNav={toggleNav}
              closeSidebar={closeSidebar}
            />
          </div>
          <div className="content">
            {children}
          </div>
        </div>
      </RoleGuard>
    </ToastProvider>
  );
}
