import React from 'react'
import Image from 'next/image'
import '@/styles/dropdown.css'
import '@/styles/containers.css'
import filterIcon from '/src/assets/icons/filter.svg'
import { IoMdArrowDropdown } from "react-icons/io";
import { FaFilter } from 'react-icons/fa';

interface DropdownProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export default function Dropdown({ options, value, onChange }: DropdownProps) {
    return (
        <div className=''>
            <div className='my-8 relative '>
                <select
                    className='dropdown text-sm'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="" disabled>Select an option</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.toLowerCase()}>
                            {option}
                        </option>
                    ))}
                </select>
                <IoMdArrowDropdown className='dropdown-icon text-3xl text-primary ' />
            </div>
        </div>
    )
}
