import { Tag, Calendar, Package } from "lucide-react";
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
                Buy {offer.buyQuantity} Get {offer.getQuantity} Free
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

          {offer.productGroups && offer.productGroups.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Assigned Products ({offer.productGroups.length})
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {offer.productGroups.map((pg) => (
                    <Badge key={pg.uuid} variant="secondary">
                      {pg.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
