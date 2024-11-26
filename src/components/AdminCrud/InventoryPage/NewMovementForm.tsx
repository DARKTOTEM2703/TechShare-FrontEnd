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
        <div>
            <div className="form-container">
                <h2 className="text-primary text-center font-semibold">Nuevo movimiento</h2>
                <div className="w-[80%] h-px bg-primary my-4 mx-auto" />
                <form onSubmit={handleSubmit}>
                    <h2 className="font-bold text-lg text-primary">
                        {selectedMaterial ? selectedMaterial.name : 'Sin material seleccionado'}
                    </h2>
                    <Dropdown
                        options={['IN', 'OUT', 'ADJUSTMENT']}
                        value={moveType}
                        onChange={(value: string) => setMoveType(value)}
                    />
                    <BorderTextField
                        placeholder="Ingrese la cantidad"
                        name="quantity"
                        value={quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setQuantity(Number(e.target.value))
                        }
                    />
                    <BorderRichTextBox
                        placeholder="Ingrese un comentario"
                        name="comment"
                        value={comment}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setComment(e.target.value)
                        }
                    />
                    <button type="submit" className="btn-primary">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewMovementForm;
