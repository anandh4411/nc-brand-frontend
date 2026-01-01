import React, { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Heart,
  ChevronDown,
  Package,
  KeyRound,
  Trash2,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { shopCategories } from "@/features/shop/data/mock-data";

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({
  children,
}) => {
  const { isAuthenticated, user, isCustomer, logout } = useAuth();
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigate = (path: string) => {
    router.navigate({ to: path });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.navigate({
        to: "/shop/products",
        search: { q: searchQuery.trim() } as any
      });
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/shop" className="text-lg font-medium hover:text-primary">
                  Home
                </Link>
                <Link to="/shop/products" className="text-lg font-medium hover:text-primary">
                  All Products
                </Link>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Categories</p>
                  {shopCategories.filter(c => c.parentId === null).map((category) => (
                    <Link
                      key={category.id}
                      to={`/shop/products?category=${category.id}` as any}
                      className="block py-2 text-sm hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <Link to="/shop/cart" className="block py-2 text-lg font-medium hover:text-primary">
                    Cart
                  </Link>
                  <Link to="/shop/wishlist" className="block py-2 text-lg font-medium hover:text-primary">
                    Wishlist
                  </Link>
                </div>
                {isAuthenticated && isCustomer && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Account</p>
                    <Link to="/account" className="block py-2 text-sm hover:text-primary">
                      My Account
                    </Link>
                    <Link to="/account/orders" className="block py-2 text-sm hover:text-primary">
                      Order History
                    </Link>
                    <Link to="/account/settings" className="block py-2 text-sm hover:text-primary">
                      Change Password
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="block py-2 text-sm text-destructive hover:text-destructive/80 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/shop" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="NC Brand" className="h-8 w-8 rounded-lg" />
            <span className="font-bold text-xl hidden sm:inline">NC Brand</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/shop"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                Categories
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {shopCategories.filter(c => c.parentId === null).map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => handleNavigate(`/shop/products?category=${category.id}`)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigate("/shop/products")}>
                  All Products
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/shop/products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              All Products
            </Link>
            {isAuthenticated && isCustomer && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                  Account
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleNavigate("/account")}>
                    <User className="h-4 w-4 mr-2" />
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate("/shop/wishlist")}>
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate("/account/orders")}>
                    <Package className="h-4 w-4 mr-2" />
                    Order History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate("/account/settings")}>
                    <KeyRound className="h-4 w-4 mr-2" />
                    Change Password
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleNavigate("/account/settings?tab=delete")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => handleNavigate("/shop/products")}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => handleNavigate("/shop/wishlist")}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => handleNavigate("/shop/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleNavigate("/account")}>
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/shop/wishlist")}>
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/account/orders")}>
                  <Package className="h-4 w-4 mr-2" />
                  Order History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigate("/account/settings")}>
                  <KeyRound className="h-4 w-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleNavigate("/account/settings?tab=delete")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigate("/sign-in?type=customer")}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign In
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}

        {/* Footer */}
        <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.jpg" alt="NC Brand" className="h-8 w-8 rounded-lg" />
                <span className="font-bold text-xl">NC Brand</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Quality textiles from manufacturing to your doorstep.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/shop/products" className="hover:text-foreground">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/shop/products" className="hover:text-foreground">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/shop/products" className="hover:text-foreground">
                    Featured
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/shop" className="hover:text-foreground">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-foreground">
                    Order History
                  </Link>
                </li>
                <li>
                  <Link to="/shop/wishlist" className="hover:text-foreground">
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="hover:text-foreground cursor-pointer">
                    Contact Us
                  </span>
                </li>
                <li>
                  <span className="hover:text-foreground cursor-pointer">
                    Shipping Info
                  </span>
                </li>
                <li>
                  <span className="hover:text-foreground cursor-pointer">
                    Returns & Exchanges
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NC Brand. All rights reserved.
          </div>
        </div>
        </footer>
      </main>
    </div>
  );
};
