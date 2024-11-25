"use client"
import React, { useState, useEffect } from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBody';
import NewMovementForm from '@/components/AdminCrud/InventoryPage/NewMovementForm';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/services/storageService';
import fetchData from '@/services/fetchData';
import endpoints from '@/app/infraestructure/config/configAPI';

const Inventory = () => {

  useAuth();
  const token = getToken();

  type Material = {
    image: File;
    name: string;
    description: string;
    price: number;
    subCategoryId: number;
    roleIds: number[];
  };

  const [materials, setMaterials] = useState<Material[]>([]);

  const fetchMaterials = () => {
    fetchData(endpoints.materials.getAll, token)
      .then((data) => setMaterials(data))
  }

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div>
      <CrudHeader title="Inventario"
        buttonLabel=''
        buttonDisabled={true}
        buttonFunction={() => { }}
        onSearchChange={() => { }} />
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <CrudBody
            data={materials}
            headers={['name', 'stock', 'borrowable_stock']}
            searchTerm=""
            onDelete={() => { }}
            onEdit={() => { }}
          />
        </div>
        <div className="">
          <NewMovementForm />
        </div>
      </div>
    </div>
  );
}

export default Inventory;
