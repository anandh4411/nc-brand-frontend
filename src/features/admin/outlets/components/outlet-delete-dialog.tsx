// src/features/admin/outlets/components/outlet-delete-dialog.tsx
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import type { Outlet } from "@/types/dto/outlet.dto";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outlet: Outlet;
  onConfirm?: () => void;
  isDeleting?: boolean;
}

export function OutletDeleteDialog({
  open,
  onOpenChange,
  outlet,
  onConfirm,
  isDeleting: externalIsDeleting,
}: Props) {
  const [value, setValue] = useState("");
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);
  const isDeleting = externalIsDeleting ?? internalIsDeleting;

  const handleDelete = async () => {
    if (value.trim() !== outlet.name) return;

    if (onConfirm) {
      onConfirm();
      setValue("");
      return;
    }

    setInternalIsDeleting(true);
    try {
      console.log("Delete outlet:", outlet.uuid);
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Outlet deleted successfully");
      onOpenChange(false);
      setValue("");
    } catch (error) {
      toast.error("Failed to delete outlet");
      console.error("Failed to delete outlet:", error);
    } finally {
      setInternalIsDeleting(false);
    }
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
      disabled={value.trim() !== outlet.name || isDeleting}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete Outlet
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{outlet.name}</span>?
            <br />
            This action will permanently remove outlet{" "}
            <span className="font-bold font-mono">{outlet.code}</span> from the
            system. This cannot be undone.
          </p>

          <Label className="my-2">
            Outlet Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter outlet name to confirm deletion"
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              This will also affect all inventory and shipment records
              associated with this outlet.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? "Deleting..." : "Delete"}
      destructive
    />
  );
}
