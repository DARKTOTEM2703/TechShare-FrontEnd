"use client"
import React, { useState, useEffect } from 'react';
import Categories from '@/components/AdminCrud/MaterialCatalog/Categories';
import SubCategories from '@/components/AdminCrud/MaterialCatalog/SubCategories';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/services/storageService';
import endpoints from '@/app/infraestructure/config/configAPI';
import fetchData from '@/services/fetchData';

export default function Catalog() {

  type SubCategory = {
    subCategoryId: number;
    name: string;
    description?: string;
    imageUrl?: string;
    categoryId: number;
  };
  
  type Category = {
    categoryId: number;
    name: string;
    imageUrl?: string;
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useAuth();
  const token = getToken();

  const fetchCategories = () => {
    fetchData(endpoints.categories.getAll, token)
      .then((data) => setCategories(data))
  }

  const fetchSubCategories = () => {
    fetchData(endpoints.subcategories.getAll, token)
      .then((data) => setSubCategories(data))
  }

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