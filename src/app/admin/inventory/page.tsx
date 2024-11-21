"use client"
import React from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import NewMovementForm from '@/components/AdminCrud/InventoryPage/NewMovementForm';

const Inventory = () => {
    return (
        <div>
            <CrudHeader title="Inventario"
                buttonLabel=''
                buttonDisabled={true}
                buttonFunction={() => { }}
                onSearchChange={() => { }} />
            <NewMovementForm />
        </div>
    );
}

export default Inventory;
