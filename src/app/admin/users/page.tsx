"use client";
import CrudHeader from '@/components/AdminCrud/CrudHeader';
import CrudBody from '@/components/AdminCrud/CrudBodyViewOnly';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/services/storageService';
import fetchData from '@/services/fetchData';
import endpoints from '@/app/infraestructure/config/configAPI';
import UserInformation from '@/components/AdminCrud/InfoModals/UserInformation';
import { useState, useEffect } from 'react';
import "@/styles/modal.css";

export default function Users() {
  interface User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: string[];
  }

  useAuth();
  const token = getToken();

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = () => {
    fetchData(endpoints.users.getAll, token)
      .then((data: User[]) => setUsers(data));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleMoreInfo = (id: number) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      setSelectedUser(user);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const saveChanges = () => {
    console.log("Save changes for:", selectedUser);
    closeModal();
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => {
      fetchUsers();
    }
      , 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <CrudHeader
        title="Usuarios"
        dropdownOptions={[]}
        buttonLabel=""
        buttonFunction={() => alert('Adding stuff')}
        onSearchChange={handleSearchChange}
        buttonDisabled={true}
      />
      <CrudBody
        data={users}
        headers={['id', 'firstName', 'lastName', 'email']}
        searchTerm={searchTerm}
        onSelected={(id: number) => alert(`Selected ${id}`)}
        onMoreInfo={handleMoreInfo}
      />
      {selectedUser && (
        <div className='modal-overlay'>
          <UserInformation
            user={selectedUser}
            onClose={closeModal}
            onSave={saveChanges}
          />
        </div>
      )}
    </div>
  );
}
