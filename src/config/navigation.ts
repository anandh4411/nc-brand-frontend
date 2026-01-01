import {
  Building2,
  Home,
  Package,
  FolderTree,
  Truck,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  ClipboardList,
  Store,
  Heart,
  MapPin,
  Star,
  User,
  Grid3X3,
  Tag,
  Percent,
  CreditCard,
} from "lucide-react";
import { SidebarItem } from "@/components/layout/types";
import React from "react";

/**
 * Admin Navigation (Manufacturing Unit)
 */
export const adminNavItems: SidebarItem[] = [
  { label: "Dashboard", path: "/admin", icon: Home },
  { label: "Outlets", path: "/admin/outlets", icon: Store },
  { label: "Categories", path: "/admin/categories", icon: FolderTree },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Inventory", path: "/admin/inventory", icon: ClipboardList },
  { label: "Shipments", path: "/admin/shipments", icon: Truck },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
];

export const adminFooterItems: SidebarItem[] = [
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

/**
 * Outlet Navigation
 */
export const outletNavItems: SidebarItem[] = [
  { label: "Dashboard", path: "/outlet", icon: Home },
  { label: "Inventory", path: "/outlet/inventory", icon: ClipboardList },
  { label: "Shipments", path: "/outlet/shipments", icon: Truck },
  { label: "Sales", path: "/outlet/sales", icon: BarChart3 },
];

export const outletFooterItems: SidebarItem[] = [
  { label: "Settings", path: "/outlet/settings", icon: Settings },
];

/**
 * Customer Account Navigation
 */
export const accountNavItems: SidebarItem[] = [
  { label: "Dashboard", path: "/account", icon: Home },
  { label: "Orders", path: "/account/orders", icon: ShoppingCart },
  { label: "Addresses", path: "/account/addresses", icon: MapPin },
  { label: "Reviews", path: "/account/reviews", icon: Star },
  { label: "Wishlist", path: "/account/wishlist", icon: Heart },
];

export const accountFooterItems: SidebarItem[] = [
  { label: "Profile", path: "/account/settings", icon: User },
];

/**
 * Shop Navigation (E-commerce Storefront)
 */
export const shopNavItems: SidebarItem[] = [
  { label: "Home", path: "/shop", icon: Home },
  { label: "All Products", path: "/shop/products", icon: Package },
  { label: "Categories", path: "/shop/categories", icon: Grid3X3 },
  { label: "New Arrivals", path: "/shop/new-arrivals", icon: Tag },
  { label: "Offers", path: "/shop/offers", icon: Percent },
];

export const shopFooterItems: SidebarItem[] = [
  { label: "Cart", path: "/shop/cart", icon: ShoppingCart },
  { label: "Wishlist", path: "/shop/wishlist", icon: Heart },
  { label: "My Account", path: "/account", icon: User },
];

/**
 * Get navigation items based on user role and current path
 */
export const getNavItems = (currentPath: string): SidebarItem[] => {
  if (currentPath.startsWith("/admin")) {
    return adminNavItems;
  }
  if (currentPath.startsWith("/outlet")) {
    return outletNavItems;
  }
  if (currentPath.startsWith("/account")) {
    return accountNavItems;
  }
  // Default to admin nav
  return adminNavItems;
};

/**
 * Get footer items based on user role
 */
export const getFooterItems = (currentPath: string): SidebarItem[] => {
  if (currentPath.startsWith("/admin")) {
    return adminFooterItems;
  }
  if (currentPath.startsWith("/outlet")) {
    return outletFooterItems;
  }
  if (currentPath.startsWith("/account")) {
    return accountFooterItems;
  }
  return adminFooterItems;
};

// Legacy export for backwards compatibility
export const footerNavItems: SidebarItem[] = [];

// Custom logo component
const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return React.createElement("img", {
    src: "/logo.png",
    alt: "NC Brand Logo",
    className: "w-full",
    ...props,
  });
};

export const brandingConfig = {
  iconComponent: LogoIcon,
  name: "NC Brand",
};
