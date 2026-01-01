// src/features/admin/dashboard/index.tsx
import { useState } from "react";
import {
  Store,
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Truck,
  IndianRupee,
  Users,
  ImagePlus,
  Trash2,
  GripVertical,
  Image,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Mock dashboard data
const dashboardStats = {
  totalOutlets: 6,
  activeOutlets: 5,
  totalProducts: 4,
  activeProducts: 3,
  totalOrders: 5,
  pendingOrders: 1,
  processingOrders: 2,
  lowStockItems: 3,
  pendingShipments: 2,
  totalRevenue: 99377,
  monthlyRevenue: 73727,
};

const recentOrders = [
  { id: "TXH-2024-0004", customer: "Meera Krishnan", status: "pending", total: 17700 },
  { id: "TXH-2024-0003", customer: "Arjun Sharma", status: "processing", total: 53100 },
  { id: "TXH-2024-0002", customer: "Lakshmi Devi", status: "shipped", total: 2927 },
  { id: "TXH-2024-0001", customer: "Priya Kumar", status: "delivered", total: 17700 },
];

const lowStockItems = [
  { sku: "KUR-BLU-M", name: "Cotton Casual Kurti", color: "Royal Blue", size: "M", qty: 8 },
  { sku: "KUR-BLU-XL", name: "Cotton Casual Kurti", color: "Royal Blue", size: "XL", qty: 3 },
  { sku: "LEH-GLD-L", name: "Banarasi Wedding Lehenga", color: "Gold", size: "L", qty: 2 },
];

// Banner interface
interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
  isActive: boolean;
}

// Initial mock banners
const initialBanners: Banner[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=400&fit=crop",
    title: "New Arrivals - Silk Sarees",
    link: "/shop/categories/sarees",
    isActive: true,
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=400&fit=crop",
    title: "Wedding Collection",
    link: "/shop/categories/wedding",
    isActive: true,
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "default";
    case "shipped":
    case "processing": return "secondary";
    case "pending": return "outline";
    default: return "outline";
  }
};

export default function AdminDashboard() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    imageUrl: "",
    title: "",
    link: "",
  });

  const handleAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({ imageUrl: "", title: "", link: "" });
    setBannerDialogOpen(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      imageUrl: banner.imageUrl,
      title: banner.title,
      link: banner.link,
    });
    setBannerDialogOpen(true);
  };

  const handleSaveBanner = () => {
    if (!bannerForm.imageUrl || !bannerForm.title) {
      toast.error("Please fill in image URL and title");
      return;
    }

    if (editingBanner) {
      setBanners(banners.map(b =>
        b.id === editingBanner.id
          ? { ...b, ...bannerForm }
          : b
      ));
      toast.success("Banner updated successfully");
    } else {
      const newBanner: Banner = {
        id: String(Date.now()),
        imageUrl: bannerForm.imageUrl,
        title: bannerForm.title,
        link: bannerForm.link,
        isActive: true,
      };
      setBanners([...banners, newBanner]);
      toast.success("Banner added successfully");
    }
    setBannerDialogOpen(false);
    setBannerForm({ imageUrl: "", title: "", link: "" });
  };

  const handleDeleteBanner = (bannerId: string) => {
    setBanners(banners.filter(b => b.id !== bannerId));
    toast.success("Banner deleted");
  };

  const handleToggleBanner = (bannerId: string) => {
    setBanners(banners.map(b =>
      b.id === bannerId ? { ...b, isActive: !b.isActive } : b
    ));
  };

  const moveBanner = (index: number, direction: "up" | "down") => {
    const newBanners = [...banners];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;
    [newBanners[index], newBanners[newIndex]] = [newBanners[newIndex], newBanners[index]];
    setBanners(newBanners);
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
            <div className="text-2xl font-bold">{dashboardStats.activeOutlets}</div>
            <p className="text-xs text-muted-foreground">
              of {dashboardStats.totalOutlets} total outlets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalProducts} in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.pendingOrders} pending, {dashboardStats.processingOrders} processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(dashboardStats.monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Low Stock Alert */}
        {dashboardStats.lowStockItems > 0 && (
          <Card className="border-destructive/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <CardTitle className="text-sm font-medium text-destructive">
                    Low Stock Alert
                  </CardTitle>
                </div>
                <Badge variant="destructive">{dashboardStats.lowStockItems}</Badge>
              </div>
              <CardDescription>
                Items below threshold requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {lowStockItems.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.color} / {item.size}
                    </p>
                  </div>
                  <Badge variant="destructive">{item.qty} left</Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link to="/admin/inventory">View Inventory</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pending Shipments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
              </div>
              <Badge variant="secondary">{dashboardStats.pendingShipments}</Badge>
            </div>
            <CardDescription>
              Shipments awaiting dispatch to outlets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4">
              <p className="text-3xl font-bold">{dashboardStats.pendingShipments}</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/shipments">View All</Link>
              </Button>
            </div>
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
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium font-mono">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
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
          {banners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No banners added yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={handleAddBanner}>
                Add your first banner
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`flex items-center gap-4 p-3 border rounded-lg ${
                    !banner.isActive ? "opacity-50" : ""
                  }`}
                >
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveBanner(index, "up")}
                      disabled={index === 0}
                    >
                      <span className="text-xs">▲</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveBanner(index, "down")}
                      disabled={index === banners.length - 1}
                    >
                      <span className="text-xs">▼</span>
                    </Button>
                  </div>

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
                  <Badge
                    variant={banner.isActive ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleToggleBanner(banner.id)}
                  >
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
                      onClick={() => handleDeleteBanner(banner.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/banner.jpg"
                value={bannerForm.imageUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
              />
              {bannerForm.imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden bg-muted h-32">
                  <img
                    src={bannerForm.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x128?text=Invalid+URL";
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
            <Button onClick={handleSaveBanner}>
              {editingBanner ? "Save Changes" : "Add Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
