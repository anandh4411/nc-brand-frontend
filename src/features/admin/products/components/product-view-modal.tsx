// src/features/admin/products/components/product-view-modal.tsx
import { Package, Star, Calendar, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProductGroup } from "@/types/dto/product-catalog.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductGroup;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export function ProductViewModal({ open, onOpenChange, product }: Props) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
          </DialogTitle>
          <DialogDescription>
            View complete product information
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            {/* Header with status */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  {product.isFeatured && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  /{product.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant={product.isActive ? "success" : "secondary"}>
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
                {product.isFeatured && (
                  <Badge variant="outline">Featured</Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground">
                  {product.category?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Base Price</p>
                <p className="text-sm font-mono font-semibold">
                  {formatPrice(product.basePrice)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Attributes */}
            {product.attributes && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Fabric Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {product.attributes.fabricType || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Pattern</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {product.attributes.pattern || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Care Instructions</p>
                  <p className="text-sm text-muted-foreground">
                    {product.attributes.careInstructions || "N/A"}
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Color Variants */}
            <div>
              <p className="text-sm font-medium mb-3">
                Color Variants ({product.colorVariants.length})
              </p>
              <div className="space-y-3">
                {product.colorVariants.map((color) => (
                  <div
                    key={color.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <div
                      className="h-8 w-8 rounded-full border"
                      style={{ backgroundColor: color.colorCode }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{color.colorName}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {color.colorCode}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {color.sizeVariants.map((size) => (
                          <Badge key={size.id} variant="outline" className="text-xs">
                            {size.size}
                            {size.priceAdjustment > 0 && (
                              <span className="ml-1 text-green-600">
                                +{formatPrice(size.priceAdjustment)}
                              </span>
                            )}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        SKUs: {color.sizeVariants.map((s) => s.sku).join(", ")}
                      </p>

                      {/* Product Images */}
                      {color.images && color.images.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            Images ({color.images.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {color.images.map((img) => (
                              <div
                                key={img.uuid}
                                className="relative w-14 h-14 rounded-md overflow-hidden border"
                              >
                                <img
                                  src={img.imageUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                {img.isPrimary && (
                                  <div className="absolute top-0.5 left-0.5">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(product.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Updated</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(product.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
