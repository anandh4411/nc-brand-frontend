import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/wishlist-context";

// API-compatible product type
export interface ProductCardData {
  uuid?: string;
  id?: number;
  slug: string;
  name: string;
  basePrice: number;
  categoryName?: string;
  primaryImage?: string | null;
  colorCount?: number;
  isFeatured?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = product.id ? isInWishlist(product.id) : false;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageUrl = product.primaryImage || `https://picsum.photos/seed/${product.slug}/400/400`;
  const rating = product.averageRating || 0;

  return (
    <div className={cn("group bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow", className)}>
      <Link to={`/shop/products/${product.slug}` as any}>
        {/* Image - Compact 1:1 aspect ratio */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges - Top Left */}
          <div className="absolute top-1.5 left-1.5 flex gap-1">
            {product.isFeatured && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-[10px] px-1.5 py-0">Featured</Badge>
            )}
          </div>

          {/* Wishlist - Top Right */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7 rounded-full bg-white/80 hover:bg-white shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.id) {
                toggleWishlist({
                  productGroupId: product.id,
                  slug: product.slug,
                  name: product.name,
                  basePrice: product.basePrice,
                  imageUrl: product.primaryImage || undefined,
                  categoryName: product.categoryName || "Product",
                });
              }
            }}
          >
            <Heart className={cn("h-3.5 w-3.5", inWishlist ? "fill-red-500 text-red-500" : "text-gray-600")} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-2.5">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {product.categoryName || "Product"}
            </span>
            {rating > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-1 min-h-[2.25rem]">
            {product.name}
          </h3>

          {/* Color Count */}
          {product.colorCount && product.colorCount > 1 && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-[10px] text-muted-foreground">
                {product.colorCount} colors available
              </span>
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-sm">{formatPrice(product.basePrice)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
