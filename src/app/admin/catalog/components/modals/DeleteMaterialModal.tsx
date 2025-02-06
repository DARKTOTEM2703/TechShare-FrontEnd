import React from 'react';
import ModalBase from '@/components/Modal/ModalBase';

interface DeleteMaterialModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function DeleteMaterialModal({
    isVisible,
    onClose,
    onSubmit
}: DeleteMaterialModalProps) {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <ModalBase
                    onClose={onClose}
                    header="Confirmar eliminación de material"
                    onSubmit={onSubmit}
                >
                    <p>¿Estás seguro de querer eliminar este material?</p>
                </ModalBase>
            </div>
        </div>
    );
}
