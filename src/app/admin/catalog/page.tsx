"use client"
import React, { useState, useEffect } from 'react';
import Categories from '@/app/admin/catalog/components/Categories';
import SubCategories from '@/app/admin/catalog/components/SubCategories';
import Materials from '@/app/admin/catalog/components/Materials';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/services/storageService';
import { Material } from '@/app/admin/catalog/interfaces/Material';
import { Category } from '@/app/admin/catalog/interfaces/Category';
import { SubCategory } from '@/app/admin/catalog/interfaces/SubCategory';
import {
  fetchCategories,
  fetchSubCategories,
  fetchMaterials,
  fetchRoles,
  fetchAllCatalogData,
  Role
} from '@/services/catalogService';

export default function Catalog() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useAuth();
  const token = getToken() || '';

  const refreshCategories = () => {
    fetchCategories(token)
      .then((data) => setCategories(data))
  }

  const refreshSubCategories = () => {
    fetchSubCategories(token)
      .then((data) => setSubCategories(data))
  }

  const refreshMaterials = () => {
    fetchMaterials(token)
      .then((data) => setMaterials(data))
  }

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllCatalogData(token);
        setCategories(data.categories);
        setSubCategories(data.subCategories);
        setMaterials(data.materials);
        setRoles(data.roles);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [token]);

  //React Image Crop parameters
  const ASPECT_RATIO = 3 / 2
  const MIN_DIMENSION = 200
  const MIN_WIDTH = 200

  return (
    <div>
      <div className='mb-6'>
        <Materials
          token={token}
          subCategories={subCategories}
          roles={roles}
          materials={materials}
          refreshMaterials={refreshMaterials}
          ASPECT_RATIO={ASPECT_RATIO}
          MIN_DIMENSION={MIN_DIMENSION}
          MIN_WIDTH={MIN_WIDTH}
          isLoading={isLoading}
        />
      </div>
      <div className='mb-6'>
        <SubCategories
          token={token}
          categories={categories}
          subCategories={subCategories}
          refreshSubCategories={refreshSubCategories}
          ASPECT_RATIO={ASPECT_RATIO}
          MIN_DIMENSION={MIN_DIMENSION}
          MIN_WIDTH={MIN_WIDTH}
          isLoading={isLoading}
        />
      </div>
      <div>
        <Categories
          token={token}
          categories={categories}
          refreshCategories={refreshCategories}
          ASPECT_RATIO={ASPECT_RATIO}
          MIN_DIMENSION={MIN_DIMENSION}
          MIN_WIDTH={MIN_WIDTH}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}