"use client"
import React, { useState, useEffect } from 'react';
import Categories from '@/app/admin/catalog/components/Categories';
import SubCategories from '@/app/admin/catalog/components/SubCategories';
import Materials from '@/app/admin/catalog/components/Materials';
import { useAuth } from '@/hooks/useAuth';
import { getToken } from '@/services/storageService';
import endpoints from '@/app/infraestructure/config/configAPI';
import fetchData from '@/services/fetchData';
import { Material } from '@/app/admin/catalog/interfaces/Material';
import { Category } from '@/app/admin/catalog/interfaces/Category';
import { SubCategory } from '@/app/admin/catalog/interfaces/SubCategory';
import { AnimatedSection } from '@/components/Ui/AnimatedComponents';

export default function Catalog() {

  type Role = {
    roleId: number;
    name: string;
  }

  const [roles, setRoles] = useState<Role[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useAuth();
  const token = getToken() || '';

  const fetchCategories = () => {
    fetchData(endpoints.categories.getAll, token)
      .then((data) => setCategories(Array.isArray(data) ? data : []))
  }

  const fetchSubCategories = () => {
    fetchData(endpoints.subcategories.getAll, token)
      .then((data) => setSubCategories(Array.isArray(data) ? data : []))
  }

  const fetchMaterials = () => {
    fetchData(endpoints.materials.getAll, token)
      .then((data) => setMaterials(Array.isArray(data) ? data : []))
  }

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, subCategoriesData, materialsData, rolesData] = await Promise.all([
          fetchData(endpoints.categories.getAll, token),
          fetchData(endpoints.subcategories.getAll, token),
          fetchData(endpoints.materials.getAll, token),
          fetchData(endpoints.roles.getAll, token),
        ]);

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setSubCategories(Array.isArray(subCategoriesData) ? subCategoriesData : []);
        setMaterials(Array.isArray(materialsData) ? materialsData : []);
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [token]);

  //React Image Crop parameters
  const ASPECT_RATIO = 3 / 2
  const MIN_DIMENSION = 200
  const MIN_WIDTH = 200

  return (
    <div className="container-responsive spacing-y-responsive">
      <AnimatedSection animation="slide-up" delay={100}>
        <Materials
          token={token}
          subCategories={subCategories}
          roles={roles}
          materials={materials}
          refreshMaterials={fetchMaterials}
          ASPECT_RATIO={ASPECT_RATIO}
          MIN_DIMENSION={MIN_DIMENSION}
          MIN_WIDTH={MIN_WIDTH}
          isLoading={isLoading}
        />
      </AnimatedSection>
      <AnimatedSection animation="slide-up" delay={200}>
        <SubCategories
          token={token}
          categories={categories}
          subCategories={subCategories}
          refreshSubCategories={fetchSubCategories}
          ASPECT_RATIO={ASPECT_RATIO}
          MIN_DIMENSION={MIN_DIMENSION}
          MIN_WIDTH={MIN_WIDTH}
          isLoading={isLoading}
        />
      </AnimatedSection>
      <AnimatedSection animation="slide-up" delay={300}>
        <Categories
          token={token}
          categories={categories}
          refreshCategories={fetchCategories}
          ASPECT_RATIO={ASPECT_RATIO}
          MIN_DIMENSION={MIN_DIMENSION}
          MIN_WIDTH={MIN_WIDTH}
          isLoading={isLoading}
        />
      </AnimatedSection>
    </div>
  );
}
 
