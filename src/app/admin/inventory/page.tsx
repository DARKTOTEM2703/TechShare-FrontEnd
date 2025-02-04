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
import { Material } from '@/app/admin/catalog/interfaces/Material';
import '@/styles/modal.css'
import ModalBase from '@/components/Modal/ModalBase';

const Inventory = () => {
  useAuth();
  const token = getToken() || '';

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
    const interval = setInterval(() => {
      fetchMaterials();
    }
      , 5000);
    return () => clearInterval(interval);
  }, []);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const openConfirmModal = (action: () => void) => {
    setPendingAction(() => action); // Almacena la acción pendiente
    setIsConfirmModalOpen(true);
  };

  const handleMovementConfirm = () => {
    if (pendingAction) {
      pendingAction(); // Ejecuta la acción pendiente
      setPendingAction(null); // Limpia la acción
    }
    setIsConfirmModalOpen(false); // Cierra el modal
  };

  const closeConfirmModal = () => {
    setPendingAction(null);
    setIsConfirmModalOpen(false);
  };

  const headerLabels = {
    'name': 'Nombre',
    'stock': 'Stock Total',
    'borrowable_stock': 'Stock Prestable'
  };

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
            headerLabels={headerLabels}
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
            openConfirmModal={openConfirmModal}
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
      {/* Confirm Modal */}
      {isConfirmModalOpen && (
        <div className='modal-overlay'>
          <ModalBase
            onClose={closeConfirmModal}
            header='Confirmar acción'
            onSubmit={handleMovementConfirm}>
            <p>¿Está seguro de realizar esta acción?</p>
          </ModalBase>
        </div>
      )}
    </div>
  );
};


export default Inventory;
