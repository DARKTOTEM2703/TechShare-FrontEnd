'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from '@/app/home/components/ProductCard';
import endpoints from '@/app/infraestructure/config/configAPI';
import fetchData from '@/services/fetchData';
import { getToken } from "@/services/storageService";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import RollingSpinner from '@/assets/animations/rolling-spinner.svg'; // Importar el spinner

export default function Products() {
  const token = getToken() || '';
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para la búsqueda
  const [sortAZ, setSortAZ] = useState<boolean>(true); // Estado para ordenar A-Z o Z-A
  const [isLoading, setIsLoading] = useState<boolean>(true); // Hook para guardar el valor de si está cargando

  useEffect(() => {
    setIsLoading(true); // Activar el estado de carga
    fetchData(endpoints.categories.getAll, token)
      .then((data) => {
        setCategories(data || []);
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false);  // Desactivar loading en caso de error
      });
  }, []);

  // Filtrar categorías 
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar las categorías de A-Z o Z-A
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    return sortAZ
      ? a.name.localeCompare(b.name) // A-Z
      : b.name.localeCompare(a.name); // Z-A
  });

  // Renderizado condicional
  if (isLoading) {
    return (
      <div className="bg-white rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-primary text-2xl">CATEGORÍAS</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar..."
              className="border p-2 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setSortAZ(!sortAZ)}
              className="flex items-center bg-gray-200 px-3 py-2 rounded"
            >
              {sortAZ ? <ArrowDownAZ size={18} /> : <ArrowUpAZ size={18} />}
              <span className="ml-2">Ordenar {sortAZ ? 'A-Z' : 'Z-A'}</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center pt-6">
          <RollingSpinner width={80} height={80} /> {/* Spinner de carga */}
          <h1 className="pt-6 font-semibold text-lg">Cargando contenido...</h1>
        </div>
      </div>
    );
  }

  if (filteredCategories.length === 0) {
    return (
      <div className="bg-white rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-primary text-2xl">CATEGORÍAS</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar..."
              className="border p-2 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setSortAZ(!sortAZ)}
              className="flex items-center bg-gray-200 px-3 py-2 rounded"
            >
              {sortAZ ? <ArrowDownAZ size={18} /> : <ArrowUpAZ size={18} />}
              <span className="ml-2">Ordenar {sortAZ ? 'A-Z' : 'Z-A'}</span>
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center pt-6">
          <h1 className="font-semibold text-lg">No hay elementos para mostrar</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-primary text-2xl">CATEGORÍAS</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setSortAZ(!sortAZ)}
            className="flex items-center bg-gray-200 px-3 py-2 rounded"
          >
            {sortAZ ? <ArrowDownAZ size={18} /> : <ArrowUpAZ size={18} />}
            <span className="ml-2">Ordenar {sortAZ ? 'A-Z' : 'Z-A'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 py-4 px-12 mx-auto">
        {sortedCategories.map((category: any) => (
          <div key={category.category_id} className="mx-auto">
            <ProductCard item={category} />
          </div>
        ))}
      </div>
    </div>
  );
}