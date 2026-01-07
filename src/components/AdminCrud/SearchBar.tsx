import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import '@/styles/search-bar.css'
import '@/styles/containers.css'
// @ts-ignore - asset import handled by Next; declare file types in src/types/custom.d.ts
import lupaIcon from '/src/assets/icons/lupa.svg'
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  onSearchChange: (value: string) => void; // Nueva prop para manejar cambios en la búsqueda
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');

  // Debounce search to avoid filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  return (
    <div className='my-8 relative'>
      <input
      type="text"
      className="search-bar text-sm" 
      placeholder="Buscar"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      />
      <FaSearch className='search-bar-icon text-secondary' />
    </div>
  );
}
