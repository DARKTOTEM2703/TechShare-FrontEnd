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

  const [categories, setCategories] = useState<Category[]>([]);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className='mb-6'>
        <SubCategories token={token} categories={categories} />
      </div>
      <div>
        <Categories token={token} categories={categories} refreshCategories={fetchCategories} />
      </div>
    </div>
  );
}