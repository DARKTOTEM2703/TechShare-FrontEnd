"use client"

import React from 'react'
import { createPortal } from 'react-dom'
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
    showButtons?: boolean; // Nuevo prop opcional
}

export default function Modal({ onClose, header, children, onSubmit, showButtons = true }: ModalProps) {
    return createPortal(
        <div className='modal-overlay' onClick={onClose}>
            <form 
                onSubmit={onSubmit} 
                onClick={(e) => e.stopPropagation()} 
                style={{
                    display: 'contents'
                }}
            >
                <div className='modal'>
                    <div className='border-b-[1px] mb-6'>
                        <h2 className='text-lg mb-2'>{header}</h2>
                    </div>
                    <div className='flex flex-col'>
                        {children}
                    </div>
                    {showButtons && (
                        <div className='justify-end flex space-x-3 mt-2'>
                            <SecondaryButton
                                buttonLabel='Cancelar'
                                buttonFunction={onClose}
                            />
                            <PrimaryButton
                                buttonLabel='Guardar'
                                buttonFunction={() => { }}
                            />
                        </div>
                    )}
                </div>
            </form>
        </div>,
        document.body
    )
}