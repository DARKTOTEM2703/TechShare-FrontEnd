import React from 'react'
import Image from 'next/image'
import '@/styles/dropdown.css'
import '@/styles/containers.css'
import filterIcon from '/src/assets/icons/filter.svg'
import { FaFilter } from 'react-icons/fa';

export default function Dropdown() {
  return (
    <div className=''>
      <div className='my-8 relative '>
        <select className='dropdown text-sm' defaultValue="">
          <option value="" disabled>Select an option</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <FaFilter className='dropdown-icon text-secondary' />
      </div>
    </div>
  )
}
