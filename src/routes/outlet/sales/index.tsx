import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  Receipt,
  Eye,
  CreditCard,
  Banknote,
  Smartphone,
  Plus,
  Minus,
  Trash2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { usePosInventory, useOutletSales, useCreateSale } from "@/api/hooks/outlet";
import type { OutletSale, POSInventoryProduct } from "@/api/endpoints/outlet";

// Types
type Sale = OutletSale;
type InventoryProduct = POSInventoryProduct;

interface SaleItem {
  sku: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface CartItem extends SaleItem {
  productId: number;
  maxStock: number;
}

function OutletSales() {
  const tableState = useTableState<Sale>({ debounceMs: 300 });
  const { data: salesResponse } = useOutletSales();
  const { data: posInventoryResponse } = usePosInventory();
  const createSaleMutation = useCreateSale();
  const salesData = salesResponse?.data?.sales || [];
  const inventoryProducts: InventoryProduct[] = posInventoryResponse?.data || [];
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // New Sale state
  const [newSaleOpen, setNewSaleOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">("cash");
  const [discount, setDiscount] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productSearch, setProductSearch] = useState("");

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

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "upi":
        return <Smartphone className="h-4 w-4" />;
      case "cash":
        return <Banknote className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case "refunded":
        return <Badge variant="destructive">Refunded</Badge>;
      case "partial_refund":
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Partial Refund</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleView = (sale: Sale) => {
    setSelectedSale(sale);
    setViewDialogOpen(true);
  };

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = Math.round((subtotal - discount) * 0.09); // 9% GST
  const total = subtotal - discount + tax;

  // Filter products based on search
  const filteredProducts = inventoryProducts.filter(
    (p) =>
      p.stock > 0 &&
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.color.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const addToCart = (product: InventoryProduct) => {
    const existingItem = cart.find((item) => item.sku === product.sku);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.sku === product.sku
              ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
              : item
          )
        );
      } else {
        toast.error("Cannot add more than available stock");
      }
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          color: product.color,
          size: product.size,
          quantity: 1,
          unitPrice: product.price,
          total: product.price,
          maxStock: product.stock,
        },
      ]);
    }
  };

  const updateQuantity = (sku: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.sku === sku) {
          const newQty = item.quantity + delta;
          if (newQty < 1 || newQty > item.maxStock) return item;
          return { ...item, quantity: newQty, total: newQty * item.unitPrice };
        }
        return item;
      })
    );
  };

  const removeFromCart = (sku: string) => {
    setCart(cart.filter((item) => item.sku !== sku));
  };

  const resetNewSaleForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setPaymentMethod("cash");
    setDiscount(0);
    setCart([]);
    setProductSearch("");
  };

  const handleCompleteSale = async () => {
    if (!customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    if (cart.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    try {
      const result = await createSaleMutation.mutateAsync({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        paymentMethod,
        discount,
        items: cart.map((item) => ({
          productVariantId: item.productId,
          sku: item.sku,
          name: item.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
      toast.success(`Sale completed! Invoice: ${result.data.invoiceNumber}`);
      resetNewSaleForm();
      setNewSaleOpen(false);
    } catch {
      toast.error("Failed to complete sale");
    }
  };

  const columns = useMemo((): ColumnDef<Sale>[] => [
    {
      id: "slNo",
      header: "Sl No",
      cell: ({ row }) => <span className="text-muted-foreground">{row.index + 1}</span>,
    },

    customColumn<Sale>(
      "invoiceNumber",
      "Invoice #",
      (value) => <span className="font-mono font-medium">{value}</span>,
      { sortable: true }
    ),

    customColumn<Sale>(
      "date",
      "Date & Time",
      (value, row) => (
        <div>
          <p className="font-medium">{formatDate(value)}</p>
          <p className="text-sm text-muted-foreground">{row.time}</p>
        </div>
      ),
      { sortable: true }
    ),

    customColumn<Sale>(
      "customerName",
      "Customer",
      (value) => <span className="font-medium">{value}</span>,
      { sortable: true }
    ),

    customColumn<Sale>(
      "paymentMethod",
      "Payment",
      (value) => (
        <div className="flex items-center gap-2">
          {getPaymentIcon(value)}
          <span className="capitalize">{value}</span>
        </div>
      ),
      { filterable: true }
    ),

    customColumn<Sale>(
      "total",
      "Amount",
      (value) => <span className="font-semibold">{formatPrice(value)}</span>,
      { sortable: true }
    ),

    customColumn<Sale>(
      "status",
      "Status",
      (value) => getStatusBadge(value),
      { filterable: true }
    ),

    actionsColumn<Sale>([
      { label: "View Details", icon: Eye, onClick: handleView },
    ]),
  ], []);

  // Stats calculations
  const todaySales = salesData
    .filter((s) => s.date === new Date().toISOString().split("T")[0] && s.status === "completed")
    .reduce((sum, s) => sum + s.total, 0);

  const thisWeekSales = salesData
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + s.total, 0);

  const transactionCount = salesData.filter((s) => s.status === "completed").length;
  const avgTransaction = transactionCount > 0 ? thisWeekSales / transactionCount : 0;

  const itemsSold = salesData
    .filter((s) => s.status === "completed")
    .reduce((sum, s) => sum + s.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">
            View and manage your sales transactions
          </p>
        </div>
        <Button onClick={() => setNewSaleOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Sale
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Sales
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatPrice(todaySales)}</div>
            <p className="text-xs text-muted-foreground">
              {salesData.filter((s) => s.date === new Date().toISOString().split("T")[0]).length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{formatPrice(thisWeekSales)}</div>
            <p className="text-xs text-muted-foreground">{transactionCount} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Items Sold
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemsSold}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Transaction
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(avgTransaction)}</div>
            <p className="text-xs text-muted-foreground">Per sale</p>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={salesData}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search by invoice, customer...",
            columnKey: "invoiceNumber",
          },
          pagination: {
            enabled: true,
            defaultPageSize: 10,
          },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "date", desc: true },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No sales found.",
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
          {selectedSale && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <DialogTitle className="font-mono">
                    {selectedSale.invoiceNumber}
                  </DialogTitle>
                  {getStatusBadge(selectedSale.status)}
                </div>
                <DialogDescription>
                  {formatDate(selectedSale.date)} at {selectedSale.time}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedSale.customerName}</p>
                    {selectedSale.customerPhone && (
                      <p className="text-muted-foreground">{selectedSale.customerPhone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <div className="flex items-center gap-2 font-medium">
                      {getPaymentIcon(selectedSale.paymentMethod)}
                      <span className="capitalize">{selectedSale.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Items */}
                <div>
                  <h4 className="font-semibold mb-3">
                    Items ({selectedSale.items.reduce((sum, item) => sum + item.quantity, 0)} total)
                  </h4>
                  <div className="space-y-2">
                    {selectedSale.items.map((item, idx) => (
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
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.total)}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(selectedSale.subtotal)}</span>
                  </div>
                  {selectedSale.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(selectedSale.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (GST)</span>
                    <span>{formatPrice(selectedSale.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(selectedSale.total)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Sale Dialog */}
      <Dialog open={newSaleOpen} onOpenChange={(open) => {
        if (!open) resetNewSaleForm();
        setNewSaleOpen(open);
      }}>
        <DialogContent className="!max-w-[95vw] !w-[1600px] p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b pr-14">
            <div>
              <DialogTitle className="text-xl">New Sale</DialogTitle>
              <DialogDescription>
                Select products and complete the transaction
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setNewSaleOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCompleteSale} disabled={cart.length === 0 || createSaleMutation.isPending} size="lg">
                <Receipt className="h-4 w-4 mr-2" />
                Complete Sale
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3" style={{ height: "calc(80vh - 80px)" }}>
            {/* Left: Product Selection (2 cols) */}
            <div className="col-span-2 border-r flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b bg-muted/30 shrink-0">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Product Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">
                <div className="col-span-2">SKU</div>
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Variant</div>
                <div className="col-span-1 text-center">Stock</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-1"></div>
              </div>

              <ScrollArea className="flex-1 min-h-0">
                <div className="divide-y">
                  {filteredProducts.map((product) => {
                    const cartItem = cart.find((item) => item.sku === product.sku);
                    const inCart = cartItem?.quantity || 0;
                    const availableStock = product.stock - inCart;

                    return (
                      <div
                        key={product.id}
                        className={`grid grid-cols-12 gap-4 px-6 py-3 items-center transition-colors ${
                          availableStock > 0
                            ? "hover:bg-muted/50 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() => availableStock > 0 && addToCart(product)}
                      >
                        <div className="col-span-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">{product.sku}</code>
                        </div>
                        <div className="col-span-4 font-medium">{product.name}</div>
                        <div className="col-span-2 text-muted-foreground">
                          {product.color} / {product.size}
                        </div>
                        <div className="col-span-1 text-center">
                          <span className={availableStock <= 3 ? "text-orange-500 font-medium" : ""}>
                            {availableStock}
                          </span>
                          {inCart > 0 && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({inCart} in cart)
                            </span>
                          )}
                        </div>
                        <div className="col-span-2 text-right font-semibold">
                          {formatPrice(product.price)}
                        </div>
                        <div className="col-span-1 text-right">
                          <Button size="sm" variant="ghost" disabled={availableStock <= 0}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                      No products found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Right: Cart & Checkout (1 col) */}
            <div className="col-span-1 flex flex-col bg-muted/20 overflow-hidden">
              {/* Customer Details */}
              <div className="p-4 border-b bg-background shrink-0">
                <h3 className="font-semibold mb-3">Customer</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Customer name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <Input
                    placeholder="Phone (optional)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="px-4 py-3 border-b bg-background flex items-center justify-between shrink-0">
                  <h3 className="font-semibold">Cart</h3>
                  {cart.length > 0 && (
                    <Badge variant="secondary">{cart.length} items</Badge>
                  )}
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div className="p-3 space-y-2">
                    {cart.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Click products to add</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.sku} className="p-3 bg-background rounded-lg border">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.color} / {item.size}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 -mt-1 -mr-1 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.sku)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.sku, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.sku, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-semibold">{formatPrice(item.total)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Payment & Totals */}
              <div className="p-4 border-t bg-background space-y-4 shrink-0">
                <div className="flex gap-2">
                  <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    max={subtotal}
                    value={discount || ""}
                    placeholder="Discount"
                    className="w-24"
                    onChange={(e) => setDiscount(Math.min(Number(e.target.value) || 0, subtotal))}
                  />
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (9%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute("/outlet/sales/")({
  component: OutletSales,
});
