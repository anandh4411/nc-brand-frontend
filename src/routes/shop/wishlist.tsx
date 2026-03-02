import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useWishlist, useRemoveFromWishlist, useAddToCart } from "@/api/hooks/shop";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

function WishlistPage() {
  const { isAuthenticated, isCustomer } = useAuth();
  const { data: wishlistData, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const items = wishlistData?.data || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRemove = (variantUuid: string) => {
    removeFromWishlist.mutate(variantUuid);
  };

  const handleAddToCart = (item: any) => {
    addToCart.mutate(
      { variantUuid: item.variantUuid, quantity: 1 } as any,
      {
        onSuccess: () => {
          toast.success("Added to cart");
        },
      }
    );
  };

  // Not logged in as customer
  if (!isAuthenticated || !isCustomer) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to view your wishlist.
          </p>
          <Button asChild>
            <Link to="/sign-in" search={{ type: "customer" }}>
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty wishlist
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
        {items.map((item: any) => (
          <div
            key={item.variantUuid}
            className="group bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link to={`/shop/products/${item.productSlug}` as any}>
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={item.imageUrl || `https://picsum.photos/seed/${item.productSlug}/400/400`}
                  alt={item.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Remove from Wishlist */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 rounded-full bg-white/80 hover:bg-white shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(item.variantUuid);
                  }}
                  disabled={removeFromWishlist.isPending}
                >
                  {removeFromWishlist.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                  )}
                </Button>
              </div>

              {/* Content */}
              <div className="p-2.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {item.colorName} | {item.size}
                </span>
                <h3 className="font-medium text-sm leading-tight line-clamp-2 mt-0.5 mb-1.5 min-h-[2.25rem]">
                  {item.productName}
                </h3>
                <span className="font-semibold text-sm">{formatPrice(item.price)}</span>
              </div>
            </Link>

            {/* Add to Cart */}
            <div className="px-2.5 pb-2.5">
              <Button
                className="w-full h-8 text-xs"
                size="sm"
                onClick={() => handleAddToCart(item)}
                disabled={addToCart.isPending}
              >
                {addToCart.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                ) : (
                  <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                )}
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/shop/wishlist")({
  component: WishlistPage,
});
