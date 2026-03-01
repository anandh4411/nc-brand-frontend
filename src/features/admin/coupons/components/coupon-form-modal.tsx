import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Percent, Plus, Save } from "lucide-react";
import { useEffect } from "react";
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
import { SelectDropdown } from "@/components/select-dropdown";
import { Switch } from "@/components/ui/switch";
import { useCreateCoupon, useUpdateCoupon } from "@/api/hooks/admin";
import type { Coupon } from "@/api/endpoints/admin";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
  mode: "add" | "edit";
}

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().min(0.01, "Value must be greater than 0"),
  minOrderValue: z.coerce.number().min(0).optional().or(z.literal("")),
  maxDiscount: z.coerce.number().min(0).optional().or(z.literal("")),
  usageLimit: z.coerce.number().int().min(1).optional().or(z.literal("")),
  validFrom: z.string().min(1, "Start date is required"),
  validUntil: z.string().min(1, "End date is required"),
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const toDateInputValue = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 16);
};

export function CouponFormModal({ open, onOpenChange, coupon, mode }: Props) {
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      type: "PERCENTAGE",
      value: 0,
      minOrderValue: "",
      maxDiscount: "",
      usageLimit: "",
      validFrom: "",
      validUntil: "",
      isActive: true,
    },
  });

  const watchType = form.watch("type");

  useEffect(() => {
    if (open) {
      form.reset({
        code: coupon?.code || "",
        type: coupon?.type || "PERCENTAGE",
        value: coupon?.value || 0,
        minOrderValue: coupon?.minOrderValue ?? "",
        maxDiscount: coupon?.maxDiscount ?? "",
        usageLimit: coupon?.usageLimit ?? "",
        validFrom: toDateInputValue(coupon?.validFrom) || "",
        validUntil: toDateInputValue(coupon?.validUntil) || "",
        isActive: coupon?.isActive ?? true,
      });
    }
  }, [coupon, open, form]);

  const onSubmit = async (values: FormData) => {
    const payload = {
      code: values.code.toUpperCase(),
      type: values.type,
      value: values.value,
      minOrderValue: values.minOrderValue ? Number(values.minOrderValue) : undefined,
      maxDiscount: values.maxDiscount ? Number(values.maxDiscount) : undefined,
      usageLimit: values.usageLimit ? Number(values.usageLimit) : undefined,
      validFrom: new Date(values.validFrom).toISOString(),
      validUntil: new Date(values.validUntil).toISOString(),
    };

    if (mode === "add") {
      createCoupon.mutate(payload, {
        onSuccess: () => {
          toast.success("Coupon created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to create coupon"),
      });
    } else if (coupon) {
      updateCoupon.mutate(
        { uuid: coupon.uuid, data: { ...payload, isActive: values.isActive } as any },
        {
          onSuccess: () => {
            toast.success("Coupon updated successfully");
            form.reset();
            onOpenChange(false);
          },
          onError: () => toast.error("Failed to update coupon"),
        }
      );
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = createCoupon.isPending || updateCoupon.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            {mode === "add" ? "Add Coupon" : "Edit Coupon"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new discount coupon."
              : "Update coupon details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="coupon-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-h-[60vh] overflow-y-auto px-1"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. SUMMER20"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select type"
                      items={[
                        { label: "Percentage", value: "PERCENTAGE" },
                        { label: "Fixed Amount", value: "FIXED" },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Value {watchType === "PERCENTAGE" ? "(%)" : "(₹)"}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Order (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchType === "PERCENTAGE" && (
                <FormField
                  control={form.control}
                  name="maxDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Discount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Leave empty for unlimited"
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
                name="validFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid From</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Until</FormLabel>
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
                        {field.value ? "Coupon is active" : "Coupon is inactive"}
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
          <Button type="submit" form="coupon-form" disabled={isSubmitting}>
            {mode === "add" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Adding..." : "Add Coupon"}
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
