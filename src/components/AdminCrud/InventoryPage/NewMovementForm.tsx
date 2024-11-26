import React from 'react';
import '@/styles/form.css';
import '@/components/Inputs/BorderTextField'
import BorderTextField from '@/components/Inputs/BorderTextField';

interface NewMovementFormProps {
    selectedMaterial: string;
}

const NewMovementForm: React.FC<NewMovementFormProps> = ({ selectedMaterial }) => {
    return (
        <div>
            <div className="form-container">
                <h2 className='text-primary text-center font-semibold'>Nuevo movimiento</h2>
                <div className="w-[80%] h-px bg-primary my-4 mx-auto " />
                <form onSubmit={() => { }}>
                    <h2 className='font-bold text-lg text-primary'>
                        {selectedMaterial}
                    </h2>
                </form>
            </div>
        </div>
    );
}
export default NewMovementForm;
