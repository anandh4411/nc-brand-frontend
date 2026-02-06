// src/features/admin/inventory/components/stock-adjustment-modal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Plus, Minus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectDropdown } from "@/components/select-dropdown";
import { Badge } from "@/components/ui/badge";
import { adjustmentReasons } from "../data/mock-data";
import { useAdjustStock } from "@/api/hooks/admin";
import type { InventoryItem } from "@/types/dto/inventory.dto";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem;
}

const formSchema = z.object({
  adjustment: z.number().refine((val) => val !== 0, "Adjustment cannot be zero"),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
  batchNumber: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function StockAdjustmentModal({ open, onOpenChange, item }: Props) {
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const adjustStock = useAdjustStock();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adjustment: 0,
      reason: "",
      notes: "",
      batchNumber: item.batchNumber || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        adjustment: 0,
        reason: "",
        notes: "",
        batchNumber: item.batchNumber || "",
      });
      setAdjustmentType("add");
    }
  }, [item, open, form]);

  const onSubmit = async (values: FormData) => {
    const finalAdjustment =
      adjustmentType === "add" ? values.adjustment : -values.adjustment;

    adjustStock.mutate(
      {
        variantUuid: item.variant.uuid,
        data: {
          adjustmentQty: finalAdjustment,
          reason: values.reason + (values.notes ? ` - ${values.notes}` : '') + (values.batchNumber ? ` (Batch: ${values.batchNumber})` : ''),
        },
      },
      {
        onSuccess: () => {
          toast.success(
            `Stock ${adjustmentType === "add" ? "added" : "removed"} successfully`
          );
          form.reset();
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to adjust stock");
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = adjustStock.isPending;
  const adjustmentValue = form.watch("adjustment") || 0;
  const newQuantity =
    adjustmentType === "add"
      ? item.quantity + adjustmentValue
      : item.quantity - adjustmentValue;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Adjust Stock
          </DialogTitle>
          <DialogDescription>
            Adjust inventory quantity for this product variant.
          </DialogDescription>
        </DialogHeader>

        {/* Product Info */}
        <div className="p-3 bg-muted rounded-lg space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{item.variant.productName}</span>
            <Badge variant="outline">{item.variant.sku}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {item.variant.colorName} / {item.variant.size}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div>
              <span className="text-xs text-muted-foreground">Current:</span>
              <span className="ml-1 font-mono font-medium">{item.quantity}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">After:</span>
              <span
                className={`ml-1 font-mono font-medium ${
                  newQuantity < 0
                    ? "text-destructive"
                    : newQuantity <= item.lowStockThreshold
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {newQuantity}
              </span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            id="stock-adjustment-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Adjustment Type */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={adjustmentType === "add" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setAdjustmentType("add")}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Stock
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "remove" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setAdjustmentType("remove")}
              >
                <Minus className="h-4 w-4 mr-1" /> Remove Stock
              </Button>
            </div>

            <FormField
              control={form.control}
              name="adjustment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={adjustmentType === "remove" ? item.quantity : undefined}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Reason</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select reason"
                    items={adjustmentReasons}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batchNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. BATCH-2024-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Additional notes..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="stock-adjustment-form"
            disabled={isSubmitting || newQuantity < 0}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Adjustment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
