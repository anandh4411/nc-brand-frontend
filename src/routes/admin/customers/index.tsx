import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  ShoppingBag,
  Eye,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { useAdminCustomers } from "@/api/hooks/admin";
import type { Customer } from "@/api/endpoints/admin";
import { format } from "date-fns";

function AdminCustomers() {
  const tableState = useTableState<Customer>({ debounceMs: 300 });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { data: customersResponse, isLoading } = useAdminCustomers();

  const customers = (
    (customersResponse?.data as any)?.customers ||
    customersResponse?.data ||
    []
  ) as Customer[];

  const pagination = (customersResponse?.data as any)?.pagination;

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM dd, yyyy");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
  };

  const columns = useMemo(
    (): ColumnDef<Customer>[] => [
      {
        id: "slNo",
        header: "Sl No",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.index + 1}</span>
        ),
      },

      customColumn<Customer>(
        "name",
        "Customer",
        (value, row) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials(value)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{value}</p>
              <p className="text-sm text-muted-foreground">{row.email}</p>
            </div>
          </div>
        ),
        { sortable: true }
      ),

      customColumn<Customer>(
        "phone",
        "Phone",
        (value) => (
          <span className="text-muted-foreground">{value || "—"}</span>
        ),
        { sortable: true }
      ),

      {
        id: "orders",
        accessorFn: (row) => row._count?.orders ?? 0,
        header: "Orders",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue() as number}</span>
        ),
      },

      {
        id: "isActive",
        accessorFn: (row) => row.isActive,
        header: "Status",
        cell: ({ row: { original } }) => (
          <Badge variant={original.isActive ? "default" : "secondary"}>
            {original.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
        filterFn: "equals",
      },

      customColumn<Customer>("createdAt", "Joined", (value) =>
        value ? (
          <span className="text-muted-foreground text-sm">
            {formatDate(value)}
          </span>
        ) : (
          "—"
        )
      ),

      actionsColumn<Customer>([
        { label: "View Details", icon: Eye, onClick: handleView },
      ]),
    ],
    []
  );

  // Stats from current data
  const totalCustomers = pagination?.total ?? customers.length;
  const activeCustomers = customers.filter((c) => c.isActive).length;
  const totalOrders = customers.reduce(
    (sum, c) => sum + (c._count?.orders ?? 0),
    0
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your shop customers</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">Manage your shop customers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {activeCustomers}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              From listed customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={customers}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search customers...",
            columnKey: "name",
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
          emptyStateMessage: "No customers found.",
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
        <DialogContent className="max-w-lg">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {getInitials(selectedCustomer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>{selectedCustomer.name}</DialogTitle>
                    <DialogDescription>
                      Customer since {formatDate(selectedCustomer.createdAt)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">
                      {selectedCustomer._count?.orders ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {selectedCustomer._count?.addresses ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Addresses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {selectedCustomer._count?.reviews ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                </div>

                <Separator />

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      selectedCustomer.isActive ? "default" : "secondary"
                    }
                  >
                    {selectedCustomer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined on {formatDate(selectedCustomer.createdAt)}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute("/admin/customers/")({
  component: AdminCustomers,
});
