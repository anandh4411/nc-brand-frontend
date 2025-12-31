// Submissions DTOs
export type SubmissionData = {
  id?: number;
  uuid?: string;
  institutionId?: number;
  institutionName?: string;
  personName?: string;
  category?: string;
  idNumber?: string;
  class?: string | null; // Student's class/grade (e.g., "10th Grade", "Class 5A")
  loginCode?: string;
  status?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  phaseId?: number;
  phaseName?: string;
  addedToPhaseAt?: string;
  importedData?: any;
  formData?: any;
  imageUrl?: string;
};

export type CreateSubmissionRequest = {
  institutionId: number;
  personName: string;
  category?: string;
  idNumber?: string;
  class?: string; // Student's class/grade
  loginCode?: string;
  status?: string;
  phaseId?: number;
  importedData?: any;
  formData?: any;
  imageUrl?: File | string;
};

export type UpdateSubmissionRequest = Partial<CreateSubmissionRequest>;

export type GetSubmissionsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  institutionId?: string; // Comma-separated IDs for multiple filters
  phaseId?: string; // Comma-separated IDs for multiple filters
  status?: string; // Comma-separated values for multiple filters
};

// Bulk CSV Import Types
export type BulkImportErrorDetail = {
  row: number;
  personName?: string;
  idNumber?: string;
  reason: string;
};

export type BulkImportWarningType = 'NO_FORM' | 'UNMATCHED_FIELDS' | 'DUPLICATE_IDS';

export type DuplicateAction = 'skip' | 'replace';

export type BulkImportWarning = {
  type: BulkImportWarningType;
  message: string;
  unmatchedColumns?: string[];
  requiresForce?: boolean;
  // Duplicate handling fields
  duplicateCount?: number;
  newCount?: number;
  requiresDuplicateAction?: boolean;
};

export type BulkImportResult = {
  totalRows: number;
  successCount: number;
  failedCount: number;
  errors: BulkImportErrorDetail[];
  warning?: BulkImportWarning;
};

export type BulkImportCSVRequest = {
  institutionId: number;
  file: File;
  force?: boolean;
  duplicateAction?: DuplicateAction;
};

// Export Submissions Types
export type ExportSubmissionsParams = {
  institutionId: number;
  phaseId?: number;
};
