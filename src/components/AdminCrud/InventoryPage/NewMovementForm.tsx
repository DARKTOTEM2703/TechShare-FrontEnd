import React from 'react';
import { useState } from 'react';
import '@/styles/form.css';
import '@/components/Inputs/BorderTextField';
import BorderTextField from '@/components/Inputs/BorderTextField';
import BorderRichTextBox from '@/components/Inputs/BorderRichTextBox';
import Dropdown from '../../Dropdowns/Dropdown';

interface NewMovementFormProps {
    selectedMaterial: { id: number; name: string } | null;
}

const NewMovementForm: React.FC<NewMovementFormProps> = ({ selectedMaterial }) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [moveType, setMoveType] = useState<string>('');
    const [comment, setComment] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            quantity,
            moveType,
            id_material: selectedMaterial ? selectedMaterial.id : null,
            comment,
        };

        console.log(formData);
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))}
                    />
                    <BorderRichTextBox
                        placeholder="Ingrese un comentario"
                        name="comment"
                        value={comment}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
                    />
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default NewMovementForm;