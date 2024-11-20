"use client"
import React, { useState, useEffect } from 'react';
import Categories from '@/components/AdminCrud/MaterialCatalog/Categories';
import SubCategories from '@/components/AdminCrud/MaterialCatalog/SubCategories';
import Materials from '@/components/AdminCrud/MaterialCatalog/Materials';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/services/storageService';
import endpoints from '@/app/infraestructure/config/configAPI';
import fetchData from '@/services/fetchData';

export default function Catalog() {

  type Material = {
    image: File;
    name: string;
    description: string;
    price: number;
    subCategoryId: number;
    roleIds: number[];
  };
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

  type Role = {
    roleId: number;
    name: string;
  };

  const [roles, setRoles] = useState<Role[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

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

  const fetchMaterials = () => {
    fetchData(endpoints.materials.getAll, token)
      .then((data) => setMaterials(data))
  }

  const fetchRoles = () => {
    fetchData(endpoints.roles.getAll, token)
      .then((data) => setRoles(data))
  }

  useEffect(() => {
    fetchSubCategories()
    fetchCategories()
    fetchMaterials()
    fetchRoles()
  }, []);
/*
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(categories);
    }, 5000);

    return () => clearInterval(interval);
  }, [categories]);
  */
  return (
    <div>
      <div className='mb-6'>
        <Materials
          token={token}
          subCategories={subCategories}
          roles={roles} // Add the appropriate roles array here
          materials={materials}
          refreshMaterials={fetchMaterials} />
      </div>
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