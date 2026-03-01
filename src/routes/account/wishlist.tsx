import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";

function AccountWishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

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
        <Button variant="ghost" size="sm" onClick={clearWishlist} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => (
          <div
            key={item.productGroupId}
            className="group bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link to={`/shop/products/${item.slug}` as any}>
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={item.imageUrl || "/placeholder-product.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 rounded-full bg-white/80 hover:bg-white shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(item.productGroupId);
                  }}
                >
                  <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                </Button>
              </div>

              <div className="p-2.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {item.categoryName}
                </span>
                <h3 className="font-medium text-sm leading-tight line-clamp-2 mt-0.5 mb-1.5 min-h-[2.25rem]">
                  {item.name}
                </h3>
                <span className="font-semibold text-sm">{formatPrice(item.basePrice)}</span>
              </div>
            </Link>

            <div className="px-2.5 pb-2.5">
              <Button
                className="w-full h-8 text-xs"
                size="sm"
                onClick={() => router.navigate({ to: `/shop/products/${item.slug}` as any })}
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                View Product
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
