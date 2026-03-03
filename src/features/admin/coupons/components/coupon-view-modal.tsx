import { Percent, Calendar } from "lucide-react";
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
import type { Coupon } from "@/api/endpoints/admin";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
};

export function CouponViewModal({ open, onOpenChange, coupon }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Coupon Details
          </DialogTitle>
          <DialogDescription>View coupon information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-mono font-bold text-lg">{coupon.code}</h3>
              <p className="text-sm text-muted-foreground">
                {coupon.type === "PERCENTAGE"
                  ? `${coupon.value}% off`
                  : `₹${coupon.value} off`}
              </p>
            </div>
            <Badge variant={coupon.isActive ? "success" : "secondary"}>
              {coupon.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Min Order Value</p>
              <p className="text-muted-foreground">
                {coupon.minOrderValue ? `₹${coupon.minOrderValue}` : "None"}
              </p>
            </div>
            <div>
              <p className="font-medium">Max Discount</p>
              <p className="text-muted-foreground">
                {coupon.maxDiscount ? `₹${coupon.maxDiscount}` : "None"}
              </p>
            </div>
            <div>
              <p className="font-medium">Usage</p>
              <p className="text-muted-foreground">
                {coupon.usedCount} / {coupon.usageLimit ?? "Unlimited"}
              </p>
            </div>
            <div>
              <p className="font-medium">Type</p>
              <Badge variant={coupon.type === "PERCENTAGE" ? "default" : "secondary"}>
                {coupon.type === "PERCENTAGE" ? "Percentage" : "Fixed"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Valid From</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(coupon.validFrom)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Valid Until</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(coupon.validUntil)}
                </p>
              </div>
            </div>
          </div>

          {coupon.createdAt && (
            <>
              <Separator />
              <div className="text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(coupon.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
