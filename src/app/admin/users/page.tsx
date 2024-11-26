"use client"
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyViewOnly'
import { useFetchData } from '@/services/useFetchData'
import { useState, useEffect } from 'react'
import fetchData from '@/services/fetchData'
import { useAuth } from '@/hooks/useAuth'
import { getToken } from '@/services/storageService'
import endpoints from '@/app/infraestructure/config/configAPI'

export default function users() {

  useAuth();
  const token = getToken();

  // Estado para el término de búsqueda
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = () => {
    fetchData(endpoints.users.getAll, token)
      .then((data) => setData(data))
  }

  // Función que actualiza el término de búsqueda
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    fetchUsers();
  }
    , []);

  return (
    <div>
      <CrudHeader
        title='Usuarios'
        options={[]}
        buttonLabel=''
        buttonFunction={() => alert('Adding stuff')}
        onSearchChange={handleSearchChange}
        buttonDisabled={true}
      />
      <CrudBody
        data={data}
        headers={['id', 'firstName', 'lastName', 'email']}
        searchTerm={searchTerm}
        onSelected={(id: number) => alert(`Selected ${id}`)}
        onMoreInfo={(id: number) => alert(`More info ${id}`)}
      />
    </div>
  )
}
