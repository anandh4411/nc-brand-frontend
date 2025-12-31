// Products DTOs
export type ProductData = {
  id?: number;
  uuid?: string;
  name?: string;
  description?: string;
  price?: string;
  image?: string;
  mainCategoryId?: number;
  subCategoryId?: number;
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProductRequest = {
  name: string;
  description?: string;
  price: string;
  image?: File | string;
  mainCategoryId: number;
  subCategoryId: number;
  isPopular?: boolean;
};

export type UpdateProductRequest = Partial<CreateProductRequest>;

export type GetProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  mainCategoryId?: number;
  subCategoryId?: number;
  isPopular?: boolean;
};

// === LANDING PAGE PRODUCT TYPES ===

export type LandingProduct = {
  uuid: string;
  name: string;
  description: string;
  price: number;
  image?: string | null;
  isPopular: boolean;
};

export type LandingSubCategory = {
  uuid: string;
  name: string;
  description: string;
  products: LandingProduct[];
};

export type LandingCategory = {
  uuid: string;
  name: string;
  description: string;
  icon: string;
  subCategories: LandingSubCategory[];
};

export type LandingProductsData = {
  categories: LandingCategory[];
};
