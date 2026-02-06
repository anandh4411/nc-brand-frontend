// src/features/admin/orders/index.tsx
import { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { createOrderColumns } from "./config/columns";
import { OrderViewModal } from "./components/order-view-modal";
import { OrderStatusModal } from "./components/order-status-modal";
import { useAdminOrders } from "@/api/hooks/admin";
import type { Order } from "@/types/dto/order.dto";

const orderStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const paymentStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Paid", value: "PAID" },
  { label: "Failed", value: "FAILED" },
  { label: "Refunded", value: "REFUNDED" },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function Orders() {
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Table state
  const tableState = useTableState<Order>({ debounceMs: 300 });

  // API Hook
  const { data: ordersResponse, isLoading } = useAdminOrders();

  // Get orders from API
  const orderList = ((ordersResponse?.data as any)?.orders || ordersResponse?.data || []) as Order[];

  // Stats
  const totalRevenue = orderList
    .filter((o: any) => o.paymentStatus?.toLowerCase() === "paid")
    .reduce((acc: number, o: any) => acc + (o.total || 0), 0);

  const pendingOrders = orderList.filter((o: any) =>
    o.status?.toLowerCase() === "pending"
  ).length;

  const processingOrders = orderList.filter((o: any) =>
    ["confirmed", "processing", "shipped"].includes(o.status?.toLowerCase())
  ).length;

  // Action handlers
  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
  };

  // Columns
  const columns = useMemo(
    () => createOrderColumns(handleView, handleUpdateStatus),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
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
            Orders
          </h1>
          <p className="text-muted-foreground">
            Manage customer orders and track fulfillment.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold">{orderList.length}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{processingOrders}</p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={orderList}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search by order number, customer...",
            columnKey: "orderNumber",
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
          emptyStateMessage: "No orders found.",
          filters: [
            {
              columnKey: "status",
              title: "Order Status",
              options: orderStatusOptions,
            },
            {
              columnKey: "paymentStatus",
              title: "Payment",
              options: paymentStatusOptions,
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
      {selectedOrder && (
        <>
          <OrderViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            order={selectedOrder}
          />

          <OrderStatusModal
            open={statusDialogOpen}
            onOpenChange={setStatusDialogOpen}
            order={selectedOrder}
          />
        </>
      )}
    </div>
  );
}
