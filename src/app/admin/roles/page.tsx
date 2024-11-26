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
import endpoints from '@/app/infraestructure/config/configAPI'

export default function roles() {

  type Role = {
    roleId: number;
    name: string;
  };

  useAuth()
  const token = getToken() || ''

  const fetchRoles = () => {
    fetch(endpoints.roles.getAll, {
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

  // TODO: role name length VALIDATION
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { name: formData.roleName }
    handleCreate(endpoints.roles.create, payload)
    hideCreateModal()
  }

  const handleRoleUpdate = (e: any) => {
    e.preventDefault()
    const payload = { name: formData.roleName }
    if (clickedItemId !== null) {
      handleUpdate(endpoints.roles.update(clickedItemId), payload)
    }
    hideEditModal()
  }


  const handleRoleDeletion = () => {
    if (clickedItemId !== null) {
      handleDelete(endpoints.roles.delete(clickedItemId))
    }
    hideDeleteModal()
  }
  return (
    <div>
      <CrudHeader
        title='Roles'
        dropdownOptions={[]}
        buttonLabel='AÑADIR ROL'
        buttonDisabled={false}
        buttonFunction={showCreateModal}
        onSearchChange={handleSearchChange}
      />
      <CrudBody
        data={data}
        headers={['roleId', 'name']}
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
            <p>¿Estás seguro de que deseas borrar este rol?</p>
          </ModalBase>
        </div>)}
    </div>
  )
}
