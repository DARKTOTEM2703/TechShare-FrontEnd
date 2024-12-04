"use client"
import React, { useState, useEffect } from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyViewOnly';
import NewMovementForm from '@/components/AdminCrud/InventoryPage/NewMovementForm';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/services/storageService';
import fetchData from '@/services/fetchData';
import endpoints from '@/app/infraestructure/config/configAPI';
import MaterialInfo from '@/components/AdminCrud/InfoModals/MaterialInfo';
import '@/styles/modal.css'

const Inventory = () => {
  useAuth();
  const token = getToken() || '';

  type Material = {
    materialsId: number;
    imagePath: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    borrowable_stock: number;
    subCategoryId: number;
    subCategoryName: string;
    roleIds: number[];
    roleNames: string[];
  };

  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<{ id: number; name: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialInfo, setMaterialInfo] = useState<Material | null>(null);

  const handleSearchChange = (value: string) => setSearchTerm(value);

  const fetchMaterials = () => {
    fetchData(endpoints.materials.getAll, token)
      .then((data) => setMaterials(data));
  };

  const clickedItem = (id: number) => {
    const selected = materials.find((material) => material.materialsId === id);
    if (selected) {
      setSelectedMaterial({ id: selected.materialsId, name: selected.name });
    }
  };

  const clickedMoreInfo = (id: number) => {
    const selected = materials.find((material) => material.materialsId === id);
    if (selected) {
      setMaterialInfo(selected);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMaterialInfo(null);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div>
      <CrudHeader
        title="Inventario"
        dropdownOptions={[]}
        buttonLabel=""
        buttonDisabled={true}
        buttonFunction={() => { }}
        onSearchChange={handleSearchChange}
      />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 w-auto">
          <CrudBody
            data={materials}
            headers={['name', 'stock', 'borrowable_stock']}
            searchTerm={searchTerm}
            onSelected={(id) => { clickedItem(id) }}
            onMoreInfo={(id) => { clickedMoreInfo(id) }}
          />
        </div>
        <div className="min-w-[50vh]">
          <NewMovementForm
            token={token}
            refreshData={fetchMaterials}
            selectedMaterial={selectedMaterial}
          />
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && materialInfo && (
        <div className='modal-overlay'>
          <div className="fixed inset-0 flex items-center justify-center z-60">
            <MaterialInfo
              material={materialInfo}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
