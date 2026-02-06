// src/features/admin/dashboard/index.tsx
import { useState } from "react";
import {
  Store,
  Package,
  ShoppingCart,
  AlertTriangle,
  Truck,
  IndianRupee,
  ImagePlus,
  Trash2,
  Image,
  Link as LinkIcon,
  Loader2,
  Users,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useDashboardStats,
  useLowStockItems,
  useRecentOrders,
  usePendingShipments,
  useAdminBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "@/api/hooks/admin";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "delivered": return "default";
    case "shipped":
    case "processing": return "secondary";
    case "pending": return "outline";
    default: return "outline";
  }
};

export default function AdminDashboard() {
  // API Hooks
  const { data: statsResponse, isLoading: statsLoading } = useDashboardStats();
  const { data: lowStockResponse, isLoading: lowStockLoading } = useLowStockItems(5);
  const { data: recentOrdersResponse, isLoading: ordersLoading } = useRecentOrders(5);
  const { data: pendingShipmentsResponse, isLoading: shipmentsLoading } = usePendingShipments(5);
  const { data: bannersResponse, isLoading: bannersLoading } = useAdminBanners();

  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  // Extract data with fallbacks
  const stats = (statsResponse?.data || {}) as any;
  const lowStockItems = (lowStockResponse?.data || []) as any[];
  const recentOrders = (recentOrdersResponse?.data || []) as any[];
  const pendingShipments = (pendingShipmentsResponse?.data || []) as any[];
  const banners = (bannersResponse?.data || []) as any[];

  // Banner state
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [bannerForm, setBannerForm] = useState({
    imageUrl: "",
    title: "",
    link: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({ imageUrl: "", title: "", link: "" });
    setImageFile(null);
    setBannerDialogOpen(true);
  };

  const handleEditBanner = (banner: any) => {
    setEditingBanner(banner);
    setBannerForm({
      imageUrl: banner.imageUrl,
      title: banner.title,
      link: banner.link || "",
    });
    setImageFile(null);
    setBannerDialogOpen(true);
  };

  const handleSaveBanner = () => {
    if (!bannerForm.title) {
      toast.error("Please fill in the title");
      return;
    }

    if (editingBanner) {
      updateBanner.mutate(
        {
          uuid: editingBanner.uuid,
          data: { title: bannerForm.title, link: bannerForm.link },
          image: imageFile || undefined,
        },
        {
          onSuccess: () => {
            setBannerDialogOpen(false);
            toast.success("Banner updated");
          },
          onError: () => toast.error("Failed to update banner"),
        }
      );
    } else {
      if (!imageFile) {
        toast.error("Please select an image");
        return;
      }
      createBanner.mutate(
        {
          data: { title: bannerForm.title, link: bannerForm.link },
          image: imageFile,
        },
        {
          onSuccess: () => {
            setBannerDialogOpen(false);
            toast.success("Banner added");
          },
          onError: () => toast.error("Failed to add banner"),
        }
      );
    }
  };

  const handleDeleteBanner = (uuid: string) => {
    deleteBanner.mutate(uuid, {
      onSuccess: () => toast.success("Banner deleted"),
      onError: () => toast.error("Failed to delete banner"),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to NC Brand Admin. Here's an overview of your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Outlets</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeOutlets || 0}</div>
                <p className="text-xs text-muted-foreground">
                  of {stats.totalOutlets || 0} total outlets
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalProductGroups || 0} product groups
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingOrders || 0} pending
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatPrice(stats.monthlyRevenue || 0)}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Low Stock Alert */}
        <Card className="border-destructive/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <CardTitle className="text-sm font-medium text-destructive">
                  Low Stock Alert
                </CardTitle>
              </div>
              {lowStockLoading ? (
                <Skeleton className="h-5 w-8" />
              ) : (
                <Badge variant="destructive">{stats.lowStockItems || lowStockItems.length}</Badge>
              )}
            </div>
            <CardDescription>
              Items below threshold requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowStockLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : lowStockItems.length > 0 ? (
              <>
                {lowStockItems.slice(0, 3).map((item: any) => (
                  <div
                    key={item.uuid || item.sku}
                    className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.colorName} / {item.size}
                      </p>
                    </div>
                    <Badge variant="destructive">{item.quantity} left</Badge>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-4">All items well stocked</p>
            )}
            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
              <Link to="/admin/inventory">View Inventory</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pending Shipments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
              </div>
              {shipmentsLoading ? (
                <Skeleton className="h-5 w-8" />
              ) : (
                <Badge variant="secondary">{pendingShipments.length}</Badge>
              )}
            </div>
            <CardDescription>
              Shipments awaiting dispatch to outlets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shipmentsLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : pendingShipments.length > 0 ? (
              <div className="space-y-2">
                {pendingShipments.slice(0, 3).map((shipment: any) => (
                  <div
                    key={shipment.uuid}
                    className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{shipment.outletName}</p>
                      <p className="text-xs text-muted-foreground">{shipment.itemCount} items</p>
                    </div>
                    <Badge variant="outline">{shipment.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">No pending shipments</p>
            )}
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link to="/admin/shipments">View All</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <div
                  key={order.uuid || order.orderNumber}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium font-mono">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusColor(order.status) as any} className="capitalize">
                      {order.status}
                    </Badge>
                    <span className="font-mono font-medium">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No orders yet</p>
          )}
        </CardContent>
      </Card>

      {/* Banner Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Shop Banners
              </CardTitle>
              <CardDescription>
                Manage homepage banner images for e-commerce storefront
              </CardDescription>
            </div>
            <Button size="sm" onClick={handleAddBanner}>
              <ImagePlus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {bannersLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No banners added yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleAddBanner}>
                Add your first banner
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((banner: any) => (
                <div
                  key={banner.uuid}
                  className={`flex items-center gap-4 p-3 border rounded-lg ${
                    !banner.isActive ? "opacity-50" : ""
                  }`}
                >
                  {/* Banner preview */}
                  <div className="w-40 h-16 rounded overflow-hidden bg-muted shrink-0">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/160x64?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Banner info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{banner.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {banner.link || "No link set"}
                    </p>
                  </div>

                  {/* Status badge */}
                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditBanner(banner)}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteBanner(banner.uuid)}
                      disabled={deleteBanner.isPending}
                    >
                      {deleteBanner.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/products">
                <Package className="h-5 w-5" />
                <span>Add Product</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/shipments">
                <Truck className="h-5 w-5" />
                <span>Create Shipment</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/outlets">
                <Store className="h-5 w-5" />
                <span>Add Outlet</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/inventory">
                <AlertTriangle className="h-5 w-5" />
                <span>Check Stock</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Banner Dialog */}
      <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "Add Banner"}
            </DialogTitle>
            <DialogDescription>
              {editingBanner
                ? "Update the banner details below."
                : "Add a new banner to display on the shop homepage."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="imageFile">Banner Image</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setBannerForm({ ...bannerForm, imageUrl: URL.createObjectURL(file) });
                  }
                }}
              />
              {(bannerForm.imageUrl || editingBanner?.imageUrl) && (
                <div className="mt-2 rounded-lg overflow-hidden bg-muted h-32">
                  <img
                    src={bannerForm.imageUrl || editingBanner?.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x128?text=Invalid+Image";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Summer Collection Sale"
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link (optional)</Label>
              <Input
                id="link"
                placeholder="/shop/categories/sarees"
                value={bannerForm.link}
                onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Where should users go when they click this banner?
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBannerDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveBanner}
              disabled={createBanner.isPending || updateBanner.isPending}
            >
              {(createBanner.isPending || updateBanner.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingBanner ? "Save Changes" : "Add Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
