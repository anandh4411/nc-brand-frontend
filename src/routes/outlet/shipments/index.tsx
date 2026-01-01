import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Truck,
  Package,
  Clock,
  CheckCircle2,
  Eye,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";

// Types
interface ShipmentItem {
  sku: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
}

interface Shipment {
  id: string;
  shipmentNumber: string;
  dispatchDate: string;
  expectedDate: string;
  receivedDate?: string;
  status: "processing" | "dispatched" | "in_transit" | "delivered" | "received";
  items: ShipmentItem[];
  totalItems: number;
  notes?: string;
}

// Mock shipments data
const shipmentsData: Shipment[] = [
  {
    id: "1",
    shipmentNumber: "SHP-2024-001",
    dispatchDate: "2024-12-28",
    expectedDate: "2024-12-31",
    status: "in_transit",
    totalItems: 45,
    items: [
      { sku: "BSS-001-RB", name: "Banarasi Silk Saree", color: "Royal Blue", size: "Free Size", quantity: 10 },
      { sku: "CCK-023-MR", name: "Cotton Casual Kurti", color: "Maroon", size: "M", quantity: 15 },
      { sku: "CPS-045-PK", name: "Chiffon Printed Saree", color: "Pink", size: "Free Size", quantity: 20 },
    ],
    notes: "Urgent restock for low stock items",
  },
  {
    id: "2",
    shipmentNumber: "SHP-2024-002",
    dispatchDate: "2024-12-27",
    expectedDate: "2024-12-30",
    status: "dispatched",
    totalItems: 32,
    items: [
      { sku: "BLS-012-GD", name: "Bridal Lehenga Set", color: "Gold", size: "L", quantity: 5 },
      { sku: "TSS-034-GR", name: "Tussar Silk Saree", color: "Green", size: "Free Size", quantity: 12 },
      { sku: "CDM-056-WH", name: "Cotton Dress Material", color: "White", size: "Unstitched", quantity: 15 },
    ],
  },
  {
    id: "3",
    shipmentNumber: "SHP-2024-003",
    dispatchDate: "2024-12-26",
    expectedDate: "2024-12-29",
    status: "processing",
    totalItems: 28,
    items: [
      { sku: "PKS-078-RD", name: "Pattu Kanchipuram Saree", color: "Red", size: "Free Size", quantity: 8 },
      { sku: "EKR-089-NV", name: "Embroidered Kurti", color: "Navy", size: "XL", quantity: 20 },
    ],
  },
  {
    id: "4",
    shipmentNumber: "SHP-2024-004",
    dispatchDate: "2024-12-20",
    expectedDate: "2024-12-23",
    receivedDate: "2024-12-23",
    status: "received",
    totalItems: 50,
    items: [
      { sku: "BSS-001-MR", name: "Banarasi Silk Saree", color: "Maroon", size: "Free Size", quantity: 25 },
      { sku: "CCK-023-BL", name: "Cotton Casual Kurti", color: "Blue", size: "L", quantity: 25 },
    ],
  },
  {
    id: "5",
    shipmentNumber: "SHP-2024-005",
    dispatchDate: "2024-12-15",
    expectedDate: "2024-12-18",
    receivedDate: "2024-12-18",
    status: "received",
    totalItems: 60,
    items: [
      { sku: "SSS-101-YL", name: "Soft Silk Saree", color: "Yellow", size: "Free Size", quantity: 30 },
      { sku: "PKR-112-PR", name: "Party Kurti", color: "Purple", size: "S", quantity: 30 },
    ],
  },
];

function OutletShipments() {
  const tableState = useTableState<Shipment>({ debounceMs: 300 });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return <Badge className="bg-green-500 hover:bg-green-600">Received</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Transit</Badge>;
      case "dispatched":
        return <Badge variant="secondary">Dispatched</Badge>;
      case "processing":
        return <Badge variant="outline">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleView = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setViewDialogOpen(true);
  };

  const handleReceive = (shipment: Shipment) => {
    toast.success(`Shipment ${shipment.shipmentNumber} marked as received!`);
  };

  const columns = useMemo((): ColumnDef<Shipment>[] => [
    {
      id: "slNo",
      header: "Sl No",
      cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
    },

    customColumn<Shipment>(
      "shipmentNumber",
      "Shipment #",
      (value) => <span className="font-mono font-medium">{value}</span>,
      { sortable: true }
    ),

    customColumn<Shipment>(
      "dispatchDate",
      "Dispatch Date",
      (value) => formatDate(value),
      { sortable: true }
    ),

    customColumn<Shipment>(
      "expectedDate",
      "Expected Date",
      (value) => formatDate(value),
      { sortable: true }
    ),

    customColumn<Shipment>(
      "totalItems",
      "Items",
      (value) => (
        <div className="flex items-center gap-1">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
      { sortable: true }
    ),

    customColumn<Shipment>(
      "status",
      "Status",
      (value) => getStatusBadge(value),
      { filterable: true }
    ),

    actionsColumn<Shipment>([
      { label: "View Details", icon: Eye, onClick: handleView },
      {
        label: "Mark as Received",
        icon: PackageCheck,
        onClick: handleReceive,
        disabled: (row) => row.status === "received" || row.status === "processing",
      },
    ]),
  ], []);

  // Stats calculations
  const pendingCount = shipmentsData.filter(
    (s) => s.status === "in_transit" || s.status === "dispatched"
  ).length;
  const processingCount = shipmentsData.filter((s) => s.status === "processing").length;
  const receivedCount = shipmentsData.filter((s) => s.status === "received").length;
  const totalItems = shipmentsData
    .filter((s) => s.status !== "received")
    .reduce((sum, s) => sum + s.totalItems, 0);

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
              In Transit
            </CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Shipments on the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Processing
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{processingCount}</div>
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
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Items incoming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Received
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{receivedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={shipmentsData}
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
            defaultSort: { columnKey: "dispatchDate", desc: true },
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
                    {selectedShipment.shipmentNumber}
                  </DialogTitle>
                  {getStatusBadge(selectedShipment.status)}
                </div>
                <DialogDescription>
                  Dispatched on {formatDate(selectedShipment.dispatchDate)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Expected Date</p>
                    <p className="font-medium">{formatDate(selectedShipment.expectedDate)}</p>
                  </div>
                  {selectedShipment.receivedDate && (
                    <div>
                      <p className="text-muted-foreground">Received Date</p>
                      <p className="font-medium">{formatDate(selectedShipment.receivedDate)}</p>
                    </div>
                  )}
                </div>

                {selectedShipment.notes && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Notes</p>
                    <p>{selectedShipment.notes}</p>
                  </div>
                )}

                <Separator />

                {/* Items */}
                <div>
                  <h4 className="font-semibold mb-3">
                    Items ({selectedShipment.totalItems} total)
                  </h4>
                  <div className="space-y-2">
                    {selectedShipment.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.sku} • {item.color} / {item.size}
                          </p>
                        </div>
                        <Badge variant="secondary">×{item.quantity}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedShipment.status !== "received" && (
                  <>
                    <Separator />
                    <div className="flex justify-end">
                      <Button onClick={() => {
                        handleReceive(selectedShipment);
                        setViewDialogOpen(false);
                      }}>
                        <PackageCheck className="h-4 w-4 mr-2" />
                        Mark as Received
                      </Button>
                    </div>
                  </>
                )}
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
