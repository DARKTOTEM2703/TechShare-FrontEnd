"use client"
import React from 'react'
import '@/styles/containers.css'
import '@/styles/buttons.css'
import { inter } from '@/services/fonts'
import SearchBar from '@/components/AdminCrud/SearchBar'
import Dropdown from './Dropdown'
import Button from '../Buttons/PrimaryButton'

interface CrudHeaderProps {
  title: string;
  buttonLabel: string;
  buttonFunction: any;
  onSearchChange: (value: string) => void;
  buttonDisabled?: boolean; // Nueva prop opcional para deshabilitar el botón
}

const CrudHeader: React.FC<CrudHeaderProps> = ({ title, buttonLabel, buttonFunction, onSearchChange, buttonDisabled }) => {
  return (
    <div>
      <div className='white-container'>
        <p className={`${inter.className} antialiased font-semibold text-lg pl-1 text-[#1E2A5E]`} >
          {title}
        </p>
        <Button buttonLabel={buttonLabel} buttonFunction={buttonFunction} isDisabled={buttonDisabled} />
      </div>
      <div className='flex gap-6'>
        <div className='w-3/4 '>
          <SearchBar onSearchChange={onSearchChange} />
        </div>
        <div className='w-1/4'>
          <Dropdown />
        </div>
      </div>
    </div>
  );
};

export default CrudHeader;
