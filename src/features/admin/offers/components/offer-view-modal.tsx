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

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Offer Configuration</p>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex-1 text-center">
                <p className="text-xs text-muted-foreground mb-1">Customer Buys</p>
                <Badge variant="outline" className="text-xs">
                  {offer.targetProductGroup?.name || "N/A"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">x{offer.buyQuantity}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 text-center">
                <p className="text-xs text-muted-foreground mb-1">Gets Free</p>
                <Badge variant="secondary" className="text-xs">
                  {offer.freeProductGroup?.name || "N/A"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">x{offer.freeQuantity}</p>
              </div>
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
