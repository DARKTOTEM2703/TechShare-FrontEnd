"use client"
import React, { useState, useEffect } from 'react';
import Categories from '@/components/AdminCrud/MaterialCatalog/Categories';
import SubCategories from '@/components/AdminCrud/MaterialCatalog/SubCategories';
import { useAuth } from '@/app/hooks/useAuth';
import { getToken } from '@/services/storageService';

export default function Catalog() {

  type Category = {
    categoryId: number;
    name: string;
    description?: string;
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

  useAuth()
  const token = getToken()

  const fetchCategories = () => {
    fetch("http://localhost:8080/categories/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch(error => console.error('Error:', error));
  };

  const fetchSubCategories = () => {
    fetch("http://localhost:8080/subcategories/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setSubCategories(data))
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
          categories={categories} refreshCategories={fetchCategories} />
      </div>
    </div>
  );
}