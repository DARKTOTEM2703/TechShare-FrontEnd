import fetchData from '@/services/fetchData';
import endpoints from '@/app/infraestructure/config/configAPI';
import { Category } from '@/app/admin/catalog/interfaces/Category';
import { SubCategory } from '@/app/admin/catalog/interfaces/SubCategory';
import { Material } from '@/app/admin/catalog/interfaces/Material';

export type Role = {
  roleId: number;
  name: string;
}

export const fetchCategories = async (token: string): Promise<Category[]> => {
  return await fetchData(endpoints.categories.getAll, token);
}

export const fetchSubCategories = async (token: string): Promise<SubCategory[]> => {
  return await fetchData(endpoints.subcategories.getAll, token);
}

export const fetchMaterials = async (token: string): Promise<Material[]> => {
  return await fetchData(endpoints.materials.getAll, token);
}

export const fetchRoles = async (token: string): Promise<Role[]> => {
  return await fetchData(endpoints.roles.getAll, token);
}

export const fetchAllCatalogData = async (token: string) => {
  try {
    const [categoriesData, subCategoriesData, materialsData, rolesData] = await Promise.all([
      fetchCategories(token),
      fetchSubCategories(token),
      fetchMaterials(token),
      fetchRoles(token),
    ]);

    return {
      categories: categoriesData,
      subCategories: subCategoriesData,
      materials: materialsData,
      roles: rolesData
    };
  } catch (error) {
    console.error("Error fetching catalog data:", error);
    throw error;
  }
} 