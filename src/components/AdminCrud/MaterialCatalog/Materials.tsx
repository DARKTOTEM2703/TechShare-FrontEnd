import React, { useState } from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';
import DynamicDropdown from '@/components/Dropdowns/DynamicDropdown';

export default function Materials({ token, subCategories, roles, materials, refreshMaterials }: { token: any, subCategories: any, roles: any, materials: any, refreshMaterials: any }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [formData, setFormData] = useState<{ name: string; description: string; price: number; image?: File | null; subCategoryId: number; roleIds: number[] }>({ name: '', description: '', price: 0, image: null, subCategoryId: 0, roleIds: [45] });

    const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } = useCrudOperations(token, refreshMaterials);

    const handleSearchChange = (value: string) => setSearchTerm(value);

    const showCreateModal = () => setCreateModalVisible(true);
    const hideCreateModal = () => setCreateModalVisible(false);

    const showEditModal = () => setEditModalVisible(true);
    const hideEditModal = () => setEditModalVisible(false);

    const showDeleteModal = () => setDeleteModalVisible(true);
    const hideDeleteModal = () => setDeleteModalVisible(false);

    const createButtonClicked = () => {
        setFormData({ name: '', description: '', price: 0, image: null, subCategoryId: 0, roleIds: [45] });
        showCreateModal();
    }

    const editButtonClicked = (id: number) => {
        const selectedMaterial = materials.find((material: any) => material.materialsId === id);
        if (selectedMaterial) {
            setClickedItemId(id);
            setFormData({ name: selectedMaterial.name, description: selectedMaterial.description, price: selectedMaterial.price, image: selectedMaterial.imagePath, subCategoryId: selectedMaterial.subCategoryId, roleIds: [45] });
            showEditModal();
        }
    };

    const deleteButtonClicked = (id: number) => {
        setClickedItemId(id);
        showDeleteModal();
    };

    const handleMaterialCreation = (e: any) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price.toString());
        formDataToSend.append('subCategoryId', formData.subCategoryId.toString());
        formDataToSend.append('roleIds', '45');
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        handleCreate(endpoints.materials.create, formDataToSend);
        hideCreateModal();
    };
    
    const handleMaterialUpdate = (e: any) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price.toString());
        formDataToSend.append('subCategoryId', formData.subCategoryId.toString());
        formDataToSend.append('roleIds', '45');
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        if (clickedItemId !== null) {
            handleUpdate(endpoints.materials.update(clickedItemId), formDataToSend);
        }
        hideEditModal();
    };

    const handleMaterialDeletion = (e: any) => {
        e.preventDefault();
        if (clickedItemId !== null) {
            handleDelete(endpoints.materials.delete(clickedItemId));
        }
        hideDeleteModal();
    };

    return (
        <div>
            <CrudHeader title="Materials" buttonLabel="Add Material" buttonFunction={createButtonClicked} onSearchChange={handleSearchChange} />
            <CrudBody data={materials} searchTerm={searchTerm} onDelete={deleteButtonClicked} onEdit={editButtonClicked} />

            {isCreateModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideCreateModal} header="Create New Material" onSubmit={handleMaterialCreation}>
                            <BorderTextField name="name" placeholder="Material Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                            <BorderTextField name="description" placeholder="Material Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} />
                            <BorderTextField name="price" placeholder="Material Price" onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} value={formData.price} />
                            <DynamicDropdown data={subCategories} valueKey="subCategoriesId" labelKey="name" selectedValue={formData.subCategoryId} onChange={(value: number) => setFormData({ ...formData, subCategoryId: value })} />
                            <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })} />
                        </ModalBase>
                    </div>
                </div>
            )}

            {isEditModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideEditModal} header="Edit Material" onSubmit={handleMaterialUpdate}>
                            <BorderTextField name="name" placeholder="Material Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                            <BorderTextField name="description" placeholder="Material Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} />
                            <BorderTextField name="price" placeholder="Material Price" onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} value={formData.price} />
                            <DynamicDropdown data={subCategories} valueKey="subCategoriesId" labelKey="name" selectedValue={formData.subCategoryId} onChange={(value: number) => setFormData({ ...formData, subCategoryId: value })} />
                            <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })} />
                        </ModalBase>
                    </div>
                </div>
            )}

            {isDeleteModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideDeleteModal} header="Confirm Delete Material" onSubmit={handleMaterialDeletion}>
                            <p>Are you sure you want to delete this material?</p>
                        </ModalBase>
                    </div>
                </div>
            )}
        </div>
    );
}
