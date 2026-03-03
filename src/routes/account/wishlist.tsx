import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist as useWishlistApi, useRemoveFromWishlist } from "@/api/hooks/shop";
import type { WishlistItem } from "@/types/dto/wishlist.dto";

function AccountWishlistPage() {
  const { data: wishlistData, isLoading } = useWishlistApi();
  const { mutate: removeItem } = useRemoveFromWishlist();

  const items: WishlistItem[] = (wishlistData?.data || []) as WishlistItem[];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Wishlist</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-2.5 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">
            Save items you love by clicking the heart icon on products.
          </p>
          <Button asChild>
            <Link to="/shop/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} item{items.length > 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div
            key={item.uuid}
            className="group bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={item.imageUrl || "/placeholder-product.jpg"}
                alt={item.productName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-7 w-7 rounded-full bg-white/80 hover:bg-white shadow-sm"
                onClick={() => removeItem(item.uuid)}
              >
                <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
              </Button>
              {!item.inStock && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                  Out of Stock
                </div>
              )}
            </div>
            <div className="p-2.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {item.colorName} / {item.size}
              </span>
              <h3 className="font-medium text-sm leading-tight line-clamp-2 mt-0.5 mb-1.5 min-h-[2.25rem]">
                {item.productName}
              </h3>
              <span className="font-semibold text-sm">
                {formatPrice(item.price)}
              </span>
            </div>
            <div className="px-2.5 pb-2.5">
              <Button
                className="w-full h-8 text-xs"
                size="sm"
                asChild
              >
                <Link to="/shop/products">
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                  View Product
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/account/wishlist")({
  component: AccountWishlistPage,
});
