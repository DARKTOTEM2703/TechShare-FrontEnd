import React, { useState } from 'react';
import '@/styles/form.css';
import BorderRichTextBox from '@/components/Inputs/BorderRichTextBox';
import Dropdown from '../../Dropdowns/Dropdown';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';

interface NewMovementFormProps {
    selectedMaterial: { id: number; name: string } | null;
    refreshData: () => void;
    token: string;
    openConfirmModal: (action: () => void) => void;
}

const NewMovementForm: React.FC<NewMovementFormProps> = ({ 
    selectedMaterial, 
    token, 
    refreshData, 
    openConfirmModal 
}) => {
    const [quantity, setQuantity] = useState<number>();
    const [moveType, setMoveType] = useState<string>('');
    const [comment, setComment] = useState<string>('');

    const { handleCreate } = useCrudOperations(token, refreshData);

    const movementOptions = [
        { value: 'IN', label: 'Entrada' },
        { value: 'OUT', label: 'Salida' },
        { value: 'ADJUST', label: 'Ajuste' }
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!quantity || quantity <= 0) {
            alert('Por favor, ingrese una cantidad válida');
            return;
        }

        if (!moveType) {
            alert('Por favor, seleccione un tipo de movimiento');
            return;
        }

        const action = () => {
            const formData = new FormData();
            formData.append('quantity', quantity.toString());
            formData.append('moveType', moveType.toUpperCase());
            formData.append('id_material', selectedMaterial ? selectedMaterial.id.toString() : '');
            formData.append('comment', comment);

            handleCreate(endpoints.movements.create, formData);
            refreshData();
        };

        openConfirmModal(action);
    };

    return (
        <div className="flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-[28rem]">
                {/* Encabezado */}
                <h2 className="text-primary text-center font-semibold text-lg">Nuevo movimiento</h2>
                <div className="w-full h-px bg-primary my-4" />
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre del material */}
                    <h2 className="font-bold text-base text-primary text-center truncate px-4">
                        {selectedMaterial ? selectedMaterial.name : 'Seleccione un material'}
                    </h2>

                    {/* Tipo de movimiento y Cantidad */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold mb-2">
                                Tipo de movimiento
                            </label>
                            <Dropdown
                                options={movementOptions}
                                value={moveType}
                                onChange={(value: string) => setMoveType(value)}
                            />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-sm font-semibold mb-2">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                placeholder="Cantidad"
                                name="quantity"
                                value={quantity || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = Math.floor(Number(e.target.value));
                                    if (value > 0) {
                                        setQuantity(value);
                                    }
                                }}
                                className="border rounded-md border-primary p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Comentarios */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            Comentarios
                        </label>
                        <BorderRichTextBox
                            placeholder="Ingrese un comentario"
                            name="comment"
                            value={comment}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Botón de submit */}
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-200"
                        disabled={!selectedMaterial}
                    >
                        REGISTRAR MOVIMIENTO
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewMovementForm;
