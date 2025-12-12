import ModalBase from "@/components/Modal/ModalBase";
import React from "react";
import AsyncSelect from "react-select/async";
import { cleanRoleName } from "@/utils/roleFormatter";

interface UserInformationProps {
    user: {
        id: number;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        profileImageUrl?: string;
        isEnabled: boolean;
        birthDate?: string;
        gender?: string;
        createdAt?: string;
        updatedAt?: string;
        roles: string[];
    };
    onClose: () => void;
    onSave: (e: React.FormEvent) => void;
    loadRoleOptions: (inputValue: string, callback: (options: any[]) => void) => void;
    formData: {
        roles: string[];
    };
    setFormData: (formData: any) => void;
}

const UserInformation: React.FC<UserInformationProps> = ({
    user,
    onClose,
    onSave,
    loadRoleOptions,
    formData,
    setFormData
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <ModalBase
                    onClose={onClose}
                    header="Información del usuario"
                    onSubmit={onSave}
                    showButtons={true}
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label>Nombre de usuario: {user.userName}</label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>Nombre: {user.firstName}</label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>Apellido: {user.lastName}</label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>Correo electrónico: {user.email}</label>
                        </div>
                        {user.birthDate && (
                            <div className="flex flex-col gap-2">
                                <label>Fecha de nacimiento: {new Date(user.birthDate).toLocaleDateString()}</label>
                            </div>
                        )}
                        {user.gender && (
                            <div className="flex flex-col gap-2">
                                <label>Género: {user.gender}</label>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label>Estado: {user.isEnabled ? 'Habilitado' : 'Deshabilitado'}</label>
                        </div>
                        {user.createdAt && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-500">Creado: {new Date(user.createdAt).toLocaleString()}</label>
                            </div>
                        )}
                        {user.updatedAt && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-500">Actualizado: {new Date(user.updatedAt).toLocaleString()}</label>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="roles">Roles</label>
                            <AsyncSelect
                                className='border rounded-md border-primary mb-4'
                                cacheOptions
                                defaultOptions
                                loadOptions={loadRoleOptions}
                                isMulti
                                placeholder="Selecciona los roles"
                                value={formData.roles.map(role => ({ value: role, label: cleanRoleName(role) }))}
                                onChange={(selectedOptions) => {
                                    setFormData({
                                        ...formData,
                                        roles: selectedOptions ? selectedOptions.map(option => option.value) : []
                                    });
                                }}
                            />
                        </div>
                    </div>
                </ModalBase>
            </div>
        </div>
    );
};

export default UserInformation;
