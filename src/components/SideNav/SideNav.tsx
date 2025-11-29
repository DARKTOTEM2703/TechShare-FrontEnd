"use client";

import React, { useState, useEffect } from 'react';
import '@/styles/side-nav.css';
import NavLinks from '@/components/SideNav/NavLinks';
import NavUser from '@/components/SideNav/NavUser';

const SideBar = () => {
    const [isNavVisible, setNavVisible] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const smallScreen = window.innerWidth < 768;
            setIsSmallScreen(smallScreen);
            
            // Cerrar el menú si cambiamos a pantalla grande
            if (!smallScreen) {
                setNavVisible(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleNav = () => {
        setNavVisible(!isNavVisible);
    };

    // Cerrar sidebar al hacer clic en el overlay (solo móvil)
    const closeSidebar = () => {
        if (isSmallScreen) {
            setNavVisible(false);
        }
    };

    return (
        <>
            {/* Overlay oscuro en móvil cuando el sidebar está abierto */}
            {isSmallScreen && isNavVisible && (
                <div 
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                    aria-label="Cerrar menú"
                />
            )}

            {/* Sidebar principal */}
            <div className={`side-bar ${isSmallScreen && isNavVisible ? 'side-bar-open' : ''} ${isSmallScreen && !isNavVisible ? 'side-bar-closed' : ''}`}>
                <div>
                    <div className='border-b-primary md:border-b-[1px] md:mb-4 md:pb-6 border-b-0 mb-0 pb-3'>
                        <NavUser hamburgerButton={toggleNav} />
                    </div>

                    {/* NavLinks siempre renderizados pero con animación en móvil */}
                    <div className={`nav-links-container ${isSmallScreen && !isNavVisible ? 'nav-hidden' : ''}`}>
                        <NavLinks />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SideBar;
