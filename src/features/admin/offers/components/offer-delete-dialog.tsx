import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { Offer } from "@/api/endpoints/admin";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function OfferDeleteDialog({
  open,
  onOpenChange,
  offer,
  onConfirm,
  isDeleting,
}: Props) {
  const [value, setValue] = useState("");

  const handleDelete = () => {
    if (value.trim() !== offer.name) return;
    onConfirm();
    setValue("");
  };

  const handleClose = (open: boolean) => {
    setValue("");
    onOpenChange(open);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={handleClose}
      handleConfirm={handleDelete}
      disabled={value.trim() !== offer.name || isDeleting}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete Offer
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete offer{" "}
            <span className="font-bold">{offer.name}</span>?
            <br />
            This will also remove all product assignments. This action cannot be
            undone.
          </p>
          <Label className="my-2">
            Offer Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter offer name to confirm"
            />
          </Label>
        </div>
      }
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      destructive
    />
  );
}
