import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';
import DynamicDropdown from '@/components/Dropdowns/DynamicDropdown';
import DropzoneWithPreview from '@/components/DropZone';
import { useImageCrop } from '@/hooks/useReactCrop';
import ReactCrop from 'react-image-crop';

export default function Materials({ token, subCategories, roles, materials, refreshMaterials }: { token: any, subCategories: any, roles: any, materials: any, refreshMaterials: any }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [formData, setFormData] = useState<{ name: string; description: string; price: number; image?: File | null; imagePreview?: string | null; subCategoryId: number; roleIds: number[] }>({ name: '', description: '', price: 0, image: null, imagePreview: null, subCategoryId: 0, roleIds: [] });
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

    const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } = useCrudOperations(token, refreshMaterials);

    const ASPECT_RATIO = 1;
    const MIN_DIMENSION = 100;
    const MIN_WIDTH = 100;

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
            <CrudHeader title="Materials" dropdownOptions={[]} buttonLabel="Add Material" buttonFunction={createButtonClicked} onSearchChange={handleSearchChange} />
            <CrudBody data={materials} searchTerm={searchTerm} onDelete={deleteButtonClicked} onEdit={editButtonClicked} />

            {isCreateModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideCreateModal} header="Create New Material" onSubmit={handleMaterialCreation}>
                            {isImageCropping ? (
                                <>
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => {
                                            setCrop(percentCrop);
                                        }}
                                        keepSelection
                                        aspect={ASPECT_RATIO}
                                        minWidth={MIN_WIDTH}
                                    >
                                        <img
                                            ref={imageRef}
                                            src={imageUrl}
                                            alt="Upload"
                                            style={{ maxHeight: '70vh' }}
                                            onLoad={onImageLoad}
                                        />
                                    </ReactCrop>

                                    <canvas
                                        ref={previewImageRef}
                                        className="mt-4"
                                        style={{
                                            display: 'none',
                                            border: '1px solid black',
                                            objectFit: 'contain',
                                            width: 150,
                                            height: 150
                                        }}
                                    />

                                    <button
                                        className="primary-button"
                                        type="button"
                                        onClick={() => {
                                            applyCrop((croppedFile: any, previewUrl: any) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    image: croppedFile,
                                                    imagePreview: previewUrl
                                                }));
                                            });
                                        }}
                                    >
                                        Apply
                                    </button>
                                </>
                            ) : (
                                <>
                                    <BorderTextField name="name" placeholder="Material Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                                    <BorderTextField name="description" placeholder="Material Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} />
                                    <BorderTextField name="price" placeholder="Material Price" onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} value={formData.price} />
                                    <DynamicDropdown data={subCategories} valueKey="subCategoriesId" labelKey="name" selectedValue={formData.subCategoryId} onChange={(value: number) => setFormData({ ...formData, subCategoryId: value })} />
                                    <AsyncSelect
                                        cacheOptions
                                        defaultOptions={roleOptions}
                                        loadOptions={loadRoleOptions}
                                        isMulti
                                        placeholder="Select Roles"
                                        value={roleOptions.filter((role: any) => formData.roleIds.includes(role.value))}
                                        onChange={(selectedOptions) =>
                                            setFormData({
                                                ...formData,
                                                roleIds: selectedOptions.map((option: any) => option.value),
                                            })
                                        }
                                    />
                                    <DropzoneWithPreview onFileChange={(file) => onSelectFile(file)} initialPreview={formData.imagePreview || imageUrl} />
                                </>
                            )}
                        </ModalBase>
                    </div>
                </div>
            )}

            {isEditModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideEditModal} header="Edit Material" onSubmit={handleMaterialUpdate}>
                            {isImageCropping ? (
                                <>
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => {
                                            setCrop(percentCrop);
                                        }}
                                        keepSelection
                                        aspect={ASPECT_RATIO}
                                        minWidth={MIN_WIDTH}
                                    >
                                        <img
                                            ref={imageRef}
                                            src={imageUrl}
                                            alt="Upload"
                                            style={{ maxHeight: '70vh' }}
                                            onLoad={onImageLoad}
                                        />
                                    </ReactCrop>

                                    <canvas
                                        ref={previewImageRef}
                                        className="mt-4"
                                        style={{
                                            display: 'none',
                                            border: '1px solid black',
                                            objectFit: 'contain',
                                            width: 150,
                                            height: 150
                                        }}
                                    />

                                    <button
                                        className="primary-button"
                                        type="button"
                                        onClick={() => {
                                            applyCrop((croppedFile: any, previewUrl: any) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    image: croppedFile,
                                                    imagePreview: previewUrl
                                                }));
                                            });
                                        }}
                                    >
                                        Apply
                                    </button>
                                </>
                            ) : (
                                <>
                                    <BorderTextField name="name" placeholder="Material Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                                    <BorderTextField name="description" placeholder="Material Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} />
                                    <BorderTextField name="price" placeholder="Material Price" onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} value={formData.price} />
                                    <DynamicDropdown data={subCategories} valueKey="subCategoriesId" labelKey="name" selectedValue={formData.subCategoryId} onChange={(value: number) => setFormData({ ...formData, subCategoryId: value })} />
                                    <AsyncSelect
                                        cacheOptions
                                        defaultOptions={roleOptions}
                                        loadOptions={loadRoleOptions}
                                        isMulti
                                        placeholder="Select Roles"
                                        value={roleOptions.filter((role: any) => formData.roleIds.includes(role.value))}
                                        onChange={(selectedOptions) =>
                                            setFormData({
                                                ...formData,
                                                roleIds: selectedOptions.map((option: any) => option.value),
                                            })
                                        }
                                    />
                                    <DropzoneWithPreview onFileChange={(file) => onSelectFile(file)} initialPreview={formData.imagePreview || selectedMaterial?.imagePath || ''} />
                                </>
                            )}
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
