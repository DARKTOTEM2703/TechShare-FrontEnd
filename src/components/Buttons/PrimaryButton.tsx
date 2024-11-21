import React, { useState } from 'react'
import '@/styles/buttons.css'

interface ButtonProps {
    buttonLabel: string;
    buttonFunction: any;
    isDisabled?: boolean;
}

export default function Button({ buttonLabel, buttonFunction, isDisabled = false }: ButtonProps) {
    return (
        <button className={`primary-button ${isDisabled ? 'invisible' : ''}`}
            onClick={buttonFunction}
            disabled={isDisabled}
            type='submit'
        >
            {isDisabled ? 'Empty' : buttonLabel /*This is only to ensure there is the same padding as the headers with text*/}
        </button>
    )
}
