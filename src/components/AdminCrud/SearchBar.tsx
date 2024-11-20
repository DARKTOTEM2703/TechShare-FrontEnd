import React from 'react'
import Image from 'next/image'
import '@/styles/search-bar.css'
import '@/styles/containers.css'
import lupaIcon from '/src/assets/icons/lupa.svg'
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  onSearchChange: (value: string) => void; // Nueva prop para manejar cambios en la búsqueda
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value); // Notificar al componente superior
  };

  return (
    <div className='my-8 relative'>
      <input
      type="text"
      className="search-bar text-sm" 
      placeholder="Search"
      onChange={handleInputChange} // Manejar el cambio del input
      />
      <FaSearch className='search-bar-icon text-secondary' />
    </div>
  );
}
