"use client"; // This directive marks the file as a Client Component

import React from 'react';
import '@/styles/side-nav.css'; // Make sure to create and style this CSS file
import NavLinks from '@/components/SideNav/NavLinks';
import NavUser from '@/components/SideNav/NavUser';

const SideBar = () => {
    return (
        <div>
            <div className='border-b-primary border-b-[1px] mb-4 pb-6' style={{ paddingBottom: '26x' }}>
                <NavUser />
            </div>
            <NavLinks />
        </div>

    );
};

export default SideBar;