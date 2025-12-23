import React from 'react'
import Image from 'next/image'
import '@/styles/dropdown.css'
import '@/styles/containers.css'
// @ts-ignore - asset import handled by Next; declare file types in src/types/custom.d.ts
import filterIcon from '/src/assets/icons/filter.svg'
import { FaFilter } from 'react-icons/fa';

interface DropdownProps {
  options: string[];
}

export default function Dropdown({ options }: DropdownProps) {
  return (
    <div className=''>
      <div className='my-8 relative '>
        <select className='dropdown-filter text-sm' defaultValue="">
          <option value="" disabled>Filtros</option>
          {options.map((option, index) => (
            <option key={index} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
        <FaFilter className='dropdown-icon text-secondary' />
      </div>
    </div>
  )
}
