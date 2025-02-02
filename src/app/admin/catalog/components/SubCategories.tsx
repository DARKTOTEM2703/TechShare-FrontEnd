import React, { useState } from 'react';
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

export default function SubCategories({ token, categories, subCategories, refreshSubCategories,ASPECT_RATIO, MIN_DIMENSION, MIN_WIDTH }: { token: any, categories: any, subCategories: any, refreshSubCategories: any, ASPECT_RATIO: number, MIN_DIMENSION: number, MIN_WIDTH: number }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [formData, setFormData] = useState<{ name: string; image: File | null; imagePreview: string | null; idCategory: number }>({ name: '', image: null, imagePreview: null, idCategory: 0 });

    const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

    const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } = useCrudOperations(token, refreshSubCategories);


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

    const handleSearchChange = (value: string) => setSearchTerm(value);

    const showCreateModal = () => setCreateModalVisible(true);
    const hideCreateModal = () => {
        setCreateModalVisible(false);
        setFormData({ name: '', image: null, imagePreview: null, idCategory: 0 });
        setIsImageCropping(false);
        setImageUrl('');
        setCrop(undefined);
    };

    const showEditModal = () => setEditModalVisible(true);
    const hideEditModal = () => {
        setEditModalVisible(false);
        setFormData({ name: '', image: null, imagePreview: null, idCategory: 0 });
        setIsImageCropping(false);
        setImageUrl('');
        setCrop(undefined);
    };

    const showDeleteModal = () => setDeleteModalVisible(true);
    const hideDeleteModal = () => setDeleteModalVisible(false);

    const createButtonClicked = () => {
        setFormData({ name: '', image: null, imagePreview: null, idCategory: 0 });
        showCreateModal();
    }

    const editButtonClicked = (id: number) => {
        const selectedSubCategory = subCategories.find((subCategory: any) => subCategory.subCategoriesId === id);
        setSelectedSubCategory(selectedSubCategory);
        if (selectedSubCategory) {
            setClickedItemId(id);
            setFormData({ name: selectedSubCategory.name, image: null, imagePreview: selectedSubCategory.imagePath, idCategory: selectedSubCategory.categoryId });
            showEditModal();
        }
    };

    const deleteButtonClicked = (id: number) => {
        setClickedItemId(id);
        showDeleteModal();
    };

    const handleSubCategoryCreation = (e: any) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('idCategory', formData.idCategory.toString());
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        handleCreate(endpoints.subcategories.create, formDataToSend);
        hideCreateModal();
    };

    const handleSubCategoryUpdate = (e: any) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('idCategoria', formData.idCategory.toString());
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        if (clickedItemId !== null) {
            handleUpdate(endpoints.subcategories.update(clickedItemId), formDataToSend);
        }
        hideEditModal();
    };

    const handleSubCategoryDeletion = (e: any) => {
        e.preventDefault();
        if (clickedItemId !== null) {
            handleDelete(endpoints.subcategories.delete(clickedItemId));
        }
        hideDeleteModal();
    };

    return (
        <div>
            <CrudHeader title="Subcategorías" dropdownOptions={[]} buttonLabel="Añadir subcategoría" buttonFunction={createButtonClicked} onSearchChange={handleSearchChange} />
            <CrudBody data={subCategories} searchTerm={searchTerm} onDelete={deleteButtonClicked} onEdit={editButtonClicked} />
            {isCreateModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase 
                            onClose={hideCreateModal} 
                            header="Añadir subcategoría" 
                            onSubmit={handleSubCategoryCreation}
                            showButtons={!isImageCropping}
                        >
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
                                        Aplicar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-2">
                                        <div className="flex items-center aspect-[3/2] h-[176px] mr-5">
                                            <DropzoneWithPreview
                                                onFileChange={(file) => onSelectFile(file)}
                                                initialPreview={formData.imagePreview || imageUrl}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h2>Nombre</h2>
                                            <BorderTextField
                                                name="name"
                                                placeholder="Nombre de la subcategoría"
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                value={formData.name}
                                            />
                                            <h2>Categoría</h2>
                                            <DynamicDropdown
                                                data={categories}
                                                valueKey="categoryId"
                                                labelKey="name"
                                                selectedValue={formData.idCategory}
                                                onChange={(value: number) => setFormData({ ...formData, idCategory: value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </ModalBase>
                    </div>
                </div>
            )}
            {isEditModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase 
                            onClose={hideEditModal} 
                            header="Editar subcategoría" 
                            onSubmit={handleSubCategoryUpdate}
                            showButtons={!isImageCropping}
                        >
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
                                        Aplicar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-2">
                                        <div className="flex items-center aspect-[3/2] h-[176px] mr-5">
                                            <DropzoneWithPreview
                                                onFileChange={(file) => onSelectFile(file)}
                                                initialPreview={formData.imagePreview || selectedSubCategory?.imagePath || ''}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h2>Nombre</h2>
                                            <BorderTextField
                                                name="name"
                                                placeholder="Nombre de la subcategoría"
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                value={formData.name}
                                            />
                                            <h2>Categoría</h2>
                                            <DynamicDropdown
                                                data={categories}
                                                valueKey="categoryId"
                                                labelKey="name"
                                                selectedValue={formData.idCategory}
                                                onChange={(value: number) => setFormData({ ...formData, idCategory: value })}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </ModalBase>
                    </div>
                </div>
            )}
            {isDeleteModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideDeleteModal} header="Confirmar eliminación de subcategoría" onSubmit={handleSubCategoryDeletion}>
                            <p>¿Estás seguro de querer eliminar esta subcategoría?</p>
                        </ModalBase>
                    </div>
                </div>
            )}
        </div>
    );
}
