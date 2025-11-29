"use client"
import React from 'react'
import '@/styles/containers.css'
import '@/styles/buttons.css'
import { inter } from '@/services/fonts'
import SearchBar from '@/components/AdminCrud/SearchBar'
import Dropdown from '../Dropdowns/FilterDropdown'
import Button from '../Buttons/PrimaryButton'

interface CrudHeaderProps {
  title: string;
  dropdownOptions: string[];
  buttonLabel: string;
  buttonFunction: any;
  onSearchChange: (value: string) => void;
  buttonDisabled?: boolean; // Nueva prop opcional para deshabilitar el botón
}

const CrudHeader: React.FC<CrudHeaderProps> = ({ title, dropdownOptions, buttonLabel, buttonFunction, onSearchChange, buttonDisabled }) => {
  return (
    <div className="space-y-4">
      <div className='white-container'>
        <p className={`${inter.className} antialiased font-semibold text-base sm:text-lg md:text-xl pl-1 text-[#1E2A5E] dark:text-white truncate`} >
          {title}
        </p>
        <Button buttonLabel={buttonLabel} buttonFunction={buttonFunction} isDisabled={buttonDisabled} />
      </div>
      <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6'>
        <div className='w-full sm:w-3/4'>
          <SearchBar onSearchChange={onSearchChange} />
        </div>
        <div className='w-full sm:w-1/4'>
          <Dropdown options={dropdownOptions} />
        </div>
      </div>
    </div>
  );
};

export default CrudHeader;
