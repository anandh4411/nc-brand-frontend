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
import { mockOutlets } from "../../outlets/data/mock-data";
import { mockInventoryItems } from "../../inventory/data/mock-data";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shipmentItemSchema = z.object({
  productVariantId: z.number(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const formSchema = z.object({
  outletId: z.number({ required_error: "Outlet is required" }),
  items: z.array(shipmentItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ShipmentFormModal({ open, onOpenChange }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outletId: undefined,
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
        outletId: undefined,
        items: [],
        notes: "",
      });
    }
  }, [open, form]);

  const onSubmit = async (values: FormData) => {
    console.log("Create shipment:", values);
    toast.success("Shipment created successfully");
    form.reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const outletOptions = mockOutlets
    .filter((o) => o.isActive)
    .map((o) => ({ label: o.name, value: String(o.id) }));

  // Available inventory items not yet added
  const availableItems = mockInventoryItems.filter(
    (inv) => !fields.some((f) => f.productVariantId === inv.productVariantId)
  );

  const getItemInfo = (productVariantId: number) => {
    return mockInventoryItems.find((i) => i.productVariantId === productVariantId);
  };

  const isSubmitting = form.formState.isSubmitting;

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
                  name="outletId"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Destination Outlet</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value ? String(field.value) : ""}
                        onValueChange={(val) => field.onChange(Number(val))}
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
                          const inv = mockInventoryItems.find(
                            (i) => i.productVariantId === Number(val)
                          );
                          if (inv) {
                            append({
                              productVariantId: inv.productVariantId,
                              quantity: 1,
                            });
                          }
                        }}
                        placeholder="+ Add Item"
                        items={availableItems.map((inv) => ({
                          label: `${inv.productVariantSku} - ${inv.productName}`,
                          value: String(inv.productVariantId),
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
                      const itemInfo = getItemInfo(field.productVariantId);
                      return (
                        <div
                          key={field.id}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {itemInfo?.productName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-mono">
                                {itemInfo?.productVariantSku}
                              </span>
                              <span>•</span>
                              <span>{itemInfo?.colorName}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {itemInfo?.size}
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
