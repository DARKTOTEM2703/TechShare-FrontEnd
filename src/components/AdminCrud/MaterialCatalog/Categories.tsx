import React, { useState } from 'react';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';
import { useCrudOperations } from '@/hooks/useCrudOperations';

export default function Categories({ token, categories, refreshCategories }: { token: any | null, categories: any, refreshCategories: () => void }) {

  const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } = useCrudOperations(token, refreshCategories);
  const [formData, setFormData] = useState<{ name: string, description: string, image: File | null }>({ name: '', description: '', image: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const showCreateModal = () => setCreateModalVisible(true);
  const hideCreateModal = () => setCreateModalVisible(false);

  const showEditModal = (id: number) => {
    setClickedItemId(id);
    const selectedCategory = categories.find((category: any) => category.categoryId === id);
    if (selectedCategory) {
      setFormData({ name: selectedCategory.name, description: selectedCategory.description, image: null });
      setEditModalVisible(true);
    }
  };
  const hideEditModal = () => setEditModalVisible(false);

  const showDeleteModal = (id: number) => {
    setClickedItemId(id);
    setDeleteModalVisible(true);
  };
  const hideDeleteModal = () => setDeleteModalVisible(false);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    if (formData.description) formDataObj.append('description', formData.description);
    if (formData.image) formDataObj.append('image', formData.image);
    handleCreate("http://localhost:8080/categories/create", formDataObj);
    hideCreateModal();
  };

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    if (formData.description) formDataObj.append('description', formData.description);
    if (formData.image) formDataObj.append('image', formData.image);
    handleUpdate(`http://localhost:8080/categories/update/${clickedItemId}`, formDataObj);
    hideEditModal();
  };

  const handleDeleteCategory = () => {
    handleDelete(`http://localhost:8080/categories/delete/${clickedItemId}`);
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
              <BorderTextField name="name" placeholder="Category Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
              <BorderTextField name="description" placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} />
              <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })} />
            </ModalBase>
          </div>
        </div>
      )}

      {isEditModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ModalBase onClose={hideEditModal} header="Edit Category" onSubmit={handleEditCategory}>
              <BorderTextField name="name" placeholder="Category Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
              <BorderTextField name="description" placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} />
              <input type="file" onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })} />
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
