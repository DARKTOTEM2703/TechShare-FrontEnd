"use client"; // This directive marks the file as a Client Component

import React, { useState, useEffect } from 'react';
import '@/styles/side-nav.css'; // Asegúrate de tener este archivo CSS correctamente
import NavLinks from '@/components/SideNav/NavLinks';
import NavUser from '@/components/SideNav/NavUser';

const SideBar = () => {
    // Estado para controlar la visibilidad de los enlaces
    const [isNavVisible, setNavVisible] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Efecto para detectar cambios en el tamaño de la pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // Considera 768px como el límite para pantallas pequeñas
        };

        // Llamar a handleResize al montar el componente
        handleResize();

        // Agregar un listener para el redimensionamiento de la ventana
        window.addEventListener('resize', handleResize);

        // Limpiar el listener cuando el componente se desmonte
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Función para alternar la visibilidad del menú
    const toggleNav = () => {
        setNavVisible(!isNavVisible);
    };

    return (
        <div className="side-bar">
            <div>
                <div className='border-b-primary md:border-b-[1px] md:mb-4 md:pb-6 border-b-0 mb-0 pb-3'>
                    <NavUser hamburgerButton={toggleNav} />
                </div>

                {/* Mostrar siempre los NavLinks en pantallas grandes */}
                {!isSmallScreen && (
                    <div>
                        <NavLinks />
                    </div>
                )}

                {/* Solo mostrar los NavLinks togglables en pantallas pequeñas */}
                {isSmallScreen && isNavVisible && (
                    <div>
                        <NavLinks />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;
