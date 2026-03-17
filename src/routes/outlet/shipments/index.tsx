import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";
import {
  DataTable,
  useTableState,
  customColumn,
  actionsColumn,
} from "@/components/elements/app-data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  Package,
  Clock,
  CheckCircle2,
  Eye,
  PackageCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useOutletShipments, useReceiveShipment } from "@/api/hooks/outlet";
import type { OutletShipment } from "@/api/endpoints/outlet";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>
      );
    case "PARTIALLY_RECEIVED":
      return (
        <Badge className="bg-teal-500 hover:bg-teal-600">
          Partially Received
        </Badge>
      );
    case "SHIPPED":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">Shipped</Badge>
      );
    case "PENDING":
      return <Badge variant="outline">Pending</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  return format(new Date(dateStr), "MMM dd, yyyy");
};

function OutletShipments() {
  const tableState = useTableState<OutletShipment>({ debounceMs: 300 });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState<OutletShipment | null>(null);

  // Receive quantities state: { itemUuid: receivedQuantity }
  const [receiveQuantities, setReceiveQuantities] = useState<
    Record<string, number>
  >({});

  const { data: shipmentsResponse, isLoading } = useOutletShipments();
  const receiveShipment = useReceiveShipment();

  const shipments = (
    Array.isArray(shipmentsResponse?.data as any)
      ? (shipmentsResponse?.data as any)
      : (shipmentsResponse?.data as any)?.shipments || []
  ) as OutletShipment[];

  const handleView = (shipment: OutletShipment) => {
    setSelectedShipment(shipment);
    setViewDialogOpen(true);
  };

  const handleReceiveOpen = (shipment: OutletShipment) => {
    setSelectedShipment(shipment);
    // Pre-fill with remaining quantities (expected - already received)
    const quantities: Record<string, number> = {};
    shipment.items.forEach((item) => {
      const remaining = item.quantity - (item.receivedQuantity || 0);
      quantities[item.uuid] = remaining > 0 ? remaining : 0;
    });
    setReceiveQuantities(quantities);
    setReceiveDialogOpen(true);
  };

  const handleReceiveSubmit = () => {
    if (!selectedShipment) return;

    const items = selectedShipment.items
      .filter((item) => (receiveQuantities[item.uuid] || 0) > 0)
      .map((item) => ({
        itemUuid: item.uuid,
        receivedQuantity: receiveQuantities[item.uuid] || 0,
      }));

    if (items.length === 0) {
      toast.error("Please enter received quantities");
      return;
    }

    receiveShipment.mutate(
      { uuid: selectedShipment.uuid, items },
      {
        onSuccess: () => {
          toast.success("Shipment received successfully. Stock updated.");
          setReceiveDialogOpen(false);
          setSelectedShipment(null);
        },
        onError: () => {
          toast.error("Failed to receive shipment");
        },
      }
    );
  };

  const canReceive = (status: string) =>
    status === "SHIPPED" || status === "PARTIALLY_RECEIVED";

  const columns = useMemo(
    (): ColumnDef<OutletShipment>[] => [
      {
        id: "shipmentNumber",
        accessorFn: (row) => `SHP-${String(row.id).padStart(4, "0")}`,
        header: "Shipment #",
        cell: ({ getValue }) => (
          <span className="font-mono font-medium">
            {getValue() as string}
          </span>
        ),
      },

      customColumn<OutletShipment>(
        "createdAt",
        "Created",
        (value) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(value)}
          </span>
        ),
        { sortable: true }
      ),

      customColumn<OutletShipment>("shippedAt", "Shipped", (value) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(value)}
        </span>
      )),

      {
        id: "totalItems",
        accessorFn: (row) =>
          row.items.reduce((sum, i) => sum + i.quantity, 0),
        header: "Items",
        cell: ({ getValue, row: { original } }) => (
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{getValue() as number}</span>
            <span className="text-xs text-muted-foreground">
              ({original.items.length} SKUs)
            </span>
          </div>
        ),
      },

      customColumn<OutletShipment>(
        "status",
        "Status",
        (value) => getStatusBadge(value),
        { filterable: true }
      ),

      actionsColumn<OutletShipment>([
        { label: "View Details", icon: Eye, onClick: handleView },
        {
          label: "Receive Shipment",
          icon: PackageCheck,
          onClick: handleReceiveOpen,
          condition: (row) => canReceive(row.status),
        },
      ]),
    ],
    []
  );

  // Stats
  const shippedCount = shipments.filter((s) => s.status === "SHIPPED").length;
  const pendingCount = shipments.filter((s) => s.status === "PENDING").length;
  const deliveredCount = shipments.filter(
    (s) => s.status === "DELIVERED"
  ).length;
  const totalExpectedItems = shipments
    .filter((s) => s.status !== "DELIVERED" && s.status !== "CANCELLED")
    .reduce(
      (sum, s) => sum + s.items.reduce((iSum, i) => iSum + i.quantity, 0),
      0
    );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">
            Track incoming shipments from manufacturing unit
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shipments</h1>
        <p className="text-muted-foreground">
          Track incoming shipments from manufacturing unit
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Shipped
            </CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {shippedCount}
            </div>
            <p className="text-xs text-muted-foreground">On the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">Being prepared</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expected Items
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpectedItems}</div>
            <p className="text-xs text-muted-foreground">Items incoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Delivered
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {deliveredCount}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={shipments}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search shipments...",
            columnKey: "shipmentNumber",
          },
          pagination: {
            enabled: true,
            defaultPageSize: 10,
          },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "createdAt", desc: true },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No shipments found.",
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
          onPaginationChange: tableState.updatePagination,
        }}
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedShipment && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <DialogTitle className="font-mono">
                    SHP-{String(selectedShipment.id).padStart(4, "0")}
                  </DialogTitle>
                  {getStatusBadge(selectedShipment.status)}
                </div>
                <DialogDescription>
                  Created on {formatDate(selectedShipment.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Shipped</p>
                    <p className="font-medium">
                      {formatDate(selectedShipment.shippedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">
                      {selectedShipment.status.replace("_", " ").toLowerCase()}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Items */}
                <div>
                  <h4 className="font-semibold mb-3">
                    Items (
                    {selectedShipment.items.reduce(
                      (sum, i) => sum + i.quantity,
                      0
                    )}{" "}
                    total)
                  </h4>
                  <div className="space-y-2">
                    {selectedShipment.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.sku} &bull; {item.colorName} / {item.size}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">
                            &times;{item.quantity}
                          </Badge>
                          {item.receivedQuantity > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              Received: {item.receivedQuantity}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Receive button in view dialog */}
                {canReceive(selectedShipment.status) && (
                  <>
                    <Separator />
                    <Button
                      className="w-full"
                      onClick={() => {
                        setViewDialogOpen(false);
                        handleReceiveOpen(selectedShipment);
                      }}
                    >
                      <PackageCheck className="h-4 w-4 mr-2" />
                      Receive Shipment
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Receive Shipment Dialog */}
      <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedShipment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <PackageCheck className="h-5 w-5" />
                  Receive Shipment — SHP-
                  {String(selectedShipment.id).padStart(4, "0")}
                </DialogTitle>
                <DialogDescription>
                  Enter the quantity received for each item. Stock will be
                  updated automatically.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                {selectedShipment.items.map((item) => {
                  const remaining =
                    item.quantity - (item.receivedQuantity || 0);
                  const alreadyFullyReceived = remaining <= 0;

                  return (
                    <div
                      key={item.uuid}
                      className={`flex items-center gap-4 p-3 border rounded-lg ${alreadyFullyReceived ? "opacity-50" : ""}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.sku} &bull; {item.colorName} / {item.size}
                        </p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span>Expected: {item.quantity}</span>
                          {item.receivedQuantity > 0 && (
                            <span className="text-green-600">
                              Already received: {item.receivedQuantity}
                            </span>
                          )}
                          <span>Remaining: {Math.max(0, remaining)}</span>
                        </div>
                      </div>
                      <div className="w-24 shrink-0">
                        <Input
                          type="number"
                          min={0}
                          max={remaining}
                          disabled={alreadyFullyReceived}
                          value={receiveQuantities[item.uuid] ?? 0}
                          onChange={(e) => {
                            const val = Math.min(
                              Math.max(0, parseInt(e.target.value) || 0),
                              remaining
                            );
                            setReceiveQuantities((prev) => ({
                              ...prev,
                              [item.uuid]: val,
                            }));
                          }}
                          className="text-center"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setReceiveDialogOpen(false)}
                  disabled={receiveShipment.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReceiveSubmit}
                  disabled={receiveShipment.isPending}
                >
                  {receiveShipment.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <PackageCheck className="h-4 w-4 mr-2" />
                      Confirm Receipt
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute("/outlet/shipments/")({
  component: OutletShipments,
});
