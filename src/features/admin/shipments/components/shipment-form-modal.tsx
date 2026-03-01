// src/features/admin/shipments/components/shipment-form-modal.tsx
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Truck, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAdminOutlets, useAdminInventory, useCreateShipment } from "@/api/hooks/admin";
import type { Outlet } from "@/types/dto/outlet.dto";
import type { InventoryItem } from "@/types/dto/inventory.dto";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shipmentItemSchema = z.object({
  variantUuid: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const formSchema = z.object({
  outletUuid: z.string({ required_error: "Outlet is required" }),
  items: z.array(shipmentItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ShipmentFormModal({ open, onOpenChange }: Props) {
  const { data: outletsResponse } = useAdminOutlets();
  const { data: inventoryResponse } = useAdminInventory();
  const createShipment = useCreateShipment();

  const outlets = (Array.isArray(outletsResponse?.data) ? outletsResponse?.data : (outletsResponse?.data as any)?.outlets || []) as Outlet[];
  const inventoryItems = (Array.isArray(inventoryResponse?.data) ? inventoryResponse?.data : (inventoryResponse?.data as any)?.inventories || (inventoryResponse?.data as any)?.items || []) as InventoryItem[];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outletUuid: "",
      items: [],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (open) {
      form.reset({
        outletUuid: "",
        items: [],
        notes: "",
      });
    }
  }, [open, form]);

  const onSubmit = async (values: FormData) => {
    createShipment.mutate(
      {
        outletUuid: values.outletUuid,
        items: values.items,
      },
      {
        onSuccess: () => {
          toast.success("Shipment created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to create shipment");
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const outletOptions = outlets
    .filter((o: any) => o.isActive)
    .map((o: any) => ({ label: o.name, value: o.uuid }));

  // Available inventory items not yet added
  const availableItems = inventoryItems.filter(
    (inv: any) => !fields.some((f) => f.variantUuid === (inv.variant?.uuid || inv.productVariant?.uuid || inv.uuid))
  );

  const getItemInfo = (variantUuid: string) => {
    return inventoryItems.find((i: any) => (i.variant?.uuid || i.productVariant?.uuid || i.uuid) === variantUuid);
  };

  const isSubmitting = createShipment.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh]">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Create Shipment
          </DialogTitle>
          <DialogDescription>
            Create a new shipment to send inventory to an outlet.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="shipment-form" onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 px-1">
                <FormField
                  control={form.control}
                  name="outletUuid"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Destination Outlet</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value || ""}
                        onValueChange={field.onChange}
                        placeholder="Select outlet"
                        items={outletOptions}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Items</FormLabel>
                    {availableItems.length > 0 && (
                      <SelectDropdown
                        defaultValue=""
                        onValueChange={(val) => {
                          const inv = inventoryItems.find(
                            (i: any) => (i.variant?.uuid || i.productVariant?.uuid || i.uuid) === val
                          );
                          if (inv) {
                            append({
                              variantUuid: (inv as any).variant?.uuid || (inv as any).productVariant?.uuid || (inv as any).uuid,
                              quantity: 1,
                            });
                          }
                        }}
                        placeholder="+ Add Item"
                        items={availableItems.map((inv: any) => ({
                          label: `${inv.variant?.sku || inv.productVariant?.sku || inv.sku} - ${inv.variant?.productName || inv.productName || 'Product'}`,
                          value: inv.variant?.uuid || inv.productVariant?.uuid || inv.uuid,
                        }))}
                        className="w-[150px]"
                      />
                    )}
                  </div>

                  {fields.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                      No items added. Select items from the dropdown above.
                    </div>
                  )}

                  <div className="space-y-2">
                    {fields.map((field, index) => {
                      const itemInfo = getItemInfo(field.variantUuid);
                      return (
                        <div
                          key={field.id}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {(itemInfo as any)?.variant?.productName || (itemInfo as any)?.productName || 'Product'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-mono">
                                {(itemInfo as any)?.variant?.sku || (itemInfo as any)?.sku}
                              </span>
                              <span>•</span>
                              <span>{(itemInfo as any)?.variant?.colorName || (itemInfo as any)?.colorName}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {(itemInfo as any)?.variant?.size || (itemInfo as any)?.size}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Available: {itemInfo?.quantity}
                            </p>
                          </div>
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field: qtyField }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={itemInfo?.quantity}
                                    className="w-20"
                                    {...qtyField}
                                    onChange={(e) =>
                                      qtyField.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  {form.formState.errors.items && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.items.message}
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder="Any additional notes..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
          </form>
        </Form>

        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="shipment-form" disabled={isSubmitting}>
            <Plus className="mr-2 h-4 w-4" />
            {isSubmitting ? "Creating..." : "Create Shipment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
