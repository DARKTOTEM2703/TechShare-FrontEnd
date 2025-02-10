"use client"
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyViewOnly'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getToken } from '@/services/storageService'
import endpoints from '@/app/infraestructure/config/configAPI'
import fetchData from '@/services/fetchData'
import { Movement } from '@/app/admin/movements/interfaces/Movement'

export default function movements() {
  const [data, setData] = useState<Movement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true);  // Nuevo estado

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

    const interval = setInterval(() => {
      fetchMovements(token);
    }, 5000);
    return () => clearInterval(interval);
  }, [token]);  // Agregar token como dependencia

  const headerLabels = {
    'moveType': 'Tipo',
    'quantity': 'Cantidad',
    'date': 'Fecha',
    'materialsName': 'Material'
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
        onMoreInfo={() => alert('')}
        searchTerm={searchTerm}
        isLoading={isLoading}  // Nueva prop
      />
    </div>
  )
}
