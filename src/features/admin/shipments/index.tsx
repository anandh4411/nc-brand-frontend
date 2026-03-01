// src/features/admin/shipments/index.tsx
import { useState, useMemo } from "react";
import { Plus, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createShipmentColumns } from "./config/columns";
import { ShipmentFormModal } from "./components/shipment-form-modal";
import { ShipmentViewModal } from "./components/shipment-view-modal";
import { useAdminShipments, useUpdateShipmentStatus } from "@/api/hooks/admin";
import type { Shipment } from "@/types/dto/inventory.dto";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

const shipmentStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function Shipments() {
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [pendingAction, setPendingAction] = useState<"ship" | "deliver" | "cancel" | null>(null);

  // Table state
  const tableState = useTableState<Shipment>({ debounceMs: 300 });

  // API Hooks
  const { data: shipmentsResponse, isLoading } = useAdminShipments();
  const updateStatus = useUpdateShipmentStatus();

  // Get data from API
  const shipmentList = ((shipmentsResponse?.data as any)?.shipments || shipmentsResponse?.data || []) as Shipment[];

  // Action handlers
  const handleView = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setViewDialogOpen(true);
  };

  const handleShip = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setPendingAction("ship");
    setActionDialogOpen(true);
  };

  const handleDeliver = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setPendingAction("deliver");
    setActionDialogOpen(true);
  };

  const handleCancel = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setPendingAction("cancel");
    setActionDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedShipment || !pendingAction) return;

    const statusMap = {
      ship: "SHIPPED",
      deliver: "DELIVERED",
      cancel: "CANCELLED",
    };

    updateStatus.mutate(
      { uuid: selectedShipment.uuid, status: statusMap[pendingAction] },
      {
        onSuccess: () => {
          const messages = {
            ship: "Shipment marked as shipped",
            deliver: "Shipment marked as delivered",
            cancel: "Shipment cancelled",
          };
          toast.success(messages[pendingAction]);
          setActionDialogOpen(false);
          setPendingAction(null);
          setSelectedShipment(null);
        },
        onError: () => {
          toast.error("Failed to update shipment status");
        },
      }
    );
  };

  // Columns
  const columns = useMemo(
    () => createShipmentColumns(handleView),
    []
  );

  const actionTitles = {
    ship: "Mark as Shipped",
    deliver: "Mark as Delivered",
    cancel: "Cancel Shipment",
  };

  const actionDescriptions = {
    ship: `Are you sure you want to mark this shipment as shipped?`,
    deliver: `Are you sure you want to mark this shipment as delivered? This will update the outlet's inventory.`,
    cancel: `Are you sure you want to cancel this shipment? This action cannot be undone.`,
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
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
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Shipments
          </h1>
          <p className="text-muted-foreground">
            Manage inventory shipments to outlets.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Create Shipment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {shipmentStatusOptions.map((status) => {
          const count = shipmentList.filter((s: any) => s.status?.toUpperCase() === status.value).length;
          return (
            <div
              key={status.value}
              className="p-4 border rounded-lg text-center"
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-muted-foreground">{status.label}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <DataTable
        data={shipmentList}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search by outlet name...",
            columnKey: "outletName",
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
          emptyStateMessage: "No shipments found.",
          filters: [
            {
              columnKey: "status",
              title: "Status",
              options: shipmentStatusOptions,
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
      <ShipmentFormModal open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      {selectedShipment && (
        <ShipmentViewModal
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          shipment={selectedShipment}
        />
      )}

      {/* Action Confirmation Dialog */}
      <ConfirmDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        handleConfirm={confirmAction}
        title={pendingAction ? actionTitles[pendingAction] : "Confirm"}
        desc={pendingAction ? actionDescriptions[pendingAction] : ""}
        confirmText={pendingAction === "cancel" ? "Cancel Shipment" : "Confirm"}
        destructive={pendingAction === "cancel"}
        disabled={updateStatus.isPending}
      />
    </div>
  );
}
