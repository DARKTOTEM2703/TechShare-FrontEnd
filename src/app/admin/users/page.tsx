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
import { useCrudOperations } from '@/hooks/useCrudOperations';

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

  interface Role {
    roleId: number;
    name: string;
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState<{
    roles: string[];
  }>({
    roles: []
  });

  useAuth();
  const token = getToken() || '';

  const fetchUsers = () => {
    setIsLoading(true);
    fetchData(endpoints.users.getAll, token)
      .then((data: User[]) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const { handleUpdate } = useCrudOperations(token, fetchUsers);

  const loadRoleOptions = (inputValue: string, callback: (options: any[]) => void) => {
    fetchData(endpoints.roles.getAll, token)
      .then((data: Role[]) => {
        const options = data.map(role => ({
          value: role.name,
          label: role.name
        }));
        callback(options);
      });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleUserUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      const payload = {
        roles: formData.roles
      };

      console.log('Payload being sent:', JSON.stringify(payload, null, 2));

      handleUpdate(endpoints.users.update(selectedUser.id), payload);
      setSelectedUser(null);
    }
  };

  const handleMoreInfo = (id: number) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      setSelectedUser(user);
      setFormData({ roles: user.roles });
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(() => {
      fetchUsers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const headerLabels = {
    'firstName': 'Nombre',
    'lastName': 'Apellido',
    'email': 'Email'
  }

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
        headerLabels={headerLabels}
        headers={['firstName', 'lastName', 'email']}
        searchTerm={searchTerm}
        onSelected={(id: number) => alert(`Selected ${id}`)}
        onMoreInfo={handleMoreInfo}
        isLoading={isLoading}
      />
      {selectedUser && (
        <div className='modal-overlay'>
          <UserInformation
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={handleUserUpdate}
            loadRoleOptions={loadRoleOptions}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      )}
    </div>
  );
}
