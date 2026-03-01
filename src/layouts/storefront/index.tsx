import React, { useState } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useTheme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Heart,
  Package,
  KeyRound,
  Trash2,
  LogOut,
  Home,
  Grid3X3,
  ShoppingBag,
  Settings,
  LogIn,
  Moon,
  Sun,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useShopCategories } from "@/api/hooks/shop";

interface StorefrontLayoutProps {
  children: React.ReactNode;
}

export const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({
  children,
}) => {
  const { isAuthenticated, user, isCustomer, logout } = useAuth();
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: categoriesData } = useShopCategories();
  const mainCategories = (categoriesData?.data || []).filter((c: any) => !c.parentId);

  const isLoggedIn = isAuthenticated && isCustomer;

  const isActivePath = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

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

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
              {/* Drawer Header - Brand */}
              <div className="p-5 pb-4">
                <Link
                  to="/shop"
                  className="flex items-center gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img src="/logo.jpg" alt="NC Brand" className="h-10 w-10 rounded-xl" />
                  <div>
                    <span className="font-bold text-lg block leading-tight">NC Brand</span>
                    <span className="text-xs text-muted-foreground">Quality Textiles</span>
                  </div>
                </Link>
              </div>

              <Separator />

              {/* Drawer Navigation */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {/* Main Links */}
                <div className="space-y-1">
                  <Link
                    to="/shop"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      currentPath === "/shop"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    to="/shop/products"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActivePath("/shop/products")
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    All Products
                  </Link>
                </div>

                {/* Categories */}
                {mainCategories.length > 0 && (
                  <div className="mt-6">
                    <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Categories
                    </p>
                    <div className="space-y-1">
                      {mainCategories.map((category: any) => (
                        <Link
                          key={category.id}
                          to={`/shop/products?category=${category.slug}` as any}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Grid3X3 className="h-4 w-4" />
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shopping */}
                <div className="mt-6">
                  <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Shopping
                  </p>
                  <div className="space-y-1">
                    <Link
                      to="/shop/cart"
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActivePath("/shop/cart")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                      </span>
                      {cartItemCount > 0 && (
                        <span className="h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-1.5">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/shop/wishlist"
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActivePath("/shop/wishlist")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </span>
                      {wishlistCount > 0 && (
                        <span className="h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-1.5">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>

                {/* Account Section - only when logged in */}
                {isLoggedIn && (
                  <div className="mt-6">
                    <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Account
                    </p>
                    <div className="space-y-1">
                      <Link
                        to="/account"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        My Account
                      </Link>
                      <Link
                        to="/account/orders"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        Order History
                      </Link>
                      <Link
                        to="/account/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </div>
                  </div>
                )}
              </nav>

              {/* Drawer Footer */}
              <div className="mt-auto border-t p-4">
                {isLoggedIn ? (
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleNavigate("/customer/sign-in");
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleNavigate("/customer/sign-up");
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo - hidden on mobile, shown in drawer instead */}
          <Link to="/shop" className="hidden md:flex items-center gap-2">
            <img src="/logo.jpg" alt="NC Brand" className="h-8 w-8 rounded-lg" />
            <span className="font-bold text-xl">NC Brand</span>
          </Link>

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
          <div className="flex items-center gap-1">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => handleNavigate("/shop/products")}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
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

            {/* Account Dropdown - different content based on auth state */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isLoggedIn ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => handleNavigate("/customer/sign-in")}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigate("/customer/sign-up")}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </DropdownMenuItem>
                  </>
                )}
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
                  <Link to={isLoggedIn ? "/account" : "/customer/sign-in"} className="hover:text-foreground">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to={isLoggedIn ? "/account/orders" : "/customer/sign-in"} className="hover:text-foreground">
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
