import React from 'react';
import ModalBase from '@/components/Modal/ModalBase';

interface DeleteSubCategoryModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function DeleteSubCategoryModal({
    isVisible,
    onClose,
    onSubmit
}: DeleteSubCategoryModalProps) {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <ModalBase
                    onClose={onClose}
                    header="Confirmar eliminación de subcategoría"
                    onSubmit={onSubmit}
                >
                    <p>¿Estás seguro de querer eliminar esta subcategoría?</p>
                </ModalBase>
            </div>
        </div>
    );
}
