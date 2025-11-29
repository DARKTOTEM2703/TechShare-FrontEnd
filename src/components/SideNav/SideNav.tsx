"use client";

import React from 'react';
import '@/styles/side-nav.css';
import NavLinks from '@/components/SideNav/NavLinks';
import NavUser from '@/components/SideNav/NavUser';

interface SideBarProps {
    isNavVisible: boolean;
    toggleNav: () => void;
    closeSidebar: () => void;
}

const SideBar = ({ isNavVisible, toggleNav, closeSidebar }: SideBarProps) => {
    return (
        <div className={`side-bar ${isNavVisible ? 'side-bar-open' : ''}`}>
            <div>
                <div className='border-b-primary md:border-b-[1px] md:mb-4 md:pb-6 border-b-0 mb-0 pb-3'>
                    {/* Ya no necesitamos el botón hamburguesa aquí - está en el layout */}
                    <NavUser />
                </div>

                {/* NavLinks siempre renderizados */}
                <div className="nav-links-container">
                    <NavLinks onLinkClick={closeSidebar} />
                </div>
            </div>
        </div>
    );
};

export default SideBar;
