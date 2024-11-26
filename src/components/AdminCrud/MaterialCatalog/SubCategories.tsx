import React, { useState } from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';
import DynamicDropdown from '@/components/Dropdowns/DynamicDropdown';
import DropzoneWithPreview from '@/components/DropZone';

export default function SubCategories({ token, categories, subCategories, refreshSubCategories }: { token: any, categories: any, subCategories: any, refreshSubCategories: any }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [formData, setFormData] = useState<{ name: string; image?: File | null; idCategory: number }>({ name: '', image: null, idCategory: 0 });

    const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

    const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } = useCrudOperations(token, refreshSubCategories);

    const handleSearchChange = (value: string) => setSearchTerm(value);

    const showCreateModal = () => setCreateModalVisible(true);
    const hideCreateModal = () => setCreateModalVisible(false);

    const showEditModal = () => setEditModalVisible(true);
    const hideEditModal = () => setEditModalVisible(false);

    const showDeleteModal = () => setDeleteModalVisible(true);
    const hideDeleteModal = () => setDeleteModalVisible(false);

    const createButtonClicked = () => {
        setFormData({ name: '', image: null, idCategory: 0 });
        showCreateModal();
    }

    const editButtonClicked = (id: number) => {
        const selectedSubCategory = subCategories.find((subCategory: any) => subCategory.subCategoriesId === id);
        setSelectedSubCategory(selectedSubCategory);
        if (selectedSubCategory) {
            setClickedItemId(id);
            setFormData({ name: selectedSubCategory.name, image: selectedSubCategory.imagePath, idCategory: selectedSubCategory.categoryId });
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
            <CrudHeader title="SubCategories" options={[]} buttonLabel="Add SubCategory" buttonFunction={createButtonClicked} onSearchChange={handleSearchChange} />
            <CrudBody data={subCategories} searchTerm={searchTerm} onDelete={deleteButtonClicked} onEdit={editButtonClicked} />

            {isCreateModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideCreateModal} header="Create New SubCategory" onSubmit={handleSubCategoryCreation}>
                            <BorderTextField name="name"
                                placeholder="SubCategory Name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                            <DynamicDropdown
                                data={categories}
                                valueKey="categoryId"
                                labelKey="name"
                                selectedValue={formData.idCategory}
                                onChange={(value: number) => setFormData({ ...formData, idCategory: value })}
                            />
                            <DropzoneWithPreview
                                onFileChange={(file) => setFormData({ ...formData, image: file })}
                            />
                        </ModalBase>
                    </div>
                </div>
            )}

            {isEditModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideEditModal} header="Edit SubCategory" onSubmit={handleSubCategoryUpdate}>
                            <BorderTextField name="name"
                                placeholder="SubCategory Name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                value={formData.name} />
                            <DynamicDropdown
                                data={categories}
                                valueKey="categoryId"
                                labelKey="name"
                                selectedValue={formData.idCategory}
                                onChange={(value: number) => setFormData({ ...formData, idCategory: value })}
                            />
                            <DropzoneWithPreview
                                onFileChange={(file) => setFormData({ ...formData, image: file })}
                                initialPreview={selectedSubCategory.imagePath}
                            />
                        </ModalBase>
                    </div>
                </div>
            )}
            {isDeleteModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideDeleteModal} header="Confirm Delete SubCategory" onSubmit={handleSubCategoryDeletion}>
                            <p>Are you sure you want to delete this subcategory?</p>
                        </ModalBase>
                    </div>
                </div>
            )}
        </div>
    );
}
