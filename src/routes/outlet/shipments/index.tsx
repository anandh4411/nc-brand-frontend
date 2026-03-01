import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Truck, Package, Clock, CheckCircle2, Eye } from "lucide-react";
import { useOutletShipments } from "@/api/hooks/outlet";
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
  const [selectedShipment, setSelectedShipment] =
    useState<OutletShipment | null>(null);

  const { data: shipmentsResponse, isLoading } = useOutletShipments();

  const shipments = (
    Array.isArray((shipmentsResponse?.data as any))
      ? (shipmentsResponse?.data as any)
      : (shipmentsResponse?.data as any)?.shipments || []
  ) as OutletShipment[];

  const handleView = (shipment: OutletShipment) => {
    setSelectedShipment(shipment);
    setViewDialogOpen(true);
  };

  const columns = useMemo(
    (): ColumnDef<OutletShipment>[] => [
      {
        id: "shipmentNumber",
        accessorFn: (row) => `SHP-${String(row.id).padStart(4, "0")}`,
        header: "Shipment #",
        cell: ({ getValue }) => (
          <span className="font-mono font-medium">{getValue() as string}</span>
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
        <DialogContent className="max-w-2xl">
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
                            <p className="text-xs text-muted-foreground mt-1">
                              Received: {item.receivedQuantity}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
