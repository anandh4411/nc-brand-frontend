import { Link } from "@tanstack/react-router";
import { Heart, Star, Palette, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// import { useWishlist } from "@/context/wishlist-context"; // Wishlist disabled - has bugs

// API-compatible product type
export interface ProductCardData {
  uuid?: string;
  id?: number;
  slug: string;
  name: string;
  basePrice: number;
  categoryName?: string | null;
  primaryImage?: string | null;
  colorName?: string;
  colorCode?: string | null;
  colorCount?: number;
  isFeatured?: boolean;
  hasOffer?: boolean;
  offerText?: string | null;
  fabricType?: string | null;
  pattern?: string | null;
  colors?: { colorName: string; colorCode: string | null }[];
  sizes?: string[];
  averageRating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  // Wishlist disabled - has bugs
  // const { toggleWishlist, isInWishlist } = useWishlist();
  // const inWishlist = product.id ? isInWishlist(product.id) : false;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageUrl = product.primaryImage || "/placeholder.svg";
  const rating = product.averageRating || 0;
  const colors = product.colors || [];
  const sizes = product.sizes || [];
  const colorCount = product.colorCount || colors.length;

  return (
    <div className={cn("group bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow", className)}>
      <Link to={`/shop/products/${product.slug}` as any}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
          />

          {/* Badges - Top Left */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {product.isFeatured && (
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-[10px] px-1.5 py-0 gap-1">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </Badge>
            )}
            {product.hasOffer && product.offerText && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-1.5 py-0">
                {product.offerText}
              </Badge>
            )}
          </div>

          {/* Wishlist disabled - has bugs */}

          {/* Color swatches - Bottom Left of image */}
          {colors.length > 0 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {colors.slice(0, 4).map((c, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: c.colorCode || "#ccc" }}
                  title={c.colorName}
                />
              ))}
              {colors.length > 4 && (
                <div className="w-5 h-5 rounded-full bg-muted border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-medium">
                  +{colors.length - 4}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-2.5 space-y-1.5">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between">
            {product.categoryName && (
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {product.categoryName}
              </span>
            )}
            {rating > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-1">
            {product.name}
          </h3>

          {/* Attributes (fabricType, pattern) */}
          {(product.fabricType || product.pattern) && (
            <div className="flex flex-wrap gap-1">
              {product.fabricType && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {product.fabricType}
                </Badge>
              )}
              {product.pattern && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {product.pattern}
                </Badge>
              )}
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {sizes.map((size, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                >
                  {size}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-base font-bold text-foreground">
              {formatPrice(product.basePrice)}
            </span>
          </div>

          {/* Summary footer */}
          {(colorCount > 0 || sizes.length > 0) && (
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1 border-t">
              {colorCount > 0 && (
                <span className="flex items-center gap-1">
                  <Palette className="h-3 w-3" />
                  {colorCount} color{colorCount > 1 ? "s" : ""}
                </span>
              )}
              {sizes.length > 0 && (
                <span className="flex items-center gap-1">
                  <Ruler className="h-3 w-3" />
                  {sizes.length} size{sizes.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
