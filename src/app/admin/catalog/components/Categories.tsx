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
import CreateCategoryModal from './modals/CreateCategoryModal';

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
                title="Categorías"
                dropdownOptions={[]}
                buttonLabel="Añadir categoría"
                buttonFunction={showCreateModal}
                onSearchChange={handleSearchChange}
            />

            <CrudBody
                data={categories}
                searchTerm={searchTerm}
                onDelete={(id) => showDeleteModal(id)}
                onEdit={(id) => showEditModal(id)}
            />

            <CreateCategoryModal
                isVisible={isCreateModalVisible}
                onClose={hideCreateModal}
                onSubmit={handleCreateCategory}
                formData={formData}
                setFormData={setFormData}
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

            {isEditModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase
                            onClose={hideEditModal}
                            header="Editar categoría"
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
                                    <div className="flex gap-2">
                                        <div className="flex items-center aspect-[3/2] h-[176px] mr-5">
                                            <DropzoneWithPreview
                                                onFileChange={(file) => onSelectFile(file)}
                                                initialPreview={formData.imagePreview ||
                                                    selectedCategory?.imagePath ||
                                                    ''}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 justify-center h-full">
                                            <h2>Nombre</h2>
                                            <BorderTextField
                                                name="name"
                                                placeholder="Nombre de la categoría"
                                                onChange={(e) =>
                                                    setFormData({ ...formData, name: e.target.value })
                                                }
                                                value={formData.name}
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
                        <ModalBase
                            onClose={hideDeleteModal}
                            header="Confirmar eliminación de categoría"
                            onSubmit={handleDeleteCategory}
                        >
                            <p>¿Estás seguro de que quieres eliminar esta categoría?</p>
                        </ModalBase>
                    </div>
                </div>
            )}
        </div>
    );
}
