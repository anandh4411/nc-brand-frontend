// src/features/admin/orders/index.tsx
import { useState, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createOrderColumns } from "./config/columns";
import { OrderViewModal } from "./components/order-view-modal";
import { OrderStatusModal } from "./components/order-status-modal";
import { mockOrders, orderStatusOptions, paymentStatusOptions } from "./data/mock-data";
import type { Order } from "@/types/dto/order.dto";

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

  // Using mock data
  const orderList = mockOrders;

  // Stats
  const totalRevenue = orderList
    .filter((o) => o.paymentStatus === "paid")
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orderList.filter((o) => o.status === "pending").length;
  const processingOrders = orderList.filter((o) =>
    ["confirmed", "processing", "shipped"].includes(o.status)
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
