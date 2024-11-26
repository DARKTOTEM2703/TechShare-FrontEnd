import React from 'react';
import { useState } from 'react';
import '@/styles/form.css';
import '@/components/Inputs/BorderTextField';
import BorderTextField from '@/components/Inputs/BorderTextField';
import BorderRichTextBox from '@/components/Inputs/BorderRichTextBox';
import Dropdown from '../../Dropdowns/Dropdown';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import endpoints from '@/app/infraestructure/config/configAPI';

interface NewMovementFormProps {
    selectedMaterial: { id: number; name: string } | null;
    refreshData: () => void;
    token: string;
}

const NewMovementForm: React.FC<NewMovementFormProps> = ({ selectedMaterial, token, refreshData }) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [moveType, setMoveType] = useState<string>('');
    const [comment, setComment] = useState<string>('');

    const { handleCreate } = useCrudOperations(token, refreshData);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validación del formulario
        if (!quantity || quantity <= 0) {
            alert('Por favor, ingrese una cantidad válida');
            return;
        }

        if (!moveType) {
            alert('Por favor, seleccione un tipo de movimiento');
            return;
        }

        console.log(token)

        // Crear FormData y agregar los datos del formulario
        const formData = new FormData();
        formData.append('quantity', quantity.toString());
        formData.append('moveType', moveType.toUpperCase());
        formData.append('id_material', selectedMaterial ? selectedMaterial.id.toString() : '');
        formData.append('comment', comment);

        console.log('Datos enviados:', Object.fromEntries(formData.entries()));

        // Enviar datos al servidor
        handleCreate(endpoints.movements.create, formData);
        refreshData();
    };
    return (
        <div className="flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-96">
                <h2 className="text-primary text-center font-semibold text-lg">Nuevo movimiento</h2>
                <div className="w-full h-px bg-primary my-4" />
                <form onSubmit={handleSubmit}>
                    <h2 className="font-bold text-base text-primary mb-4 text-center">
                        {selectedMaterial ? selectedMaterial.name : 'Paquete De 4 Resistencias'}
                    </h2>
                    {/* Contenedor del Dropdown y Quantity */}
                    <div className="flex mb-4 space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold mb-3">Tipo de movimiento</label>
                            <div>
                                <Dropdown
                                    options={['IN', 'OUT', 'ADJUSTMENT']}
                                    value={moveType}
                                    onChange={(value: string) => setMoveType(value)}
                                />
                            </div>
                        </div>
                        <div className="w-1/3">
                            <label className="block text-sm font-semibold mb-3">Quantity</label>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Ingrese la cantidad"
                                    name="quantity"
                                    value={quantity}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setQuantity(Number(e.target.value))
                                    }
                                    className="border rounded-md border-primary p-2 w-full text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Contenedor del RichTextBox */}
                    <div className="">
                        <label className="block text-sm font-semibold mb-3">Comentarios:</label>
                        <div>
                            <BorderRichTextBox
                                placeholder="Ingrese un comentario"
                                name="comment"
                                value={comment}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setComment(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    {/* Botón */}
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 rounded-md hover:bg-primary-dark transition-colors"
                    >
                        INSERTAR
                    </button>
                </form>
            </div>
        </div>
    );

};

export default NewMovementForm;
