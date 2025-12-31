// src/features/submissions-lite/index.tsx
import { useState, useMemo } from "react";
import { Loader2, Layers, FileDown } from "lucide-react";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createInstitutionSubmissionColumns } from "./config/columns";
import { getInstitutionSubmissionFilters } from "./config/filters";
import { InstitutionStats } from "./components/institution-stats";
import { InstitutionSubmissionViewModal } from "./components/institution-submission-view-modal";
import { Submission } from "./data/schema";
import { useInstitutionSubmissions, useInstitutionDashboard, useInstitutionExportPdf } from "@/api/hooks/institution";
import { useRoleGuard } from "@/guards/useRoleGuard";
import { Button } from "@/components/ui/button";

export default function InstitutionSubmissions() {
  const { isLoading: guardLoading, isAllowed } = useRoleGuard(['institution']);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Table state
  const tableState = useTableState<Submission>({ debounceMs: 300 });

  // Extract filter values
  const phaseFilter = tableState.state.filters.find(f => f.id === 'phaseName');
  const phaseValue = phaseFilter?.value;
  let phaseId = Array.isArray(phaseValue) ? phaseValue.join(',') : phaseValue;

  // Handle "no-phase" - backend endpoint needs to support this
  // For now, send it as-is and let backend handle it
  // If backend doesn't support it, it should be updated to match super admin endpoint

  const statusFilter = tableState.state.filters.find(f => f.id === 'status');
  const statusValue = statusFilter?.value;
  const status = Array.isArray(statusValue) ? statusValue.join(',') : statusValue;

  // Fetch submissions from API
  const { data: submissionsData, isLoading, error } = useInstitutionSubmissions({
    page: tableState.state.pagination.pageIndex + 1,
    pageSize: tableState.state.pagination.pageSize,
    search: tableState.state.search || undefined,
    status: (status as "pending" | "submitted" | "expired" | undefined) || undefined,
    phaseId: (phaseId as string) || undefined,
    sortBy: tableState.state.sorting[0]?.id || 'createdAt',
    sortOrder: tableState.state.sorting[0]?.desc ? 'desc' : 'asc',
  });

  // Fetch dashboard data to get phases
  const { data: dashboardData, isLoading: dashboardLoading } = useInstitutionDashboard();

  // PDF export (uses institution token, no institutionId needed)
  const exportPdf = useInstitutionExportPdf();

  // Build phase options from dashboard data
  const phaseOptions = useMemo(() => {
    const phases = dashboardData?.data?.phases || [];
    const options = phases.map((phase: any) => ({
      value: phase.id!.toString(),
      label: phase.name || '',
      icon: Layers,
    }));
    return [
      { value: "no-phase", label: "No Phase Assigned", icon: Layers },
      ...options,
    ];
  }, [dashboardData]);

  // Build filters with phase options
  const filters = useMemo(() => getInstitutionSubmissionFilters({ phaseOptions }), [phaseOptions]);

  // Action handlers
  const handleView = (submission: Submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleExportPdf = () => {
    exportPdf.mutate(undefined);
  };

  // Columns - must be before early returns to satisfy hooks rules
  const columns = useMemo(() => createInstitutionSubmissionColumns(handleView), []);

  // Show loading while checking auth or fetching data
  if (guardLoading || isLoading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  // Show error if failed to load
  if (error || !submissionsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg">⚠️ Error</div>
          <p className="text-muted-foreground">
            Unable to load submissions. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Don't render if role guard blocks access
  if (!isAllowed) {
    return null;
  }

  const submissionList = submissionsData.data.submissions as unknown as Submission[];

  // Enrich submissions with phase names from dashboard data
  // Backend returns phaseId but phaseName is null, so we map it from dashboard phases
  const phases = dashboardData?.data?.phases || [];
  const enrichedSubmissions = submissionList.map(submission => {
    if (submission.phaseId && !submission.phaseName) {
      const phase = phases.find((p: any) => p.id === submission.phaseId);
      return {
        ...submission,
        phaseName: phase?.name || null,
      };
    }
    return submission;
  });

  return (
    <div className="space-y-8">
      {/* Header with Stats and Actions */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <InstitutionStats submissions={enrichedSubmissions} />
          <Button
            variant="outline"
            onClick={handleExportPdf}
            disabled={exportPdf.isPending}
          >
            <FileDown className="h-4 w-4 mr-2" />
            {exportPdf.isPending ? "Exporting..." : "Download as PDF"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={enrichedSubmissions}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search by name, ID number, or login code...",
            columnKey: "personName",
          },
          filters: filters,
          pagination: {
            enabled: true,
            defaultPageSize: 15,
          },
          selection: { enabled: false },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "createdAt", desc: true },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No submissions found for your institution.",
          state: {
            sorting: tableState.state.sorting,
            columnFilters: tableState.state.filters,
            pagination: tableState.state.pagination,
          },
        }}
        callbacks={{
          onSearch: tableState.updateSearch,
          onFiltersChange: tableState.updateFilters,
          onSortingChange: tableState.updateSorting,
          onRowSelectionChange: tableState.updateSelection,
          onPaginationChange: tableState.updatePagination,
        }}
      />

      {/* View Dialog */}
      {selectedSubmission && (
        <InstitutionSubmissionViewModal
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          submission={selectedSubmission}
        />
      )}
    </div>
  );
}
