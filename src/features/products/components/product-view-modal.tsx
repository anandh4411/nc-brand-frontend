// src/features/products/components/product-view-modal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ProductData } from "@/types/dto/product.dto";
import { format } from "date-fns";
import { Package, Star, Calendar, ImageOff } from "lucide-react";

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData;
}

export const ProductViewModal = ({
  isOpen,
  onClose,
  product,
}: ProductViewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          {product.image ? (
            <div className="h-48 rounded-lg overflow-hidden bg-muted border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="h-48 rounded-lg bg-muted border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ImageOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No image available</p>
              </div>
            </div>
          )}

          {/* Name and Badge */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              {product.isPopular && (
                <Badge className="bg-blue-500">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-foreground">
            ₹{product.price}
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Dates */}
          <div className="flex gap-4 pt-4 border-t text-xs text-muted-foreground">
            <div>
              <Calendar className="w-3 h-3 inline mr-1" />
              Created: {product.createdAt ? format(new Date(product.createdAt), "MMM dd, yyyy") : 'N/A'}
            </div>
            <div>Updated: {product.updatedAt ? format(new Date(product.updatedAt), "MMM dd, yyyy") : 'N/A'}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
