'use client'; // Marca este archivo como un Client Component

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SideNav from "@/components/SideNav/SideNav";
import { FaBars } from 'react-icons/fa';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [isNavVisible, setNavVisible] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [pathname]);

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
        <>
            {/* Botón hamburguesa fijo - solo visible en móvil */}
            {isSmallScreen && !isNavVisible && (
                <button
                    onClick={toggleNav}
                    className="fixed top-4 left-4 z-[998] bg-primary text-white p-3 rounded-lg shadow-lg hover:bg-primary/90 transition-all md:hidden"
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

            <div className="horizontal-flex">
                <SideNav 
                    isNavVisible={isNavVisible} 
                    toggleNav={toggleNav}
                    closeSidebar={closeSidebar}
                />
                <div className="content">
                    {loading ? (
                        <div className="loading-spinner">Loading...</div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </>
    );
}
