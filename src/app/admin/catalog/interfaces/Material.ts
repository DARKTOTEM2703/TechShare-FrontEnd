export type Material = {
    materialsId: number;
    imagePath: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    borrowable_stock: number;
    subCategoryId: number;
    subCategoryName: string;
    roleIds: number[];
    roleNames: string[];
  };