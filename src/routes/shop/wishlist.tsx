import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { getProductById } from "@/features/shop/data/mock-data";
import { toast } from "sonner";

function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (productGroupId: number) => {
    const product = getProductById(productGroupId);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    const firstColor = product.colors[0];
    const firstVariant = firstColor?.variants[0];

    if (!firstColor || !firstVariant) {
      toast.error("Product variant not available");
      return;
    }

    addToCart({
      productId: product.id,
      productGroupId: product.id,
      variantId: firstVariant.id,
      name: product.name,
      colorName: firstColor.colorName,
      size: firstVariant.size,
      price: product.basePrice + firstVariant.priceAdjustment,
      quantity: 1,
      imageUrl: firstColor.images[0],
      sku: firstVariant.sku,
      maxQuantity: firstVariant.stock,
    });
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            {items.length} item{items.length > 1 ? "s" : ""} saved
          </p>
        </div>
        <Button variant="ghost" onClick={clearWishlist} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card
            key={item.productGroupId}
            className="group overflow-hidden border hover:shadow-lg transition-shadow"
          >
            <Link to={`/shop/products/${getProductById(item.productGroupId)?.slug || ""}` as any} >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={item.imageUrl || "/placeholder-product.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Remove Button */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(item.productGroupId);
                  }}
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
              </div>

              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  {item.categoryName}
                </p>
                <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{formatPrice(item.basePrice)}</span>
                </div>
              </CardContent>
            </Link>

            {/* Add to Cart Button */}
            <div className="px-4 pb-4">
              <Button
                className="w-full"
                size="sm"
                onClick={() => handleAddToCart(item.productGroupId)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/shop/wishlist")({
  component: WishlistPage,
});
