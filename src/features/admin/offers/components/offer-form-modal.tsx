import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, Plus, Save, X } from "lucide-react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: Offer | null;
  mode: "add" | "edit";
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  buyQuantity: z.coerce.number().int().min(1, "Must be at least 1"),
  getQuantity: z.coerce.number().int().min(1, "Must be at least 1"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const toDateInputValue = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 16);
};

export function OfferFormModal({ open, onOpenChange, offer, mode }: Props) {
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const { data: productGroupsResponse } = useAdminProductGroups();

  const [selectedProductUuids, setSelectedProductUuids] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

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
      buyQuantity: 1,
      getQuantity: 1,
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
        buyQuantity: offer?.buyQuantity || 1,
        getQuantity: offer?.getQuantity || 1,
        startDate: toDateInputValue(offer?.startDate) || "",
        endDate: toDateInputValue(offer?.endDate) || "",
        isActive: offer?.isActive ?? true,
      });
      setSelectedProductUuids(
        offer?.productGroups?.map((pg) => pg.uuid) || []
      );
    }
  }, [offer, open, form]);

  const toggleProduct = (uuid: string) => {
    setSelectedProductUuids((prev) =>
      prev.includes(uuid) ? prev.filter((u) => u !== uuid) : [...prev, uuid]
    );
  };

  const removeProduct = (uuid: string) => {
    setSelectedProductUuids((prev) => prev.filter((u) => u !== uuid));
  };

  const onSubmit = async (values: FormData) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      buyQuantity: values.buyQuantity,
      getQuantity: values.getQuantity,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      productGroupUuids: selectedProductUuids,
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
    setSelectedProductUuids([]);
    onOpenChange(false);
  };

  const isSubmitting = createOffer.isPending || updateOffer.isPending;

  const selectedProducts = productGroups.filter((pg) =>
    selectedProductUuids.includes(pg.uuid)
  );

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
              ? "Create a new buy-X-get-Y offer."
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
                    <Input placeholder="e.g. Buy 2 Get 1 Free" {...field} />
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buyQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="getQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Get Free Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            {/* Product Assignment */}
            <div className="space-y-2">
              <FormLabel>Assign Products</FormLabel>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-muted-foreground"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {selectedProductUuids.length > 0
                      ? `${selectedProductUuids.length} product(s) selected`
                      : "Select products..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search products..." />
                    <CommandList>
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup>
                        {productGroups.map((pg) => (
                          <CommandItem
                            key={pg.uuid}
                            value={pg.name}
                            onSelect={() => toggleProduct(pg.uuid)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div
                                className={`h-4 w-4 border rounded flex items-center justify-center ${
                                  selectedProductUuids.includes(pg.uuid)
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-input"
                                }`}
                              >
                                {selectedProductUuids.includes(pg.uuid) && (
                                  <span className="text-xs">✓</span>
                                )}
                              </div>
                              <span>{pg.name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedProducts.map((pg) => (
                    <Badge
                      key={pg.uuid}
                      variant="secondary"
                      className="gap-1"
                    >
                      {pg.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeProduct(pg.uuid)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
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
