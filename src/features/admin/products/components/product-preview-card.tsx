// src/features/admin/products/components/product-preview-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Star } from "lucide-react";

interface ColorVariant {
  colorCode: string;
  colorName: string;
  sizes: { size: string; priceAdjustment: number }[];
}

interface ProductPreviewCardProps {
  name: string;
  basePrice: number;
  fabricType?: string;
  pattern?: string;
  isFeatured?: boolean;
  colorVariants: ColorVariant[];
  imagePreview?: string;
}

export function ProductPreviewCard({
  name,
  basePrice,
  fabricType,
  pattern,
  isFeatured,
  colorVariants,
  imagePreview,
}: ProductPreviewCardProps) {
  const hasName = name.trim().length > 0;
  const hasPrice = basePrice > 0;
  const selectedColor = colorVariants[0];

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">Live Preview</h4>
        <Badge variant="outline" className="text-xs">
          Shop Card
        </Badge>
      </div>

      <Card className="w-full max-w-[280px] mx-auto border-2 border-dashed border-primary/20 bg-card/50 overflow-hidden">
        {/* Image / Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
              <Package className="h-16 w-16" />
              <span className="text-xs">Product Image</span>
            </div>
          )}

          {/* Featured badge */}
          {isFeatured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-xs gap-1">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {/* Color swatches */}
          {colorVariants.length > 0 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {colorVariants.slice(0, 4).map((cv, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: cv.colorCode }}
                  title={cv.colorName}
                />
              ))}
              {colorVariants.length > 4 && (
                <div className="w-5 h-5 rounded-full bg-muted border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-medium">
                  +{colorVariants.length - 4}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
          {/* Name */}
          <h3 className="font-semibold text-foreground line-clamp-1">
            {hasName ? name : (
              <span className="text-muted-foreground/50 italic">Product name</span>
            )}
          </h3>

          {/* Attributes */}
          {(fabricType || pattern) && (
            <div className="flex flex-wrap gap-1">
              {fabricType && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {fabricType}
                </Badge>
              )}
              {pattern && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {pattern}
                </Badge>
              )}
            </div>
          )}

          {/* Sizes */}
          {selectedColor && selectedColor.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedColor.sizes.map((s, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                >
                  {s.size}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-foreground">
              {hasPrice ? `₹${basePrice.toLocaleString()}` : (
                <span className="text-muted-foreground/50 italic">₹0</span>
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground">
        This is how customers will see your product
      </p>
    </div>
  );
}
