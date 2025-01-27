"use client";
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar/NavBar';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/AdminCrud/SearchBar';
import ProductCard from '@/app/home/components/ProductCard';
import endpoints from '../infraestructure/config/configAPI';
import fetchData from '@/services/fetchData';
import { getToken } from "@/services/storageService";


export default function Home() {
  const router = useRouter();

  const token = getToken() || '';

  const [materials, setMaterials] = useState([]);
  useEffect(() => {
    fetchData(endpoints.materials.getAll, token)
      .then((data) => {
        setMaterials(data);
      });
  }, []);

  return (
    <div className="min-h-screen rounded-lg bg-gray-100 flex flex-col items-center">
      <div className="w-full ">
        {/* Contenedor superior */}
        <div className="px-6 py-4 bg-primary rounded-t-lg flex justify-center">
          <div className="w-full max-w-4xl">
            <SearchBar onSearchChange={() => console.log('')} />
          </div>
        </div>
        {/* Título */}
        <h1 className="text-primary text-lg sm:text-xl md:text-2xl font-semibold text-center py-6">
          ¡Consigue los materiales que necesitas aquí!
        </h1>
        {/* Contenedor de productos */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 py-4 px-12 mx-auto"
        >
          {materials.map((material: any) => (
            <div
              key={material.materialsId}
              className=" mx-auto" // Dimensiones fijas para las tarjetas
            >
              <ProductCard material={material} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
