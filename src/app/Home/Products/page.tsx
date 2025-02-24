'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from '@/app/home/components/ProductCard';
import endpoints from '@/app/infraestructure/config/configAPI';
import fetchData from '@/services/fetchData';
import { getToken } from "@/services/storageService";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react"; // Iconos opcionales

export default function Products() {
  const token = getToken() || '';
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para la búsqueda
  const [sortAZ, setSortAZ] = useState<boolean>(true); // Estado para ordenar A-Z o Z-A

  useEffect(() => {
    fetchData(endpoints.categories.getAll, token)
      .then((data) => {
        setCategories(data || []);
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
        {sortedCategories.length > 0 ? (
          sortedCategories.map((category: any) => (
            <div key={category.category_id} className="mx-auto">
              <ProductCard item={category} />
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No se encontraron categorías.</p>
        )}
      </div>
    </div>
  );
}
