import React, { useState } from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';

export default function SubCategories({ token, categories, subCategories, refreshSubCategories }: { token: any, categories: any, subCategories: any, refreshSubCategories: any }) {

    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [clickedSubCategoryId, setClickedSubCategoryId] = useState<number | null>(null);
    const [formData, setFormData] = useState<{ name: string; image?: File | null; idCategoria: number }>({ name: '', image: null, idCategoria: 0 });

    const handleSearchChange = (value: string) => setSearchTerm(value);

    const showCreateModal = () => setCreateModalVisible(true);
    const hideCreateModal = () => setCreateModalVisible(false);

    const showEditModal = () => setEditModalVisible(true);
    const hideEditModal = () => setEditModalVisible(false);

    const showDeleteModal = () => setDeleteModalVisible(true);
    const hideDeleteModal = () => setDeleteModalVisible(false);

    const editButtonClicked = (id: number) => {
        const selectedSubCategory = subCategories.find((subCategory: any) => subCategory.subCategoriesId === id);
        if (selectedSubCategory) {
            setClickedSubCategoryId(id);
            setFormData({ name: selectedSubCategory.name, image: null, idCategoria: selectedSubCategory.idCategory });
            showEditModal();
        }
    };

    const deleteButtonClicked = (id: number) => {
        setClickedSubCategoryId(id);
        showDeleteModal();
    };

    const handleSubCategoryCreation = (e: any) => {
        e.preventDefault();
        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('idCategory', formData.idCategoria.toString());
        if (formData.image) formDataObj.append('image', formData.image);
        fetch("http://localhost:8080/subcategories/create", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formDataObj,
        })
            .then((response) => response.json())
            .then(() => {
                refreshSubCategories();
                hideCreateModal();
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleSubCategoryUpdate = (e: any) => {
        e.preventDefault();
        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('idCategory', formData.idCategoria.toString());
        if (formData.image) formDataObj.append('image', formData.image);
        fetch(`http://localhost:8080/subcategories/update/${clickedSubCategoryId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formDataObj,
        })
            .then((response) => response.json())
            .then(() => {
                refreshSubCategories();
                hideEditModal();
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleSubCategoryDeletion = (e: any) => {
        e.preventDefault();
        fetch(`http://localhost:8080/subcategories/delete/${clickedSubCategoryId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 204) {
                    refreshSubCategories();
                    hideDeleteModal();
                }
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <div>
            <CrudHeader title="SubCategories" buttonLabel="Add SubCategory" buttonFunction={showCreateModal} onSearchChange={handleSearchChange} />
            <CrudBody data={subCategories} searchTerm={searchTerm} onDelete={deleteButtonClicked} onEdit={editButtonClicked} />

            {isCreateModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideCreateModal} header="Create New SubCategory" onSubmit={handleSubCategoryCreation}>
                            <BorderTextField name="name" placeholder="SubCategory Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                            <BorderTextField name="categoryId" placeholder="Category ID" onChange={(e) => setFormData({ ...formData, idCategoria: parseInt(e.target.value) })} value={formData.idCategoria.toString()} />
                            <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })} />
                        </ModalBase>
                    </div>
                </div>
            )}

            {isEditModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideEditModal} header="Edit SubCategory" onSubmit={handleSubCategoryUpdate}>
                            <BorderTextField name="name" placeholder="SubCategory Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                            <BorderTextField name="categoryId" placeholder="Category ID" onChange={(e) => setFormData({ ...formData, idCategoria: parseInt(e.target.value) })} value={formData.idCategoria.toString()} />
                            <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })} />
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
