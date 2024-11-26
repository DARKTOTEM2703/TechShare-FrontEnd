"use client"
import CrudHeader from '@/components/AdminCrud/CrudHeader'
import CrudBody from '@/components/AdminCrud/CrudBodyViewOnly'
import { useFetchData } from '@/services/useFetchData'
import { useState } from 'react'
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

  return (
    <div>
      <CrudHeader
        title='Usuarios'
        buttonLabel=''
        buttonFunction={() => alert('Adding stuff')}
        onSearchChange={handleSearchChange} // Asegúrate de pasar esta función
        buttonDisabled={true}
      />
      <CrudBody
        data={data}
        headers={['ID', 'Nombre', 'Email', 'Teléfono']}
        searchTerm={searchTerm}
        onSelected={(id: number) => alert(`Selected ${id}`)}
        onMoreInfo={(id: number) => alert(`More info ${id}`)}
      />
    </div>
  )
}
