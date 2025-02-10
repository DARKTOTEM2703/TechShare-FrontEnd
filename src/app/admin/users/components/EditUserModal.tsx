import React from 'react';
import ModalBase from '@/components/Modal/ModalBase';
import AsyncSelect from 'react-select/async';

interface EditUserModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: {
        roleIds: string[];
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        roleIds: string[];
    }>>;
    roleOptions: { value: string; label: string }[];
    loadRoleOptions: (inputValue: string, callback: (options: any[]) => void) => void;
    selectedUser: {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export default function EditUserModal({
    isVisible,
    onClose,
    onSubmit,
    formData,
    setFormData,
    roleOptions,
    loadRoleOptions,
    selectedUser,
}: EditUserModalProps) {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <ModalBase
                    onClose={onClose}
                    header={`Editar roles - ${selectedUser.firstName} ${selectedUser.lastName}`}
                    onSubmit={onSubmit}
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 mb-2">
                            <p className="text-gray-600">{selectedUser.email}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2>Roles</h2>
                            <AsyncSelect
                                className='border rounded-md border-primary'
                                cacheOptions
                                defaultOptions={roleOptions}
                                loadOptions={loadRoleOptions}
                                isMulti
                                placeholder="Selecciona los roles"
                                value={roleOptions.filter((role) => formData.roleIds.includes(role.value))}
                                onChange={(selectedOptions) =>
                                    setFormData({
                                        roleIds: selectedOptions.map((option: any) => option.value),
                                    })
                                }
                            />
                        </div>
                    </div>
                </ModalBase>
            </div>
        </div>
    );
} 