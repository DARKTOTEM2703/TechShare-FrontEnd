import React, { useState } from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';
import DropzoneWithPreview from '@/components/DropZone';
import { useImageCrop } from '@/hooks/useReactCrop';
import ReactCrop from 'react-image-crop';
import { Category } from '../interfaces/Category';

export default function Categories({
    token,
    categories,
    refreshCategories,
    ASPECT_RATIO,
    MIN_DIMENSION,
    MIN_WIDTH
}: {
    token: string;
    categories: Category[];
    refreshCategories: () => void;
    ASPECT_RATIO: number;
    MIN_DIMENSION: number;
    MIN_WIDTH: number;
}) {
    const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } =
        useCrudOperations(token, refreshCategories);

    const [formData, setFormData] = useState<{
        name: string;
        image: File | null;
        imagePreview: string | null;
    }>({
        name: '',
        image: null,
        imagePreview: null
    });

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

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const showCreateModal = () => setCreateModalVisible(true);
    const hideCreateModal = () => {
        setCreateModalVisible(false);
        setFormData({ name: '', image: null, imagePreview: null });
        setIsImageCropping(false);
        setImageUrl('');
        setCrop(undefined);
    };

    const showEditModal = (id: number) => {
        const selectedCategory = categories.find(
            (category: any) => category.categoryId === id
        );
        setSelectedCategory(selectedCategory);
        if (selectedCategory) {
            setClickedItemId(id);
            setFormData({
                name: selectedCategory.name,
                image: null,
                imagePreview: selectedCategory.imageUrl || null
            });
            setEditModalVisible(true);
        }
    };

    const hideEditModal = () => {
        setEditModalVisible(false);
        setFormData({ name: '', image: null, imagePreview: null });
        setIsImageCropping(false);
        setImageUrl('');
        setCrop(undefined);
    };

    const showDeleteModal = (id: number) => {
        setClickedItemId(id);
        setDeleteModalVisible(true);
    };
    const hideDeleteModal = () => setDeleteModalVisible(false);

    const handleCreateCategory = (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);

        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        handleCreate(endpoints.categories.create, formDataToSend);
        hideCreateModal();
    };

    const handleEditCategory = (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);

        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }
        if (clickedItemId !== null) {
            handleUpdate(endpoints.categories.update(clickedItemId), formDataToSend);
        }
        hideEditModal();
    };

    const handleDeleteCategory = () => {
        if (clickedItemId !== null) {
            handleDelete(endpoints.categories.delete(clickedItemId));
        }
        hideDeleteModal();
    };

    const handleSearchChange = (value: string) => setSearchTerm(value);

    return (
        <div>
            <CrudHeader
                title="Categories"
                dropdownOptions={[]}
                buttonLabel="Add Category"
                buttonFunction={showCreateModal}
                onSearchChange={handleSearchChange}
            />
            <CrudBody
                data={categories}
                searchTerm={searchTerm}
                onDelete={(id) => showDeleteModal(id)}
                onEdit={(id) => showEditModal(id)}
            />

            {isCreateModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase
                            onClose={hideCreateModal}
                            header="Create New Category"
                            onSubmit={handleCreateCategory}
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
                                    <BorderTextField
                                        name="name"
                                        placeholder="Category Name"
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        value={formData.name}
                                    />
                                    <DropzoneWithPreview
                                        onFileChange={(file) => onSelectFile(file)}
                                        initialPreview={formData.imagePreview || imageUrl}
                                    />
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
                            header="Edit Category"
                            onSubmit={handleEditCategory}
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
                                    <BorderTextField
                                        name="name"
                                        placeholder="Category Name"
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        value={formData.name}
                                    />
                                    <DropzoneWithPreview
                                        onFileChange={(file) => onSelectFile(file)}
                                        initialPreview={formData.imagePreview ||
                                            selectedCategory?.imagePath ||
                                            ''}
                                    />
                                </>
                            )}
                        </ModalBase>
                    </div>
                </div>
            )}

            {isDeleteModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase
                            onClose={hideDeleteModal}
                            header="Confirm Delete Category"
                            onSubmit={handleDeleteCategory}
                        >
                            <p>Estás seguro de que quieres borrar esta categoría?</p>
                        </ModalBase>
                    </div>
                </div>
            )}
        </div>
    );
}
