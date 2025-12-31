// Main Category DTOs

export type MainCategoryData = {
  id?: number;
  uuid?: string;
  name?: string;
  icon?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateMainCategoryRequest = {
  name: string;
  icon?: string;
  description?: string;
};

export type UpdateMainCategoryRequest = Partial<CreateMainCategoryRequest>;

export type GetMainCategoriesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
