"use client"
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyViewOnly'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getToken } from '@/services/storageService'
import { useEffect } from 'react';
import endpoints from '@/app/infraestructure/config/configAPI'
import fetchData from '@/services/fetchData'
import { Movement } from '@/app/admin/movements/interfaces/Movement'

export default function movements() {

  const [data, setData] = useState<Movement[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useAuth()
  const token = getToken() || ''
  const fetchMovements = (token: string) => {
    fetchData(endpoints.movements.getAll, token)
      .then((data) => setData(data))
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
  }, []);

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
        searchTerm={searchTerm} />
    </div>
  )
}
