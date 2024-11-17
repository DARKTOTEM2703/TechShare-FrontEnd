"use client"
import React, { useState, useEffect } from 'react';
import Categories from '@/components/AdminCrud/MaterialCatalog/Categories';
import SubCategories from '@/components/AdminCrud/MaterialCatalog/SubCategories';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/services/storageService';
import endpoints from '@/app/infraestructure/config/configAPI';

export default function Catalog() {

  type Category = {
    categoryId: number;
    name: string;
    imageUrl?: string;
  };

  type SubCategory = {
    subCategoryId: number;
    name: string;
    description?: string;
    imageUrl?: string;
    categoryId: number;
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useAuth();
  const token = getToken();

  const fetchCategories = () => {
    fetch(endpoints.categories.getAll, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 204) {
          return []; // Si no hay contenido, devuelve un array vacío para limpiar el estado.
        }
        return response.json(); // Procesa JSON si hay contenido.
      })
      .then((data) => {
        setCategories(data); // Actualiza el estado con los datos recibidos o con el array vacío.
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchSubCategories = () => {
    fetch(endpoints.subcategories.getAll, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 204) {
          return []; // Si no hay contenido, devuelve un array vacío para limpiar el estado.
        }
        return response.json();
      })
      .then((data) => {
        setSubCategories(data);
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  return (
    <div>
      <div className='mb-6'>
        <SubCategories
          token={token}
          categories={categories}
          subCategories={subCategories}
          refreshSubCategories={fetchSubCategories} />
      </div>
      <div>
        <Categories
          token={token}
          categories={categories}
          refreshCategories={fetchCategories} />
      </div>
    </div>
  );
}