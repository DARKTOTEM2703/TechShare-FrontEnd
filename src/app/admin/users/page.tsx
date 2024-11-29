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

  interface User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
  }

  useAuth();
  const token = getToken();

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    fetchData(endpoints.users.getAll, token)
      .then((data: User[]) => setUsers(data));
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
        dropdownOptions={[]}
        buttonLabel=''
        buttonFunction={() => alert('Adding stuff')}
        onSearchChange={handleSearchChange}
        buttonDisabled={true}
      />
      <CrudBody
        data={users}
        headers={['id', 'firstName', 'lastName', 'email']}
        searchTerm={searchTerm}
        onSelected={(id: number) => alert(`Selected ${id}`)}
        onMoreInfo={(id: number) => alert(`More info ${id}`)}
      />
    </div>
  )
}