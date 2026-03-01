// src/features/admin/orders/components/order-status-modal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw, Save } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { SelectDropdown } from "@/components/select-dropdown";
import { Badge } from "@/components/ui/badge";
import { orderStatusOptions } from "../data/mock-data";
import type { Order, OrderStatus } from "@/types/dto/order.dto";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

const formSchema = z.object({
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
});

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
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      status: order.status as FormData["status"],
      notes: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        status: order.status as FormData["status"],
        notes: "",
      });
    }
  }, [order, open, form]);

  const onSubmit = async (values: FormData) => {
    console.log("Update order status:", {
      orderId: order.uuid,
      ...values,
    });
    toast.success("Order status updated successfully");
    form.reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = form.formState.isSubmitting;
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
