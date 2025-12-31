import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { submissionsApi } from '@/api/endpoints/submissions';
import { queryKeys } from '@/api/query-keys';
import { toast } from '@/lib/toast';
import type { CreateSubmissionRequest, UpdateSubmissionRequest, GetSubmissionsParams, ExportSubmissionsParams, DuplicateAction } from '@/types/dto/submission.dto';

export const useSubmissions = (params?: GetSubmissionsParams) => {
  return useQuery({
    queryKey: queryKeys.submissions.list(params),
    queryFn: () => submissionsApi.getSubmissions(params),
    placeholderData: keepPreviousData,
  });
};

export const useSubmission = (uuid: string) => {
  return useQuery({
    queryKey: queryKeys.submissions.detail(uuid),
    queryFn: () => submissionsApi.getSubmissionById(uuid),
    enabled: !!uuid,
  });
};

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSubmissionRequest) => submissionsApi.createSubmission(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.lists() });
      toast.success('Success', response.message || 'Submission created');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to create submission');
    },
  });
};

export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateSubmissionRequest }) =>
      submissionsApi.updateSubmission(uuid, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.detail(variables.uuid) });
      toast.success('Success', response.message || 'Submission updated');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to update submission');
    },
  });
};

export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => submissionsApi.deleteSubmission(uuid),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.lists() });
      toast.success('Success', response.message || 'Submission deleted');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to delete submission');
    },
  });
};

export const useAddSubmissionsToPhase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { submissionUuids: string[]; phaseUuid: string }) =>
      submissionsApi.addSubmissionsToPhase(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.lists() });
      toast.success('Success', response.message || 'Submissions added to phase successfully');
    },
    onError: (error: any) => {
      toast.error('Error', error.message || 'Failed to add submissions to phase');
    },
  });
};

export const useImportSubmissionsCSV = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ institutionId, file, force, duplicateAction }: {
      institutionId: number;
      file: File;
      force?: boolean;
      duplicateAction?: DuplicateAction;
    }) =>
      submissionsApi.bulkImportCSV(institutionId, file, force, duplicateAction),
    onSuccess: (response) => {
      const { data } = response;

      // If there's a warning requiring user action, don't show toast - dialog handles it
      if (data.warning?.requiresForce || data.warning?.requiresDuplicateAction) {
        return;
      }

      // Invalidate cache only if actual import happened
      if (data.successCount > 0) {
        queryClient.invalidateQueries({ queryKey: queryKeys.submissions.lists() });
      }

      if (data.failedCount === 0 && data.successCount > 0) {
        toast.success('Success', `Successfully imported ${data.successCount} submissions`);
      } else if (data.successCount > 0) {
        toast.warn(
          'Partial Import',
          `Imported ${data.successCount}/${data.totalRows} submissions. ${data.failedCount} failed.`
        );
      }
    },
    onError: (error: any) => {
      toast.error('Import Failed', error.message || 'Failed to import CSV file');
    },
  });
};

export const useExportSubmissions = () => {
  return useMutation({
    mutationFn: (params: ExportSubmissionsParams) => submissionsApi.exportSubmissions(params),
    onSuccess: ({ blob, filename }) => {
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Success', 'Submissions exported successfully');
    },
    onError: (error: any) => {
      toast.error('Export Failed', error.message || 'Failed to export submissions');
    },
  });
};

export const useExportBasicXlsx = () => {
  return useMutation({
    mutationFn: (params: ExportSubmissionsParams) => submissionsApi.exportBasicXlsx(params),
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Success', 'XLSX exported successfully');
    },
    onError: (error: any) => {
      toast.error('Export Failed', error.message || 'Failed to export XLSX');
    },
  });
};

export const useExportPdf = () => {
  return useMutation({
    mutationFn: (params: ExportSubmissionsParams) => submissionsApi.exportPdf(params),
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
