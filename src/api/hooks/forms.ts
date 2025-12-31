import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { formsApi, formFieldsApi } from '@/api/endpoints/forms';
import { queryKeys } from '@/api/query-keys';
import { toast } from '@/lib/toast';
import type { CreateFormRequest, UpdateFormRequest, GetFormsParams } from '@/types/dto/form.dto';
import type { CreateFormFieldRequest, UpdateFormFieldRequest, GetFormFieldsParams } from '@/types/dto/form-field.dto';

export const useForms = (params?: GetFormsParams) => {
  return useQuery({
    queryKey: queryKeys.forms.list(params),
    queryFn: () => formsApi.getForms(params),
    placeholderData: keepPreviousData,
  });
};

export const useForm = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.forms.detail(uuid),
    queryFn: () => formsApi.getFormById(uuid),
    enabled: !!uuid,
  });
};

export const useCreateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFormRequest) => formsApi.createForm(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.lists() });
      toast.success('Success', response.message || 'Form created');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to create form');
    },
  });
};

export const useUpdateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateFormRequest }) =>
      formsApi.updateForm(uuid, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.detail(variables.uuid) });
      toast.success('Success', response.message || 'Form updated');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to update form');
    },
  });
};

export const useDeleteForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => formsApi.deleteForm(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.lists() });
      toast.success('Success', response.message || 'Form deleted');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to delete form');
    },
  });
};

// ========== FORM FIELD HOOKS ==========

export const useFormFields = (params?: GetFormFieldsParams) => {
  return useQuery({
    queryKey: queryKeys.formFields.list(params),
    queryFn: () => formFieldsApi.getFormFields(params),
    placeholderData: keepPreviousData,
  });
};

export const useFormField = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.formFields.detail(uuid),
    queryFn: () => formFieldsApi.getFormFieldById(uuid),
    enabled: !!uuid,
  });
};

export const useCreateFormField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFormFieldRequest) => formFieldsApi.createFormField(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.formFields.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.detail(response.data?.formId?.toString()) });
      toast.success('Success', response.message || 'Form field created');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to create form field');
    },
  });
};

export const useUpdateFormField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateFormFieldRequest }) =>
      formFieldsApi.updateFormField(uuid, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.formFields.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.formFields.detail(variables.uuid) });
      toast.success('Success', response.message || 'Form field updated');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to update form field');
    },
  });
};

export const useDeleteFormField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => formFieldsApi.deleteFormField(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.formFields.lists() });
      toast.success('Success', response.message || 'Form field deleted');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to delete form field');
    },
  });
};

// Bulk get all fields for a form
export const useBulkGetFormFields = (formId?: number) => {
  return useQuery({
    queryKey: queryKeys.formFields.list({ formId }),
    queryFn: () => formFieldsApi.bulkGetFormFields(formId!),
    enabled: !!formId,
  });
};

// Bulk create fields (first time)
export const useBulkCreateFormFields = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formId, fields }: { formId: number; fields: any[] }) =>
      formFieldsApi.bulkCreateFormFields(formId, fields),
    onSuccess: (response, variables) => {
      // Invalidate form fields list
      queryClient.invalidateQueries({ queryKey: queryKeys.formFields.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.formFields.list({ formId: variables.formId }) });

      // Invalidate forms list to refresh field count
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });

      toast.success('Success', response.message || 'Form fields created successfully');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to create form fields');
    },
  });
};

// Bulk update fields (existing)
export const useBulkUpdateFormFields = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formId, fields }: { formId: number; fields: any[] }) =>
      formFieldsApi.bulkUpdateFormFields(formId, fields),
    onSuccess: (response, variables) => {
      // Invalidate form fields list
      queryClient.invalidateQueries({ queryKey: queryKeys.formFields.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.formFields.list({ formId: variables.formId }) });

      // Invalidate forms list to refresh field count
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.forms.all });

      toast.success('Success', response.message || 'Form fields updated successfully');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to update form fields');
    },
  });
};
