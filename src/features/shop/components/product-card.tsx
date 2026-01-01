import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/wishlist-context";
import type { ShopProduct } from "../data/mock-data";

interface ProductCardProps {
  product: ShopProduct;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
    : 0;

  const firstColor = product.colors[0];
  const imageUrl = firstColor?.images[0] || "/placeholder-product.jpg";

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productGroupId: product.id,
      name: product.name,
      basePrice: product.basePrice,
      imageUrl,
      categoryName: product.categoryName,
    });
  };

  return (
    <Card className={cn("group overflow-hidden border hover:shadow-lg transition-shadow", className)}>
      <Link to={`/shop/products/${product.slug}` as any}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNewArrival && (
              <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive">{discount}% OFF</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleWishlistClick}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                inWishlist && "fill-red-500 text-red-500"
              )}
            />
          </Button>

          {/* Quick Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              {product.colors.slice(0, 5).map((color) => (
                <div
                  key={color.id}
                  className="h-4 w-4 rounded-full border border-white/50"
                  style={{ backgroundColor: color.colorCode }}
                  title={color.colorName}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-white">+{product.colors.length - 5}</span>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground mb-1">{product.categoryName}</p>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPrice(product.basePrice)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
