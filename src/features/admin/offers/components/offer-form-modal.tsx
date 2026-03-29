import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, Plus, Save, ChevronsUpDown, Check } from "lucide-react";
import { useEffect, useState } from "react";
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
import { useCreateOffer, useUpdateOffer, useAdminProductGroups } from "@/api/hooks/admin";
import type { Offer } from "@/api/endpoints/admin";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";

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
      buyQuantity: 1,
      freeProductGroupUuid: "",
      freeQuantity: 1,
      startDate: "",
      endDate: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: offer?.name || "",
        description: offer?.description || "",
        targetProductGroupUuid: offer?.targetProductGroup?.uuid || "",
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
  const watchedTarget = form.watch("targetProductGroupUuid");
  const watchedFree = form.watch("freeProductGroupUuid");
  const watchedBuyQty = form.watch("buyQuantity");
  const watchedFreeQty = form.watch("freeQuantity");

  const targetName = productGroups.find((p) => p.uuid === watchedTarget)?.name;
  const freeName = productGroups.find((p) => p.uuid === watchedFree)?.name;

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

            {/* Target Product (what customer buys) */}
            <FormField
              control={form.control}
              name="targetProductGroupUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Product (Customer Buys)</FormLabel>
                  <FormControl>
                    <ProductCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      products={productGroups}
                      placeholder="Select the product customer must buy..."
                    />
                  </FormControl>
                  <FormDescription>
                    The product the customer needs to purchase to activate the offer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {/* Free Product (what customer gets for free) */}
            <FormField
              control={form.control}
              name="freeProductGroupUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free Product (Customer Gets)</FormLabel>
                  <FormControl>
                    <ProductCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      products={productGroups}
                      placeholder="Select the product to give for free..."
                    />
                  </FormControl>
                  <FormDescription>
                    The product the customer receives for free. Can be the same or different product.
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

            {/* Live Summary */}
            {targetName && freeName && (
              <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                <p className="font-medium mb-1">Offer Summary:</p>
                <p className="text-muted-foreground">
                  Buy <span className="font-semibold text-foreground">{watchedBuyQty}</span>{" "}
                  <span className="font-semibold text-foreground">{targetName}</span>,
                  get <span className="font-semibold text-foreground">{watchedFreeQty}</span>{" "}
                  <span className="font-semibold text-foreground">{freeName}</span> free.
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
