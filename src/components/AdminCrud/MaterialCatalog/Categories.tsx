import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages';
import ModalBase from '@/components/Modal/ModalBase';
import BorderTextField from '@/components/Inputs/BorderTextField';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';

export default function Categories({ token, categories, refreshCategories }: { token: any | null, categories: any, refreshCategories: () => void }) {

  const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } = useCrudOperations(token, refreshCategories);
  const [formData, setFormData] = useState<{ name: string; image: File | null }>({ name: '', image: null });
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Para mostrar la previsualización de la imagen
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const showCreateModal = () => setCreateModalVisible(true);
  const hideCreateModal = () => {
    setCreateModalVisible(false);
    resetImagePreview();
  };

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
    resetImagePreview();
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

  // Configurar react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Generar URL para previsualización
    }
  }, [formData]);

  const resetImagePreview = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: null });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false, // Solo permitir una imagen
  });

  return (
    <div>
      <CrudHeader title="Categories" buttonLabel="Add Category" buttonFunction={showCreateModal} onSearchChange={handleSearchChange} />
      <CrudBody data={categories} searchTerm={searchTerm} onDelete={(id) => showDeleteModal(id)} onEdit={(id) => showEditModal(id)} />

      {isCreateModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ModalBase onClose={hideCreateModal} header="Create New Category" onSubmit={handleCreateCategory}>
              <BorderTextField name="name" placeholder="Category Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
              <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                <input {...getInputProps()} />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                ) : (
                  <p>Drag & drop an image here, or click to select one</p>
                )}
              </div>
            </ModalBase>
          </div>
        </div>
      )}

      {isEditModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ModalBase onClose={hideEditModal} header="Edit Category" onSubmit={handleEditCategory}>
              <BorderTextField name="name" placeholder="Category Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
              <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                <input {...getInputProps()} />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                ) : (
                  <p>Drag & drop an image here, or click to select one</p>
                )}
              </div>
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
