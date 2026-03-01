import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { Coupon } from "@/api/endpoints/admin";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function CouponDeleteDialog({
  open,
  onOpenChange,
  coupon,
  onConfirm,
  isDeleting,
}: Props) {
  const [value, setValue] = useState("");

  const handleDelete = () => {
    if (value.trim() !== coupon.code) return;
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
      disabled={value.trim() !== coupon.code || isDeleting}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete Coupon
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete coupon{" "}
            <span className="font-mono font-bold">{coupon.code}</span>?
            <br />
            This action cannot be undone.
          </p>
          <Label className="my-2">
            Coupon Code:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value.toUpperCase())}
              placeholder="Enter coupon code to confirm"
            />
          </Label>
        </div>
      }
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      destructive
    />
  );
}
