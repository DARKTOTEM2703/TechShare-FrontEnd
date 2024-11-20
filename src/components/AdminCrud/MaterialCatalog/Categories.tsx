import React, { useState } from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';
import DropzoneWithPreview from '@/components/DropZone'; // Importa el nuevo componente Dropzone

export default function Categories({ token, categories, refreshCategories }: { token: any, categories: any, refreshCategories: any }) {
    const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } = useCrudOperations(token, refreshCategories);

    const [formData, setFormData] = useState<{ name: string; image: File | null }>({ name: '', image: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    // Mostrar/Cerrar modal de creación
    const showCreateModal = () => setCreateModalVisible(true);
    const hideCreateModal = () => {
        setCreateModalVisible(false);
        setFormData({ name: '', image: null }); // Limpiar datos del formulario
    };

    // Mostrar/Cerrar modal de edición
    const showEditModal = (id: number) => {
        const selectedCategory = categories.find((category: any) => category.categoryId === id);
        if (selectedCategory) {
            setClickedItemId(id);
            setFormData({ name: selectedCategory.name, image: null });
            setEditModalVisible(true);
        }
    };
    const hideEditModal = () => {
        setEditModalVisible(false);
        setFormData({ name: '', image: null }); // Limpiar datos del formulario
    };

    // Mostrar/Cerrar modal de eliminación
    const showDeleteModal = (id: number) => {
        setClickedItemId(id);
        setDeleteModalVisible(true);
    };
    const hideDeleteModal = () => setDeleteModalVisible(false);

    // Crear nueva categoría
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

    // Actualizar categoría existente
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

    // Eliminar categoría
    const handleDeleteCategory = () => {
        if (clickedItemId !== null) {
            handleDelete(endpoints.categories.delete(clickedItemId));
        }
        hideDeleteModal();
    };

    const handleSearchChange = (value: string) => setSearchTerm(value);

    return (
        <div>
            <CrudHeader title="Categories" buttonLabel="Add Category" buttonFunction={showCreateModal} onSearchChange={handleSearchChange} />
            <CrudBody data={categories} searchTerm={searchTerm} onDelete={(id) => showDeleteModal(id)} onEdit={(id) => showEditModal(id)} />

            {isCreateModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideCreateModal} header="Create New Category" onSubmit={handleCreateCategory}>
                            <BorderTextField
                                name="name"
                                placeholder="Category Name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                value={formData.name}
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
                        <ModalBase onClose={hideEditModal} header="Edit Category" onSubmit={handleEditCategory}>
                            <BorderTextField
                                name="name"
                                placeholder="Category Name"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                value={formData.name}
                            />
                            <DropzoneWithPreview
                                onFileChange={(file) => setFormData({ ...formData, image: file })}
                                initialPreview={null} // Si tienes una URL previa, cámbiala aquí
                            />
                        </ModalBase>
                    </div>
                </div>
            )}

            {isDeleteModalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <ModalBase onClose={hideDeleteModal} header="Confirm Delete Category" onSubmit={handleDeleteCategory}>
                            <p>Are you sure you want to delete this category?</p>
                        </ModalBase>
                    </div>
                </div>
            )}
        </div>
    );
}
