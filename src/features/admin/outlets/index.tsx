// src/features/admin/outlets/index.tsx
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createOutletColumns } from "./config/columns";
import { OutletFormModal } from "./components/outlet-form-modal";
import { OutletDeleteDialog } from "./components/outlet-delete-dialog";
import { OutletViewModal } from "./components/outlet-view-modal";
import { mockOutlets } from "./data/mock-data";
import type { Outlet } from "@/types/dto/outlet.dto";

export default function Outlets() {
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);

  // Table state
  const tableState = useTableState<Outlet>({ debounceMs: 300 });

  // Using mock data for now - will be replaced with API
  const outletList = mockOutlets;

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

  // Columns
  const columns = useMemo(
    () => createOutletColumns(handleView, handleEdit, handleDelete),
    []
  );

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
          />
        </>
      )}
    </div>
  );
}
