"use client"
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyViewOnly'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getToken } from '@/services/storageService'
import endpoints from '@/app/infraestructure/config/configAPI'
import fetchData from '@/services/fetchData'
import { Movement } from '@/app/admin/movements/interfaces/Movement'
import ModalBase from '@/components/Modal/ModalBase'
import '@/styles/modal.css'
import MovementInfo from '@/components/AdminCrud/InfoModals/MovementInfo'

export default function movements() {
  const [data, setData] = useState<Movement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true);  // Nuevo estado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);

  useAuth()
  const token = getToken() || ''

  const fetchMovements = (token: string) => {
    setIsLoading(true);  // Activar loading
    fetchData(endpoints.movements.getAll, token)
      .then((data) => {
        setData(data);
        setIsLoading(false);  // Desactivar loading
      })
      .catch(() => {
        setIsLoading(false);  // Desactivar loading en caso de error
      });
  }

  // Función que actualiza el término de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    fetchMovements(token);
  }, [token]);  // Agregar token como dependencia

  const headerLabels = {
    'moveType': 'Tipo',
    'quantity': 'Cantidad',
    'date': 'Fecha',
    'materialsName': 'Material'
  };

  const handleMoreInfo = (id: number) => {
    const movement = data.find(m => m.movementsId === id);
    if (movement) {
      setSelectedMovement(movement);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovement(null);
  };

  return (
    <div>
      <CrudHeader
        title='Movimientos'
        dropdownOptions={['dummy']}
        buttonLabel=''
        buttonFunction={() => alert('')}
        buttonDisabled={true}
        onSearchChange={handleSearchChange}
      />
      <CrudBody
        data={data}
        headerLabels={headerLabels}
        headers={['moveType', 'quantity', 'date', 'materialsName']}
        onSelected={() => { }}
        onMoreInfo={handleMoreInfo}
        searchTerm={searchTerm}
        isLoading={isLoading}
      />
      {isModalOpen && selectedMovement && (
        <div className='modal-overlay'>
          <div className="fixed inset-0 flex items-center justify-center z-60">
            <MovementInfo
              movement={selectedMovement}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  )
}
