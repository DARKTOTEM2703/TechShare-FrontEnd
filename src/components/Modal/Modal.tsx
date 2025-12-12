"use client"

import React from 'react'
import '@/styles/containers.css'
import '@/styles/modal.css'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import SecondaryButton from '@/components/Buttons/SecondaryButton'

interface ModalProps {
    onClose: () => void; // Función para cerrar el modal
}

export default function Modal({ onClose }: ModalProps) {
    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={(e) => e.stopPropagation()}>
                <div className='border-b-[1px]'>
                    <h2 className='text-lg'>Crear nuevo Rol</h2>
                </div>
                <div>
                    <input className='mt-4 modal-input' type='text' placeholder="Nombre del rol" />
                </div>
                <div className='justify-end flex space-x-3 mt-2'>
                    <SecondaryButton
                        buttonLabel='Cancelar'
                        buttonFunction={onClose}
                    />
                    <PrimaryButton
                        buttonLabel='Guardar'
                        buttonFunction={() => console.log('Guardar')}
                    />
                </div>
            </div>
        </div>
    )
}
