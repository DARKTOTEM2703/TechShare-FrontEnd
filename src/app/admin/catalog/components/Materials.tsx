import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';
import { useImageCrop } from '@/hooks/useReactCrop';
import CreateMaterialModal from './modals/CreateMaterialModal';
import EditMaterialModal from './modals/EditMaterialModal';
import DeleteMaterialModal from './modals/DeleteMaterialModal';

export default function Materials({ token, subCategories, roles, materials, refreshMaterials, ASPECT_RATIO, MIN_DIMENSION, MIN_WIDTH }: { token: string, subCategories: any[], roles: any[], materials: any[], refreshMaterials: () => void, ASPECT_RATIO: number, MIN_DIMENSION: number, MIN_WIDTH: number }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [formData, setFormData] = useState<{ name: string; description: string; price: number; image?: File | null; imagePreview?: string | null; subCategoryId: number; roleIds: number[] }>({ name: '', description: '', price: 0, image: null, imagePreview: null, subCategoryId: 0, roleIds: [] });
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

    const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } = useCrudOperations(token, refreshMaterials);

    const {
        imageUrl,
        setImageUrl,
        crop,
        applyCrop,
        setCrop,
        imageRef,
        previewImageRef,
        isImageCropping,
        onSelectFile,
        onImageLoad,
        setIsImageCropping
    } = useImageCrop({ ASPECT_RATIO, MIN_DIMENSION, MIN_WIDTH });

    const roleOptions = roles.map((role: any) => ({
        value: role.roleId,
        label: role.name,
    }));

    const handleSearchChange = (value: string) => setSearchTerm(value);

    const showCreateModal = () => setCreateModalVisible(true);
    const hideCreateModal = () => {
        setCreateModalVisible(false);
        setFormData({ name: '', description: '', price: 0, image: null, imagePreview: null, subCategoryId: 0, roleIds: [] });
        setIsImageCropping(false);
        setImageUrl('');
        setCrop(undefined);
    };

    const showEditModal = () => setEditModalVisible(true);
    const hideEditModal = () => {
        setEditModalVisible(false);
        setFormData({ name: '', description: '', price: 0, image: null, imagePreview: null, subCategoryId: 0, roleIds: [] });
        setIsImageCropping(false);
        setImageUrl('');
        setCrop(undefined);
    };

    const showDeleteModal = () => setDeleteModalVisible(true);
    const hideDeleteModal = () => setDeleteModalVisible(false);

    const createButtonClicked = () => {
        setFormData({ name: '', description: '', price: 0, image: null, imagePreview: null, subCategoryId: 0, roleIds: [] });
        showCreateModal();
    };

    const editButtonClicked = (id: number) => {
        const selectedMaterial = materials.find((material: any) => material.materialsId === id);
        setSelectedMaterial(selectedMaterial);
        if (selectedMaterial) {
            setClickedItemId(id);
            setFormData({
                name: selectedMaterial.name,
                description: selectedMaterial.description,
                price: selectedMaterial.price,
                image: null,
                imagePreview: selectedMaterial.imagePath,
                subCategoryId: selectedMaterial.subCategoryId,
                roleIds: selectedMaterial.roleIds,
            });
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
        formDataToSend.append('roleIds', formData.roleIds.toString());

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
        formDataToSend.append('roleIds', formData.roleIds.toString());

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

    const loadRoleOptions = (inputValue: string, callback: (options: any[]) => void) => {
        const filteredOptions = roleOptions.filter((role: any) =>
            role.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
    };

    return (
        <div>
            <CrudHeader title="Materials" dropdownOptions={[]} buttonLabel="Añadir material" buttonFunction={createButtonClicked} onSearchChange={handleSearchChange} />
            <CrudBody data={materials} searchTerm={searchTerm} onDelete={deleteButtonClicked} onEdit={editButtonClicked} />
            <CreateMaterialModal
                isVisible={isCreateModalVisible}
                onClose={hideCreateModal}
                onSubmit={handleMaterialCreation}
                formData={formData}
                setFormData={setFormData}
                subCategories={subCategories}
                roleOptions={roleOptions}
                loadRoleOptions={loadRoleOptions}
                isImageCropping={isImageCropping}
                imageUrl={imageUrl}
                crop={crop}
                setCrop={setCrop}
                imageRef={imageRef}
                previewImageRef={previewImageRef}
                onSelectFile={onSelectFile}
                onImageLoad={onImageLoad}
                applyCrop={applyCrop}
                ASPECT_RATIO={ASPECT_RATIO}
                MIN_WIDTH={MIN_WIDTH}
            />
            <EditMaterialModal
                isVisible={isEditModalVisible}
                onClose={hideEditModal}
                onSubmit={handleMaterialUpdate}
                formData={formData}
                setFormData={setFormData}
                subCategories={subCategories}
                roleOptions={roleOptions}
                loadRoleOptions={loadRoleOptions}
                selectedMaterial={selectedMaterial}
                isImageCropping={isImageCropping}
                imageUrl={imageUrl}
                crop={crop}
                setCrop={setCrop}
                imageRef={imageRef}
                previewImageRef={previewImageRef}
                onSelectFile={onSelectFile}
                onImageLoad={onImageLoad}
                applyCrop={applyCrop}
                ASPECT_RATIO={ASPECT_RATIO}
                MIN_WIDTH={MIN_WIDTH}
            />
            <DeleteMaterialModal
                isVisible={isDeleteModalVisible}
                onClose={hideDeleteModal}
                onSubmit={handleMaterialDeletion}
            />
        </div>
    );
}
