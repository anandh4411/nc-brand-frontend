// Form Field DTOs - Aligned with Backend Prisma Schema

export type FormFieldData = {
  id?: number;
  uuid?: string;
  formId?: number;
  type?: string; // "text" | "email" | "phone" | "select" | "date" | "file" | "textarea" | "number"
  label?: string;
  placeholder?: string | null;
  required?: boolean;
  options?: string[] | null; // JSON array stored as string in DB
  aspectRatio?: string | null; // For file fields
  accessGallery?: boolean; // For file fields - allow gallery access on mobile
  validation?: any | null; // JSON validation rules
  defaultValue?: string | null;
  helpText?: string | null;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateFormFieldRequest = {
  formId: number;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  aspectRatio?: string; // For file fields
  accessGallery?: boolean; // For file fields - allow gallery access on mobile
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  defaultValue?: string;
  helpText?: string;
  order: number;
};

export type UpdateFormFieldRequest = Partial<Omit<CreateFormFieldRequest, 'formId'>>;

export type GetFormFieldsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  formId?: number;
};
