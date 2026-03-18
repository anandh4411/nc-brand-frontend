// src/features/admin/outlets/index.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createOutletColumns } from "./config/columns";
import { OutletFormModal } from "./components/outlet-form-modal";
import { OutletDeleteDialog } from "./components/outlet-delete-dialog";
import { OutletViewModal } from "./components/outlet-view-modal";
import { useAdminOutlets, useDeleteOutlet } from "@/api/hooks/admin";
import type { Outlet } from "@/types/dto/outlet.dto";
import { toast } from "sonner";

export default function Outlets() {
  const navigate = useNavigate();

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);

  // Table state
  const tableState = useTableState<Outlet>({ debounceMs: 300 });

  // Build query params from table state
  const queryParams = useMemo(() => ({
    page: tableState.state.pagination.pageIndex + 1,
    pageSize: tableState.state.pagination.pageSize,
    search: tableState.state.search || undefined,
  }), [tableState.state.pagination, tableState.state.search]);

  // API Hooks
  const { data: outletsResponse, isLoading } = useAdminOutlets(queryParams);
  const deleteOutlet = useDeleteOutlet();

  // Get data from API
  const outletList = ((outletsResponse?.data as any)?.outlets || outletsResponse?.data || []) as Outlet[];
  const pagination = (outletsResponse?.data as any)?.meta || (outletsResponse?.data as any)?.pagination;

  // Action handlers
  const handleView = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setViewDialogOpen(true);
  };

  const handleEdit = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setEditDialogOpen(true);
  };

  const handleDelete = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedOutlet) return;
    deleteOutlet.mutate(selectedOutlet.uuid, {
      onSuccess: () => {
        toast.success("Outlet deleted");
        setDeleteDialogOpen(false);
        setSelectedOutlet(null);
      },
      onError: () => {
        toast.error("Failed to delete outlet");
      },
    });
  };

  const handleViewProfile = (outlet: Outlet) => {
    navigate({ to: "/admin/outlets/$outletId", params: { outletId: outlet.uuid } });
  };

  // Columns
  const columns = useMemo(
    () => createOutletColumns(handleView, handleEdit, handleDelete, handleViewProfile),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            Outlets
          </h1>
          <p className="text-muted-foreground">
            Manage outlet locations and their settings.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add Outlet
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={outletList}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search outlets...",
            columnKey: "name",
          },
          pagination: {
            enabled: true,
            defaultPageSize: 10,
          },
          selection: { enabled: true },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "createdAt", desc: true },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No outlets found.",
          state: {
            sorting: tableState.state.sorting,
            columnFilters: tableState.state.filters,
            pagination: tableState.state.pagination,
          },
          pageCount: pagination?.totalPages ?? -1,
          filters: [
            {
              columnKey: "isActive",
              title: "Status",
              options: [
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ],
            },
          ],
        }}
        callbacks={{
          onSearch: tableState.updateSearch,
          onFiltersChange: tableState.updateFilters,
          onSortingChange: tableState.updateSorting,
          onRowSelectionChange: tableState.updateSelection,
          onPaginationChange: tableState.updatePagination,
        }}
      />

      {/* Dialogs */}
      <OutletFormModal
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        mode="add"
      />

      {selectedOutlet && (
        <>
          <OutletViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            outlet={selectedOutlet}
          />

          <OutletFormModal
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            outlet={selectedOutlet}
            mode="edit"
          />

          <OutletDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            outlet={selectedOutlet}
            onConfirm={handleConfirmDelete}
            isDeleting={deleteOutlet.isPending}
          />
        </>
      )}
    </div>
  );
}
