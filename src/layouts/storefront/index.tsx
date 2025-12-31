import React from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Heart,
  ChevronDown,
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

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({
  children,
}) => {
  const { isAuthenticated, user, isCustomer } = useAuth();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.navigate({ to: path });
  };

  // Placeholder for cart count - will be replaced with cart context
  const cartItemCount = 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
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
                  Products
                </Link>
                <Link to="/shop/categories" className="text-lg font-medium hover:text-primary">
                  Categories
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/shop" className="flex items-center gap-2">
            <img src="/logo.png" alt="TextileHub" className="h-8 w-8" />
            <span className="font-bold text-xl hidden sm:inline">TextileHub</span>
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
                <DropdownMenuItem onClick={() => handleNavigate("/shop/categories/men")}>
                  Men
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/shop/categories/women")}>
                  Women
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/shop/categories/kids")}>
                  Kids
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigate("/shop/categories")}>
                  All Categories
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/shop/products"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              All Products
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("/shop/search")}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            {isAuthenticated && isCustomer && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleNavigate("/account/wishlist")}
              >
                <Heart className="h-5 w-5" />
              </Button>
            )}

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
            {isAuthenticated && isCustomer ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.name}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate("/account")}>
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate("/account/orders")}>
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate("/account/wishlist")}>
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      // Will be handled by logout
                    }}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate("/sign-in?type=customer")}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="TextileHub" className="h-8 w-8" />
                <span className="font-bold text-xl">TextileHub</span>
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
                  <Link to="/shop/categories" className="hover:text-foreground">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/shop/products?featured=true" className="hover:text-foreground">
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
                  <Link to="/account" className="hover:text-foreground">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/account/orders" className="hover:text-foreground">
                    Order History
                  </Link>
                </li>
                <li>
                  <Link to="/account/wishlist" className="hover:text-foreground">
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
                  <Link to="/help/contact" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/help/shipping" className="hover:text-foreground">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/help/returns" className="hover:text-foreground">
                    Returns & Exchanges
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TextileHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
