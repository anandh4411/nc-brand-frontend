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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  ShoppingBag,
  IndianRupee,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  joinedDate: string;
  status: "active" | "inactive";
  addresses: {
    type: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }[];
}

// Mock data
const customersData: Customer[] = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    totalOrders: 12,
    totalSpent: 45600,
    lastOrderDate: "2024-12-28",
    joinedDate: "2024-03-15",
    status: "active",
    addresses: [
      { type: "Home", address: "123, MG Road, Indira Nagar", city: "Bangalore", state: "Karnataka", pincode: "560038" },
    ],
  },
  {
    id: "2",
    name: "Meera Patel",
    email: "meera.patel@email.com",
    phone: "+91 87654 32109",
    totalOrders: 8,
    totalSpent: 32400,
    lastOrderDate: "2024-12-25",
    joinedDate: "2024-05-20",
    status: "active",
    addresses: [
      { type: "Home", address: "456, Anna Salai", city: "Chennai", state: "Tamil Nadu", pincode: "600002" },
    ],
  },
  {
    id: "3",
    name: "Anjali Reddy",
    email: "anjali.reddy@email.com",
    phone: "+91 76543 21098",
    totalOrders: 15,
    totalSpent: 67800,
    lastOrderDate: "2024-12-30",
    joinedDate: "2024-01-10",
    status: "active",
    addresses: [
      { type: "Home", address: "789, Banjara Hills", city: "Hyderabad", state: "Telangana", pincode: "500034" },
      { type: "Office", address: "101, HITEC City", city: "Hyderabad", state: "Telangana", pincode: "500081" },
    ],
  },
  {
    id: "4",
    name: "Kavitha Nair",
    email: "kavitha.nair@email.com",
    phone: "+91 65432 10987",
    totalOrders: 5,
    totalSpent: 18900,
    lastOrderDate: "2024-12-20",
    joinedDate: "2024-07-08",
    status: "active",
    addresses: [
      { type: "Home", address: "234, Marine Drive", city: "Kochi", state: "Kerala", pincode: "682001" },
    ],
  },
  {
    id: "5",
    name: "Lakshmi Iyer",
    email: "lakshmi.iyer@email.com",
    phone: "+91 54321 09876",
    totalOrders: 22,
    totalSpent: 98500,
    lastOrderDate: "2024-12-29",
    joinedDate: "2023-11-05",
    status: "active",
    addresses: [
      { type: "Home", address: "567, T Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600017" },
    ],
  },
  {
    id: "6",
    name: "Divya Menon",
    email: "divya.menon@email.com",
    phone: "+91 43210 98765",
    totalOrders: 3,
    totalSpent: 8700,
    lastOrderDate: "2024-11-15",
    joinedDate: "2024-09-22",
    status: "inactive",
    addresses: [
      { type: "Home", address: "890, Koramangala", city: "Bangalore", state: "Karnataka", pincode: "560034" },
    ],
  },
  {
    id: "7",
    name: "Radha Krishnan",
    email: "radha.k@email.com",
    phone: "+91 32109 87654",
    totalOrders: 18,
    totalSpent: 76200,
    lastOrderDate: "2024-12-27",
    joinedDate: "2024-02-14",
    status: "active",
    addresses: [
      { type: "Home", address: "123, Jubilee Hills", city: "Hyderabad", state: "Telangana", pincode: "500033" },
    ],
  },
  {
    id: "8",
    name: "Shalini Gupta",
    email: "shalini.g@email.com",
    phone: "+91 21098 76543",
    totalOrders: 9,
    totalSpent: 34500,
    lastOrderDate: "2024-12-22",
    joinedDate: "2024-04-30",
    status: "active",
    addresses: [
      { type: "Home", address: "456, Connaught Place", city: "New Delhi", state: "Delhi", pincode: "110001" },
    ],
  },
  {
    id: "9",
    name: "Nisha Verma",
    email: "nisha.verma@email.com",
    phone: "+91 10987 65432",
    totalOrders: 1,
    totalSpent: 4599,
    lastOrderDate: "2024-10-05",
    joinedDate: "2024-10-01",
    status: "inactive",
    addresses: [
      { type: "Home", address: "789, Linking Road", city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    ],
  },
  {
    id: "10",
    name: "Pooja Singh",
    email: "pooja.singh@email.com",
    phone: "+91 09876 54321",
    totalOrders: 14,
    totalSpent: 52300,
    lastOrderDate: "2024-12-26",
    joinedDate: "2024-01-25",
    status: "active",
    addresses: [
      { type: "Home", address: "101, Sector 15", city: "Noida", state: "Uttar Pradesh", pincode: "201301" },
    ],
  },
];

function AdminCustomers() {
  const tableState = useTableState<Customer>({ debounceMs: 300 });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
  };

  const columns = useMemo((): ColumnDef<Customer>[] => [
    {
      id: "slNo",
      header: "Sl No",
      cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
    },

    customColumn<Customer>(
      "name",
      "Customer",
      (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{getInitials(value)}</AvatarFallback>
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
      (value) => <span className="text-muted-foreground">{value}</span>,
      { sortable: true }
    ),

    customColumn<Customer>(
      "totalOrders",
      "Orders",
      (value) => <span className="font-medium">{value}</span>,
      { sortable: true }
    ),

    customColumn<Customer>(
      "totalSpent",
      "Total Spent",
      (value) => <span className="font-semibold">{formatPrice(value)}</span>,
      { sortable: true }
    ),

    customColumn<Customer>(
      "lastOrderDate",
      "Last Order",
      (value) => formatDate(value),
      { sortable: true }
    ),

    customColumn<Customer>(
      "status",
      "Status",
      (value) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
      { filterable: true }
    ),

    actionsColumn<Customer>([
      { label: "View Details", icon: Eye, onClick: handleView },
    ]),
  ], []);

  // Stats
  const totalCustomers = customersData.length;
  const activeCustomers = customersData.filter((c) => c.status === "active").length;
  const totalRevenue = customersData.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customersData.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Manage your shop customers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
            <div className="text-2xl font-bold text-green-500">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">Made recent purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From all customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Order Value
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={customersData}
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
            defaultSort: { columnKey: "totalSpent", desc: true },
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
                    <AvatarFallback>{getInitials(selectedCustomer.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>{selectedCustomer.name}</DialogTitle>
                    <DialogDescription>
                      Customer since {formatDate(selectedCustomer.joinedDate)}
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
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatPrice(selectedCustomer.totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {formatPrice(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                    </p>
                    <p className="text-xs text-muted-foreground">Avg. Order</p>
                  </div>
                </div>

                <Separator />

                {/* Addresses */}
                <div>
                  <h4 className="font-semibold mb-3">Addresses</h4>
                  <div className="space-y-2">
                    {selectedCustomer.addresses.map((addr, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm p-3 bg-muted rounded-lg">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">{addr.type}</p>
                          <p className="text-muted-foreground">
                            {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last order on {formatDate(selectedCustomer.lastOrderDate)}</span>
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
