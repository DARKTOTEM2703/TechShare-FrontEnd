import React from 'react';
import ModalBase from '@/components/Modal/ModalBase';

interface DeleteCategoryModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export default function DeleteCategoryModal({
    isVisible,
    onClose,
    onSubmit
}: DeleteCategoryModalProps) {
    if (!isVisible) return null;

    return (
        <ModalBase
            onClose={onClose}
            header="Confirmar eliminación de categoría"
            onSubmit={onSubmit}
        >
            <p>¿Estás seguro de que quieres eliminar esta categoría?</p>
        </ModalBase>
    );
}
