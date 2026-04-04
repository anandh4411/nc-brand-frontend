import { Tag, Calendar, Package, ArrowRight } from "lucide-react";
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
import type { Offer } from "@/api/endpoints/admin";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
};

function ProductDetail({ label, productGroup, product, variant, quantity }: {
  label: string;
  productGroup?: { name: string };
  product?: { colorName: string; colorCode: string } | null;
  variant?: { size: string } | null;
  quantity: number;
}) {
  return (
    <div className="flex-1 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <Badge variant={label === "Customer Buys" ? "outline" : "secondary"} className="text-xs">
        {productGroup?.name || "N/A"}
      </Badge>
      {product && (
        <div className="flex items-center justify-center gap-1 mt-1">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full border"
            style={{ backgroundColor: product.colorCode }}
          />
          <span className="text-xs text-muted-foreground">{product.colorName}</span>
        </div>
      )}
      {variant && (
        <p className="text-xs text-muted-foreground mt-0.5">
          Size: {variant.size}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        x{quantity}
      </p>
    </div>
  );
}

export function OfferViewModal({ open, onOpenChange, offer }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Offer Details
          </DialogTitle>
          <DialogDescription>View offer information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{offer.name}</h3>
              <p className="text-sm text-muted-foreground">
                Buy {offer.buyQuantity} Get {offer.freeQuantity} Free
              </p>
            </div>
            <Badge variant={offer.isActive ? "success" : "secondary"}>
              {offer.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {offer.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">
                  {offer.description}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Target & Free Products */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Offer Configuration</p>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <ProductDetail
                label="Customer Buys"
                productGroup={offer.targetProductGroup}
                product={offer.targetProduct}
                variant={offer.targetVariant}
                quantity={offer.buyQuantity}
              />
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              <ProductDetail
                label="Gets Free"
                productGroup={offer.freeProductGroup}
                product={null}
                variant={null}
                quantity={offer.freeQuantity}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Start Date</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(offer.startDate)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">End Date</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(offer.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
