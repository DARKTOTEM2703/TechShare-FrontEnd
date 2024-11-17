"use client"
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBody'
import { useFetchData } from '@/services/useFetchData'
import { useState, useEffect } from 'react'
import ModalBase from '@/components/Modal/ModalBase' // Importamos el ModalBase
import BorderTextField from '@/components/Inputs/BorderTextField' // Importamos el BorderTextField
import { useAuth } from '@/hooks/useAuth'
import { getToken } from '@/services/storageService'
import { useCrudOperations } from '@/hooks/useCrudOperations'

export default function roles() {

  type Role = {
    roleId: number;
    name: string;
  };

  useAuth()
  const token = getToken() || ''

  const fetchRoles = () => {
    fetch("http://localhost:8080/admin/role/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data))
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const { setClickedItemId, handleCreate, handleUpdate, handleDelete, clickedItemId } = useCrudOperations(token, fetchRoles);
  const [data, setData] = useState<Role[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<{ roleName: string }>({ roleName: '' })
  const [isCreateModalVisible, setCreateModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)

  const handleSearchChange = (value: string) => setSearchTerm(value)

  const showCreateModal = () => setCreateModalVisible(true)
  const hideCreateModal = () => setCreateModalVisible(false)

  const showEditModal = (id: number) => {
    const selectedRole = data.find((role) => role.roleId === id)
    if (selectedRole) {
      setClickedItemId(id)
      setFormData({ roleName: selectedRole.name })
      setEditModalVisible(true)
    }
  }

  const hideEditModal = () => setEditModalVisible(false)

  const showDeleteModal = (id: number) => {
    setClickedItemId(id)
    setDeleteModalVisible(true)
  }

  const hideDeleteModal = () => setDeleteModalVisible(false)

  // TODO: role name lenght VALIDATION
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault()
    const formDataObj = new FormData()
    formDataObj.append('name', formData.roleName)
    handleCreate("http://localhost:8080/admin/role/create", formDataObj)
    hideCreateModal()
  }

  const handleRoleUpdate = (e: any) => {
    e.preventDefault()
    const formDataObj = new FormData()
    formDataObj.append('name', formData.roleName)
    handleUpdate(`http://localhost:8080/admin/role/update/${clickedItemId}`, formDataObj)
    hideEditModal()
  }

  const handleRoleDeletion = () => {
    handleDelete(`http://localhost:8080/admin/role/delete/${clickedItemId}`)
    hideDeleteModal()
  }
  return (
    <div>
      <CrudHeader
        title='Roles'
        buttonLabel='AÑADIR ROL'
        buttonDisabled={false}
        buttonFunction={showCreateModal}
        onSearchChange={handleSearchChange}
      />
      <CrudBody
        data={data}
        searchTerm={searchTerm}
        onDelete={(id) => showDeleteModal(id)}
        onEdit={(id) => showEditModal(id)}
      />
      {isCreateModalVisible && (
        <div className="modal-overlay">
          <ModalBase
            onClose={hideCreateModal}
            header='Crear nuevo Rol'
            onSubmit={handleCreateRole}
          >
            <BorderTextField
              name='roleName'
              placeholder='Nombre del rol'
              onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
              value={formData.roleName}
            />
          </ModalBase>
        </div>
      )}
      {isEditModalVisible && (
        <div className="modal-overlay">
          <ModalBase
            onClose={hideEditModal}
            header='Editar Rol'
            onSubmit={handleRoleUpdate}
          >
            <BorderTextField
              name='roleName'
              placeholder='Nombre del rol'
              onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
              value={formData.roleName} // Carga el nombre en el campo de texto
            />
          </ModalBase>
        </div>
      )}
      {isDeleteModalVisible && (
        <div className="modal-overlay">
          <ModalBase
            onClose={hideDeleteModal}
            header='Confirmar borrado de rol'
            onSubmit={handleRoleDeletion}>
            <p>¿Estás seguro de que deseas borrar este rol</p>
          </ModalBase>
        </div>)}
    </div>
  )
}
