// src/features/admin/outlets/components/outlet-view-modal.tsx
import { Store, MapPin, Phone, Mail, Calendar, Building } from "lucide-react";
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
import type { Outlet } from "@/types/dto/outlet.dto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outlet: Outlet;
}

export function OutletViewModal({ open, onOpenChange, outlet }: Props) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Outlet Details
          </DialogTitle>
          <DialogDescription>
            View complete outlet information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header with status */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{outlet.name}</h3>
              <p className="text-sm text-muted-foreground font-mono">
                {outlet.code}
              </p>
            </div>
            <Badge variant={outlet.isActive ? "default" : "secondary"}>
              {outlet.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <Separator />

          {/* Location Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  {outlet.address}
                  <br />
                  {outlet.city}, {outlet.state} - {outlet.pincode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{outlet.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{outlet.email}</p>
              </div>
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
                  {formatDate(outlet.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Updated</p>
                <p className="text-muted-foreground text-xs">
                  {formatDate(outlet.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
