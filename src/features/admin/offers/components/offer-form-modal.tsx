import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, Plus, Save, ChevronsUpDown, Check } from "lucide-react";
import { useEffect, useMemo } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateOffer, useUpdateOffer, useAdminProductGroups, useAdminProductGroup } from "@/api/hooks/admin";
import type { Offer } from "@/api/endpoints/admin";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: Offer | null;
  mode: "add" | "edit";
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  targetProductGroupUuid: z.string().min(1, "Target product is required"),
  targetProductUuid: z.string().optional(),
  targetVariantUuid: z.string().optional(),
  buyQuantity: z.coerce.number().int().min(1, "Must be at least 1"),
  freeProductGroupUuid: z.string().min(1, "Free product is required"),
  freeQuantity: z.coerce.number().int().min(1, "Must be at least 1"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const toDateInputValue = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 16);
};

function ProductCombobox({
  value,
  onValueChange,
  products,
  placeholder,
  disabled,
}: {
  value: string;
  onValueChange: (uuid: string) => void;
  products: Array<{ uuid: string; name: string }>;
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedProduct = products.find((p) => p.uuid === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          {selectedProduct?.name || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search products..." />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              {products.map((pg) => (
                <CommandItem
                  key={pg.uuid}
                  value={pg.name}
                  onSelect={() => {
                    onValueChange(pg.uuid);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === pg.uuid ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {pg.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function OfferFormModal({ open, onOpenChange, offer, mode }: Props) {
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const { data: productGroupsResponse } = useAdminProductGroups();

  const productGroups = (
    (productGroupsResponse?.data as any)?.productGroups ||
    productGroupsResponse?.data ||
    []
  ) as Array<{ uuid: string; name: string }>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      targetProductGroupUuid: "",
      targetProductUuid: "",
      targetVariantUuid: "",
      buyQuantity: 1,
      freeProductGroupUuid: "",
      freeQuantity: 1,
      startDate: "",
      endDate: "",
      isActive: true,
    },
  });

  // Watch target product group to fetch colors/sizes
  const watchedTargetPgUuid = form.watch("targetProductGroupUuid");
  const watchedTargetProductUuid = form.watch("targetProductUuid");

  const { data: targetPgDetail } = useAdminProductGroup(watchedTargetPgUuid);

  const targetColors = useMemo(() => {
    const pg = (targetPgDetail?.data as any);
    if (!pg?.products) return [];
    return pg.products
      .filter((p: any) => p.isActive)
      .map((p: any) => ({ uuid: p.uuid, colorName: p.colorName, colorCode: p.colorCode, variants: p.variants }));
  }, [targetPgDetail]);

  const targetSizes = useMemo(() => {
    const color = targetColors.find((c: any) => c.uuid === watchedTargetProductUuid);
    if (!color?.variants) return [];
    return color.variants
      .filter((v: any) => v.isActive)
      .map((v: any) => ({ uuid: v.uuid, size: v.size }));
  }, [targetColors, watchedTargetProductUuid]);

  // Reset target child selections when parent changes
  useEffect(() => {
    if (!open) return;
    const currentTargetProduct = form.getValues("targetProductUuid");
    const validColor = targetColors.find((c: any) => c.uuid === currentTargetProduct);
    if (currentTargetProduct && !validColor) {
      form.setValue("targetProductUuid", "");
      form.setValue("targetVariantUuid", "");
    }
  }, [watchedTargetPgUuid, targetColors, open, form]);

  useEffect(() => {
    if (!open) return;
    const currentVariant = form.getValues("targetVariantUuid");
    const validVariant = targetSizes.find((s: any) => s.uuid === currentVariant);
    if (currentVariant && !validVariant) {
      form.setValue("targetVariantUuid", "");
    }
  }, [watchedTargetProductUuid, targetSizes, open, form]);

  useEffect(() => {
    if (open) {
      form.reset({
        name: offer?.name || "",
        description: offer?.description || "",
        targetProductGroupUuid: offer?.targetProductGroup?.uuid || "",
        targetProductUuid: offer?.targetProduct?.uuid || "",
        targetVariantUuid: offer?.targetVariant?.uuid || "",
        buyQuantity: offer?.buyQuantity || 1,
        freeProductGroupUuid: offer?.freeProductGroup?.uuid || "",
        freeQuantity: offer?.freeQuantity || 1,
        startDate: toDateInputValue(offer?.startDate) || "",
        endDate: toDateInputValue(offer?.endDate) || "",
        isActive: offer?.isActive ?? true,
      });
    }
  }, [offer, open, form]);

  const onSubmit = async (values: FormData) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      targetProductGroupUuid: values.targetProductGroupUuid,
      targetProductUuid: values.targetProductUuid || undefined,
      targetVariantUuid: values.targetVariantUuid || undefined,
      buyQuantity: values.buyQuantity,
      freeProductGroupUuid: values.freeProductGroupUuid,
      freeQuantity: values.freeQuantity,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
    };

    if (mode === "add") {
      createOffer.mutate(payload, {
        onSuccess: () => {
          toast.success("Offer created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to create offer"),
      });
    } else if (offer) {
      updateOffer.mutate(
        { uuid: offer.uuid, data: { ...payload, isActive: values.isActive } },
        {
          onSuccess: () => {
            toast.success("Offer updated successfully");
            form.reset();
            onOpenChange(false);
          },
          onError: () => toast.error("Failed to update offer"),
        }
      );
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = createOffer.isPending || updateOffer.isPending;

  // Watch for live summary
  const watchedFreePgUuid = form.watch("freeProductGroupUuid");
  const watchedBuyQty = form.watch("buyQuantity");
  const watchedFreeQty = form.watch("freeQuantity");

  const targetName = productGroups.find((p) => p.uuid === watchedTargetPgUuid)?.name;
  const freeName = productGroups.find((p) => p.uuid === watchedFreePgUuid)?.name;
  const targetColorName = targetColors.find((c: any) => c.uuid === watchedTargetProductUuid)?.colorName;
  const targetSizeName = targetSizes.find((s: any) => s.uuid === form.watch("targetVariantUuid"))?.size;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {mode === "add" ? "Add Offer" : "Edit Offer"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new buy-X-get-Y-free offer."
              : "Update offer details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="offer-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-h-[60vh] overflow-y-auto px-1"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Buy 2 Shirts Get 1 Handkerchief Free" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Optional description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ===== TARGET PRODUCT SECTION ===== */}
            <div className="space-y-3 rounded-lg border p-3">
              <p className="text-sm font-medium">Target Product (Customer Buys)</p>

              <FormField
                control={form.control}
                name="targetProductGroupUuid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <ProductCombobox
                        value={field.value}
                        onValueChange={field.onChange}
                        products={productGroups}
                        placeholder="Select the product customer must buy..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="targetProductUuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        disabled={targetColors.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={targetColors.length === 0 ? "Select product first" : "Select color"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {targetColors.map((color: any) => (
                            <SelectItem key={color.uuid} value={color.uuid}>
                              <span className="flex items-center gap-2">
                                <span
                                  className="inline-block h-3 w-3 rounded-full border"
                                  style={{ backgroundColor: color.colorCode }}
                                />
                                {color.colorName}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetVariantUuid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        disabled={targetSizes.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={targetSizes.length === 0 ? "Select color first" : "Select size"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {targetSizes.map((size: any) => (
                            <SelectItem key={size.uuid} value={size.uuid}>
                              {size.size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="buyQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormDescription>
                      How many of the target product the customer must buy.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ===== FREE PRODUCT SECTION (no color/size — customer chooses) ===== */}
            <div className="space-y-3 rounded-lg border p-3">
              <p className="text-sm font-medium">Free Product (Customer Gets)</p>

              <FormField
                control={form.control}
                name="freeProductGroupUuid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <ProductCombobox
                        value={field.value}
                        onValueChange={field.onChange}
                        products={productGroups}
                        placeholder="Select the product to give for free..."
                      />
                    </FormControl>
                    <FormDescription>
                      Customer will choose their preferred color and size at checkout.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freeQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Free Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormDescription>
                      How many of the free product to give.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Live Summary */}
            {targetName && freeName && (
              <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                <p className="font-medium mb-1">Offer Summary:</p>
                <p className="text-muted-foreground">
                  Buy <span className="font-semibold text-foreground">{watchedBuyQty}</span>{" "}
                  <span className="font-semibold text-foreground">{targetName}</span>
                  {targetColorName && (
                    <span className="text-foreground"> ({targetColorName}{targetSizeName ? `, ${targetSizeName}` : ""})</span>
                  )}
                  , get <span className="font-semibold text-foreground">{watchedFreeQty}</span>{" "}
                  <span className="font-semibold text-foreground">{freeName}</span>
                  {" "}free <span className="text-xs">(customer picks color/size)</span>.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {mode === "edit" && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Status</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value ? "Offer is active" : "Offer is inactive"}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="offer-form" disabled={isSubmitting}>
            {mode === "add" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Adding..." : "Add Offer"}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
