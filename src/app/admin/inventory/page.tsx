"use client"
import React from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader'

const Inventory = () => {
    return (
        <div>
            <CrudHeader title="Inventario"
                buttonLabel=''
                buttonDisabled={true}
                buttonFunction={() => { }}
                onSearchChange={() => { }} />

        </div>
    );
}

export default Inventory;
