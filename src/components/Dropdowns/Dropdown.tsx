import React from 'react'
import Image from 'next/image'
import '@/styles/dropdown.css'
import '@/styles/containers.css'
import filterIcon from '/src/assets/icons/filter.svg'
import { IoMdArrowDropdown } from "react-icons/io";
import { FaFilter } from 'react-icons/fa';

interface DropdownProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function Dropdown({ options, value, onChange, className }: DropdownProps) {
    return (
        <div className={className}>
            <div className='relative'>
                <select
                    className='dropdown text-sm'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="" disabled>Seleccione una opción</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value.toLowerCase()}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <IoMdArrowDropdown className='dropdown-icon text-3xl text-primary' />
            </div>
        </div>
    )
}
