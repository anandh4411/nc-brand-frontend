import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
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
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

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

  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];
  const imageUrl = selectedColor?.images[0] || "/placeholder-product.jpg";

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

  const handleColorClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColorIndex(index);
  };

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
            {product.isNewArrival && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-[10px] px-1.5 py-0">New</Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{discount}%</Badge>
            )}
          </div>

          {/* Wishlist - Top Right */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7 rounded-full bg-white/80 hover:bg-white shadow-sm"
            onClick={handleWishlistClick}
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5",
                inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </Button>
        </div>

        {/* Content */}
        <div className="p-2.5">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-medium">{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-1 min-h-[2.25rem]">
            {product.name}
          </h3>

          {/* Color Swatches */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1 mb-2">
              {product.colors.slice(0, 5).map((color, index) => (
                <button
                  key={color.id}
                  onClick={(e) => handleColorClick(e, index)}
                  className={cn(
                    "h-5 w-5 rounded-full border-2 transition-all cursor-pointer",
                    selectedColorIndex === index
                      ? "border-primary scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color.colorCode }}
                  title={color.colorName}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[10px] text-muted-foreground">+{product.colors.length - 5}</span>
              )}
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-sm">{formatPrice(product.basePrice)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
