// src/features/submissions/index.tsx
import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Download,
  Upload,
  Loader2,
  Building2,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import { useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createSubmissionColumns } from "./config/columns";
import { getSubmissionFilters } from "./config/filters";
import { SubmissionViewModal } from "./components/submission-view-modal";
import { SubmissionDeleteDialog } from "./components/submission-delete-dialog";
import { SubmissionManualAddDialog } from "./components/submission-manual-add-dialog";
import { SubmissionImportDialog } from "./components/submission-import-dialog";
import { SubmissionExportDialog } from "./components/submission-export-dialog";
import { SubmissionExportXlsxDialog } from "./components/submission-export-xlsx-dialog";
import { SubmissionAddToPhaseDialog } from "./components/submission-add-to-phase-dialog";
import { useSubmissions } from "@/api/hooks/submissions";
import { useInstitutions } from "@/api/hooks/institutions";
import { usePhases } from "@/api/hooks/phases";
import { SubmissionData } from "@/types/dto/submission.dto";

export default function Submissions() {
  // Get URL search params (from phase navigation)
  const searchParams = useSearch({ strict: false }) as {
    institutionId?: string;
    phaseId?: string;
  };

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manualAddDialogOpen, setManualAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportXlsxDialogOpen, setExportXlsxDialogOpen] = useState(false);
  const [addToPhaseDialogOpen, setAddToPhaseDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionData | null>(null);
  const [bulkSelectedSubmissions, setBulkSelectedSubmissions] = useState<
    SubmissionData[]
  >([]);

  // Filter search states
  const [institutionSearch, setInstitutionSearch] = useState("");
  const [phaseSearch, setPhaseSearch] = useState("");

  // Table state
  const tableState = useTableState<SubmissionData>({ debounceMs: 300 });

  // Apply URL search params as initial filters
  useEffect(() => {
    if (searchParams.institutionId || searchParams.phaseId) {
      const filters = [];

      if (searchParams.institutionId) {
        filters.push({
          id: "institutionName",
          value: [searchParams.institutionId],
        });
      }

      if (searchParams.phaseId) {
        filters.push({
          id: "phaseName",
          value: [searchParams.phaseId],
        });
      }

      tableState.updateFilters(filters);
    }
  }, [searchParams.institutionId, searchParams.phaseId]);

  // Extract filter values from table state
  const selectedInstitutionIds = useMemo(() => {
    const institutionFilter = tableState.state.filters.find(
      (f) => f.id === "institutionName"
    );
    return institutionFilter?.value as string[] | undefined;
  }, [tableState.state.filters]);

  const selectedPhaseIds = useMemo(() => {
    const phaseFilter = tableState.state.filters.find(
      (f) => f.id === "phaseName"
    );
    return phaseFilter?.value as string[] | undefined;
  }, [tableState.state.filters]);

  const selectedStatus = useMemo(() => {
    const statusFilter = tableState.state.filters.find(
      (f) => f.id === "status"
    );
    return statusFilter?.value as string[] | undefined;
  }, [tableState.state.filters]);

  // Fetch institutions for filter
  const { data: institutionsData } = useInstitutions({
    search: institutionSearch || undefined,
    pageSize: 100,
  });

  // Fetch phases for filter (conditional on institution selection)
  const phaseQueryParams = useMemo(
    () => ({
      institutionId: selectedInstitutionIds?.join(",") || undefined,
      search: phaseSearch || undefined,
      pageSize: 100,
    }),
    [selectedInstitutionIds, phaseSearch]
  );

  const { data: phasesData } = usePhases(phaseQueryParams);

  // Build filter options
  const institutionOptions = useMemo(() => {
    const institutions = institutionsData?.data?.institutions || [];
    return institutions.map((inst: any) => ({
      value: inst.id!.toString(),
      label: inst.name || "",
      icon: Building2,
    }));
  }, [institutionsData]);

  const phaseOptions = useMemo(() => {
    const phases = phasesData?.data?.phases || [];
    const options = phases.map((phase: any) => ({
      value: phase.id!.toString(),
      label: phase.name || "",
      icon: Layers,
    }));

    // Add "No Phase Assigned" option
    if (!selectedInstitutionIds || selectedInstitutionIds.length === 0) {
      return [];
    }

    return [
      { value: "no-phase", label: "No Phase Assigned", icon: Layers },
      ...options,
    ];
  }, [phasesData, selectedInstitutionIds]);

  // Build submission API query params
  const queryParams = useMemo(
    () => ({
      page: tableState.state.pagination.pageIndex + 1,
      pageSize: tableState.state.pagination.pageSize,
      search: tableState.state.search || undefined,
      sortBy: tableState.state.sorting[0]?.id || "createdAt",
      sortOrder: (tableState.state.sorting[0]?.desc ? "desc" : "asc") as
        | "asc"
        | "desc",
      status: selectedStatus?.join(",") || undefined,
      institutionId: selectedInstitutionIds?.join(",") || undefined,
      phaseId: selectedPhaseIds?.join(",") || undefined,
    }),
    [
      tableState.state.pagination.pageIndex,
      tableState.state.pagination.pageSize,
      tableState.state.search,
      tableState.state.sorting,
      selectedStatus,
      selectedInstitutionIds,
      selectedPhaseIds,
    ]
  );

  // Fetch submissions data
  const { data, isLoading, isFetching, error } = useSubmissions(queryParams);
  const responseData = data?.data as
    | { submissions: SubmissionData[]; pagination: any }
    | undefined;
  const submissionList = responseData?.submissions || [];
  const pagination = responseData?.pagination;

  // Enrich submissions with phase names from phases data
  // Backend returns phaseId but phaseName is null, so we map it from phases
  const phases = phasesData?.data?.phases || [];
  const enrichedSubmissions = submissionList.map((submission) => {
    if (submission.phaseId && !submission.phaseName) {
      const phase = phases.find((p: any) => p.id === submission.phaseId);
      return {
        ...submission,
        phaseName: phase?.name || null,
      };
    }
    return submission;
  });

  // Action handlers
  const handleView = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  // const handleDownloadImage = (submission: SubmissionData) => {
  //   // TODO: API call to download image
  //   console.log("Download image for:", submission.id);
  // };

  const handleDelete = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
    setDeleteDialogOpen(true);
  };

  const handleBulkAddToPhase = () => {
    const selected = tableState.state.selection;
    if (selected.length === 0) return;

    // Validate: all submissions must belong to same institution
    const institutionIds = new Set(selected.map((s) => s.institutionId));
    if (institutionIds.size > 1) {
      // Show error toast
      console.error(
        "Selection contains submissions from multiple institutions"
      );
      // TODO: Replace with actual toast notification
      alert(
        "Selection contains submissions from multiple institutions. Please choose submissions from a single institution."
      );
      return;
    }

    setBulkSelectedSubmissions(selected);
    setAddToPhaseDialogOpen(true);
  };

  // Columns
  const columns = useMemo(
    () =>
      createSubmissionColumns(handleView, handleDelete),
    []
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            Submissions
          </h1>
          <p className="text-muted-foreground">
            View and manage all ID card submissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            className="h-9"
          >
            <Download className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExportDialogOpen(true)}
            className="h-9"
          >
            <Upload className="mr-2 h-4 w-4" />
            Export Zip
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExportXlsxDialogOpen(true)}
            className="h-9"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export XLSX
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkAddToPhase}
            disabled={tableState.state.selection.length === 0}
            className="h-9"
          >
            <Layers className="mr-2 h-4 w-4" />
            Add to Phase
            {tableState.state.selection.length > 0 && (
              <span className="ml-1.5 text-xs">
                ({tableState.state.selection.length})
              </span>
            )}
          </Button>
          <Button
            size="sm"
            onClick={() => setManualAddDialogOpen(true)}
            className="h-9"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Submission
          </Button>
        </div>
      </div>

      {/* Loading/Error States */}
      {isLoading && !data ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">
              Failed to load submissions
            </p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {isFetching && (
            <div className="absolute top-2 right-2 z-10">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          <DataTable
            data={enrichedSubmissions}
            columns={columns}
            config={{
              search: {
                enabled: true,
                placeholder: "Search submissions...",
                columnKey: "personName",
              },
              filters: getSubmissionFilters({
                institutionOptions,
                phaseOptions,
              }),
              pagination: {
                enabled: true,
                defaultPageSize: 10,
              },
              selection: { enabled: true },
              sorting: {
                enabled: true,
                defaultSort: { columnKey: "submittedAt", desc: true },
              },
              viewOptions: { enabled: true },
              emptyStateMessage: "No submissions found.",
              state: {
                sorting: tableState.state.sorting,
                columnFilters: tableState.state.filters,
                pagination: tableState.state.pagination,
              },
              pageCount: pagination?.totalPages ?? -1,
            }}
            callbacks={{
              onSearch: tableState.updateSearch,
              onFiltersChange: tableState.updateFilters,
              onSortingChange: tableState.updateSorting,
              onRowSelectionChange: tableState.updateSelection,
              onPaginationChange: tableState.updatePagination,
            }}
          />
        </div>
      )}

      {/* Dialogs */}
      <SubmissionManualAddDialog
        open={manualAddDialogOpen}
        onOpenChange={setManualAddDialogOpen}
      />

      <SubmissionImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />

      <SubmissionExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />

      <SubmissionExportXlsxDialog
        open={exportXlsxDialogOpen}
        onOpenChange={setExportXlsxDialogOpen}
      />

      <SubmissionAddToPhaseDialog
        open={addToPhaseDialogOpen}
        onOpenChange={setAddToPhaseDialogOpen}
        submissions={bulkSelectedSubmissions}
      />

      {selectedSubmission && (
        <>
          <SubmissionViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            submission={selectedSubmission}
          />

          <SubmissionDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            currentRow={selectedSubmission}
          />
        </>
      )}
    </div>
  );
}
