import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { institutionApi } from '@/api/endpoints/institution';
import { queryKeys } from '@/api/query-keys';
import { toast } from '@/lib/toast';
import type { InstitutionLoginRequest } from '@/types/dto/institution-auth.dto';
import type {
  SelectTemplateRequest,
  GetInstitutionSubmissionsParams,
} from '@/types/dto/institution-dashboard.dto';

// === Dashboard Query ===
export const useInstitutionDashboard = () => {
  return useQuery({
    queryKey: queryKeys.institutions.dashboard(),
    queryFn: () => institutionApi.getDashboard(),
    retry: 1, // Retry once on failure (token refresh will handle 401s)
  });
};

// === Template Selection Mutation ===
export const useSelectTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SelectTemplateRequest) => institutionApi.selectTemplate(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.institutions.dashboard() });
      toast.success('Success', response.message || 'Template selected successfully');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to select template');
    },
  });
};

// === Institution Submissions Query ===
export const useInstitutionSubmissions = (params?: GetInstitutionSubmissionsParams) => {
  return useQuery({
    queryKey: queryKeys.submissions.list(params),
    queryFn: () => institutionApi.getSubmissions(params),
    placeholderData: keepPreviousData,
  });
};

// === Institution Login Mutation ===
export const useInstitutionLogin = () => {
  return useMutation({
    mutationFn: (data: InstitutionLoginRequest) => institutionApi.login(data),
    onError: (error: any) => {
      toast.error('Login Failed', error.message || 'Invalid credentials');
    },
  });
};

// === Institution PDF Export ===
export const useInstitutionExportPdf = () => {
  return useMutation({
    mutationFn: (params?: { phaseId?: number }) => institutionApi.exportPdf(params),
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Success', 'PDF exported successfully');
    },
    onError: (error: any) => {
      toast.error('Export Failed', error.message || 'Failed to export PDF');
    },
  });
};
