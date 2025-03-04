import React, { useEffect, useState } from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';
import { useImageCrop } from '@/hooks/useReactCrop';
import CreateSubCategoryModal from './modals/CreateSubCategory';
import EditSubCategoryModal from './modals/EditSubCategory';
import DeleteSubCategoryModal from './modals/DeleteSubCategory';

export default function SubCategories({
    token,
    categories,
    subCategories,
    refreshSubCategories,
    ASPECT_RATIO,
    MIN_DIMENSION,
    MIN_WIDTH,
    isLoading
}: {
    token: string;
    categories: any[];
    subCategories: any[];
    refreshSubCategories: () => void;
    ASPECT_RATIO: number;
    MIN_DIMENSION: number;
    MIN_WIDTH: number;
    isLoading: boolean;
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [formData, setFormData] = useState<{
        name: string;
        image: File | null;
        imagePreview: string | null;
        idCategory: number
    }>({
        name: '',
        image: null,
        imagePreview: null,
        idCategory: 0
    });

    const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

    const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } =
        useCrudOperations(token, refreshSubCategories);

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

    const filteredSubCategories = subCategories.filter((subCategory: any) => subCategory.name !== "Sin subcategoría");

    return (
        <div>
            <CrudHeader
                title="Subcategorías"
                dropdownOptions={[]}
                buttonLabel="Añadir subcategoría"
                buttonFunction={createButtonClicked}
                onSearchChange={handleSearchChange}
            />

            <CrudBody
                data={filteredSubCategories}
                searchTerm={searchTerm}
                onDelete={deleteButtonClicked}
                onEdit={editButtonClicked}
                isLoading={isLoading}
            />

            <CreateSubCategoryModal
                isVisible={isCreateModalVisible}
                onClose={hideCreateModal}
                onSubmit={handleSubCategoryCreation}
                formData={formData}
                setFormData={setFormData}
                categories={categories}
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

            <EditSubCategoryModal
                isVisible={isEditModalVisible}
                onClose={hideEditModal}
                onSubmit={handleSubCategoryUpdate}
                formData={formData}
                setFormData={setFormData}
                categories={categories}
                selectedSubCategory={selectedSubCategory}
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

            <DeleteSubCategoryModal
                isVisible={isDeleteModalVisible}
                onClose={hideDeleteModal}
                onSubmit={handleSubCategoryDeletion}
            />
        </div>
    );
}
