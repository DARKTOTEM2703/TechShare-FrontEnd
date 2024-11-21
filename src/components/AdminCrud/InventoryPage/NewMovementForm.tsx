import React from 'react';
import '@/styles/form.css';
import '@/components/Inputs/BorderTextField'

const NewMovementForm = () => {
    return (
        <div>
            <div className="form-container">
                <h2 className='text-primary text-center font-semibold'>Nuevo movimiento</h2>
                <div className="w-[80%] h-px bg-primary my-4 mx-auto " />
                <form onSubmit={() => { }}>

                </form>
            </div>
        </div>
    );
}
export default NewMovementForm;
