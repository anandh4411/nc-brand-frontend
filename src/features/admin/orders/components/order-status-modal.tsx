// src/features/admin/orders/components/order-status-modal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Save, Truck } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { SelectDropdown } from "@/components/select-dropdown";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { orderStatusOptions } from "../data/mock-data";
import type { OrderStatus } from "@/types/dto/order.dto";
import { useUpdateOrderStatus } from "@/api/hooks/admin";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: { uuid: string; orderNumber: string; status: string };
}

const formSchema = z
  .object({
    status: z.enum([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ]),
    notes: z.string().optional(),
    deliveryProvider: z.string().optional(),
    trackingId: z.string().optional(),
    trackingUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === "shipped") {
        return !!data.deliveryProvider?.trim() && !!data.trackingId?.trim();
      }
      return true;
    },
    {
      message: "Delivery provider and tracking ID are required when shipping",
      path: ["deliveryProvider"],
    }
  );

type FormData = z.infer<typeof formSchema>;

const getNextStatuses = (current: OrderStatus): OrderStatus[] => {
  const flow: Record<OrderStatus, OrderStatus[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: ["returned"],
    cancelled: [],
    returned: [],
  };
  return flow[current] || [];
};

export function OrderStatusModal({ open, onOpenChange, order }: Props) {
  const updateStatus = useUpdateOrderStatus();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      status: order.status as FormData["status"],
      notes: "",
      deliveryProvider: "",
      trackingId: "",
      trackingUrl: "",
    },
  });

  const watchedStatus = form.watch("status");

  useEffect(() => {
    if (open) {
      form.reset({
        status: order.status as FormData["status"],
        notes: "",
        deliveryProvider: "",
        trackingId: "",
        trackingUrl: "",
      });
    }
  }, [order, open, form]);

  const onSubmit = async (values: FormData) => {
    updateStatus.mutate(
      {
        uuid: order.uuid,
        status: values.status,
        notes: values.notes || undefined,
        deliveryProvider: values.status === "shipped" ? values.deliveryProvider : undefined,
        trackingId: values.status === "shipped" ? values.trackingId : undefined,
        trackingUrl: values.status === "shipped" && values.trackingUrl ? values.trackingUrl : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Order status updated successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (err: any) => {
          const message = err?.response?.data?.error?.message || err?.message || "Failed to update status";
          toast.error(message);
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = updateStatus.isPending;
  const nextStatuses = getNextStatuses(order.status as OrderStatus);
  const availableStatuses = orderStatusOptions.filter(
    (opt) =>
      opt.value === order.status || nextStatuses.includes(opt.value as OrderStatus)
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Update Order Status
          </DialogTitle>
          <DialogDescription>
            Update the status of order {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        {/* Current Status */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Status</span>
            <Badge variant="outline" className="capitalize">
              {order.status}
            </Badge>
          </div>
        </div>

        {nextStatuses.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            This order cannot be updated further.
          </div>
        ) : (
          <Form {...form}>
            <form
              id="order-status-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>New Status</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select status"
                      items={availableStatuses}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shipping details — shown when "shipped" is selected */}
              {watchedStatus === "shipped" && (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Truck className="h-4 w-4" />
                    Shipping Details
                  </div>
                  <Separator />

                  <FormField
                    control={form.control}
                    name="deliveryProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Provider *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Delhivery, DTDC, BlueDart, India Post"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trackingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking ID *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. DL1234567890"
                            className="font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trackingUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.delhivery.com/track/..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Add notes about this status change..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          {nextStatuses.length > 0 && (
            <Button
              type="submit"
              form="order-status-form"
              disabled={isSubmitting || form.watch("status") === order.status}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
