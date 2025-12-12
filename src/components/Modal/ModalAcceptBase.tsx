"use client"

import React from 'react'
import { ReactNode } from 'react'
import '@/styles/containers.css'
import '@/styles/modal.css'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import SecondaryButton from '@/components/Buttons/SecondaryButton'

interface ModalProps {
    onClose: () => void; // Función para cerrar el modal
    header: string;
    children?: ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Modal({ onClose, header, children, onSubmit }: ModalProps) {
    return (
        <div className='modal-overlay' onClick={onClose}>
            <form onSubmit={onSubmit} onClick={(e) => e.stopPropagation()}>
                <div className='modal'>
                    <div className='border-b-[1px]'>
                        <h2 className='text-lg'>{header}</h2>
                    </div>
                    <div>
                        {children}
                    </div>
                    <div className='justify-end flex space-x-3 mt-2'>
                        <SecondaryButton
                            buttonLabel='Cancelar'
                            buttonFunction={onClose}
                        />
                        <PrimaryButton
                            buttonLabel='Aceptar'
                            buttonFunction={() => { }}
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}