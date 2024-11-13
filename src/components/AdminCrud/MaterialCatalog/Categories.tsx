"use client"
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyWithImages'
import { useFetchData } from '@/services/useFetchData'
import { useState, useEffect } from 'react'
import ModalBase from '@/components/Modal/ModalBase'
import BorderTextField from '@/components/Inputs/BorderTextField'
import { useAuth } from '@/app/hooks/useAuth'
import { getToken } from '@/services/storageService'

export default function Categories({ token, categories, refreshCategories }: { token: any, categories: any, refreshCategories: any }) {

  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [clickedCategoryId, setClickedCategoryId] = useState<number | null>(null)
  const [formData, setFormData] = useState<{ name: string; description?: string; image?: File | null }>({ name: '', description: '', image: null })

  const handleSearchChange = (value: string) => setSearchTerm(value)

  const showCreateModal = () => setCreateModalVisible(true)
  const hideCreateModal = () => setCreateModalVisible(false)

  const showEditModal = () => setEditModalVisible(true)
  const hideEditModal = () => setEditModalVisible(false)

  const showDeleteModal = () => setDeleteModalVisible(true)
  const hideDeleteModal = () => setDeleteModalVisible(false)

  const editButtonClicked = (id: number) => {
    const selectedCategory = categories.find((category: any) => category.categoryId === id)
    if (selectedCategory) {
      setClickedCategoryId(id)
      setFormData({ name: selectedCategory.name, description: selectedCategory.description, image: null })
      showEditModal()
    }
  }

  const deleteButtonClicked = (id: number) => {
    setClickedCategoryId(id)
    showDeleteModal()
  }

  const handleCategoryCreation = (e: any) => {
    e.preventDefault()
    const formDataObj = new FormData()
    formDataObj.append('name', formData.name)
    if (formData.description) formDataObj.append('description', formData.description)
    if (formData.image) formDataObj.append('image', formData.image)
    console.log(formDataObj)
    fetch("http://localhost:8080/categories/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataObj,
    })
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then((data) => {
        refreshCategories()
        hideCreateModal()
      })
      .catch((error) => console.error("Error:", error))
  }

  const handleCategoryUpdate = (e: any) => {
    e.preventDefault()
    const formDataObj = new FormData()
    formDataObj.append('name', formData.name)
    if (formData.description) formDataObj.append('description', formData.description)
    if (formData.image) formDataObj.append('image', formData.image)

    fetch(`http://localhost:8080/categories/update/${clickedCategoryId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataObj,
    })
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .then((data) => {
        refreshCategories()
        hideEditModal()
      })
      .catch((error) => console.error("Error:", error))
  }

  const handleCategoryDeletion = (e: any) => {
    e.preventDefault()
    fetch(`http://localhost:8080/categories/delete/${clickedCategoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response)
        if (response.status === 204) {
          refreshCategories()
          hideDeleteModal()
        }
      })
      .catch((error) => console.error("Error:", error))
  }

  return (
    <div>
      <CrudHeader
        title='Categories'
        buttonLabel='Add Category'
        buttonDisabled={false}
        buttonFunction={showCreateModal}
        onSearchChange={handleSearchChange}
      />
      <CrudBody
        data={categories}
        searchTerm={searchTerm}
        onDelete={deleteButtonClicked}
        onEdit={editButtonClicked}
      />
      {isCreateModalVisible && (
        <div className="modal-overlay">
          <ModalBase
            onClose={hideCreateModal}
            header='Create New Category'
            onSubmit={handleCategoryCreation}
          >
            <BorderTextField
              name='name'
              placeholder='Category Name'
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              value={formData.name}
            />
            <BorderTextField
              name='description'
              placeholder='Description'
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              value={formData.description}
            />
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })}
            />
          </ModalBase>
        </div>
      )}
      {isEditModalVisible && (
        <div className="modal-overlay">
          <ModalBase
            onClose={hideEditModal}
            header='Edit Category'
            onSubmit={handleCategoryUpdate}
          >
            <BorderTextField
              name='name'
              placeholder='Category Name'
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              value={formData.name}
            />
            <BorderTextField
              name='description'
              placeholder='Description'
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              value={formData.description}
            />
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })}
            />
          </ModalBase>
        </div>
      )}
      {isDeleteModalVisible && (
        <div className="modal-overlay">
          <ModalBase
            onClose={hideDeleteModal}
            header='Confirm Delete Category'
            onSubmit={handleCategoryDeletion}
          >
            <p>Are you sure you want to delete this category?</p>
          </ModalBase>
        </div>
      )}
    </div>
  )
}
