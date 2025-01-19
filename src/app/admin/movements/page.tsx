"use client"
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyViewOnly'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getToken } from '@/services/storageService'
import { useEffect } from 'react';
import endpoints from '@/app/infraestructure/config/configAPI'
import fetchData from '@/services/fetchData'

export default function movements() {
  type Movement = {
    movementsId: number,
    moveType: string,
    quantity: number,
    date: string,
    comment: string,
    usuarioId: number,
    usuarioName: string,
    materialsId: number,
    materialsName: string
  }

  const [data, setData] = useState<Movement[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useAuth()
  const token = getToken()
  const fetchMovements = (token: string) => {
    fetchData(endpoints.movements.getAll, token)
      .then((data) => setData(data.reverse()))
  }

  // Función que actualiza el término de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
      if (token) {
        fetchMovements(token);
      }
  }, [token]);

  return (
    <div>
      <CrudHeader
        title='Movimientos'
        dropdownOptions={['dummy']}
        buttonLabel=' '
        buttonFunction={() => alert('')}
        buttonDisabled={true}
        onSearchChange={handleSearchChange}
      />
      <CrudBody
        data={data}
        headers={['movementsId', 'moveType', 'quantity', 'date', 'materialsName']}
        onSelected={() => { }}
        onMoreInfo={() => alert('')}
        searchTerm={searchTerm} />
    </div>
  )
}
