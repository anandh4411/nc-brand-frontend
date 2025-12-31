// Sub Category DTOs

export type SubCategoryData = {
  id?: number;
  uuid?: string;
  name?: string;
  description?: string;
  mainCategoryId?: number;
  mainCategoryName?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSubCategoryRequest = {
  name: string;
  description?: string;
  mainCategoryId: number;
};

export type UpdateSubCategoryRequest = Partial<Omit<CreateSubCategoryRequest, 'mainCategoryId'>>;

export type GetSubCategoriesParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  mainCategoryId?: number;
};
