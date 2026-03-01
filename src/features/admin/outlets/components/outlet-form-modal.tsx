// src/features/admin/outlets/components/outlet-form-modal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, Plus, Save } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { SelectDropdown } from "@/components/select-dropdown";
import { indianStates } from "../data/mock-data";
import {
  CreateOutletRequestSchema,
  type Outlet,
  type CreateOutletRequest,
} from "@/types/dto/outlet.dto";
import { useCreateOutlet, useUpdateOutlet } from "@/api/hooks/admin";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outlet?: Outlet | null;
  mode: "add" | "edit";
}

export function OutletFormModal({ open, onOpenChange, outlet, mode }: Props) {
  const createOutlet = useCreateOutlet();
  const updateOutlet = useUpdateOutlet();

  const form = useForm<CreateOutletRequest>({
    resolver: zodResolver(CreateOutletRequestSchema),
    defaultValues: {
      code: outlet?.code || "",
      loginCode: outlet?.loginCode || "",
      name: outlet?.name || "",
      address: outlet?.address || "",
      city: outlet?.city || "",
      state: outlet?.state || "",
      pincode: outlet?.pincode || "",
      phone: outlet?.phone || "",
      email: outlet?.email || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        code: outlet?.code || "",
        loginCode: outlet?.loginCode || "",
        name: outlet?.name || "",
        address: outlet?.address || "",
        city: outlet?.city || "",
        state: outlet?.state || "",
        pincode: outlet?.pincode || "",
        phone: outlet?.phone || "",
        email: outlet?.email || "",
      });
    }
  }, [outlet, open, form]);

  const onSubmit = async (values: CreateOutletRequest) => {
    const payload = { ...values };
    if (!payload.email) delete payload.email;

    if (mode === "add") {
      createOutlet.mutate(payload, {
        onSuccess: () => {
          toast.success("Outlet created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to create outlet");
        },
      });
    } else if (outlet) {
      updateOutlet.mutate(
        { uuid: outlet.uuid, data: payload },
        {
          onSuccess: () => {
            toast.success("Outlet updated successfully");
            form.reset();
            onOpenChange(false);
          },
          onError: () => {
            toast.error("Failed to update outlet");
          },
        }
      );
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = createOutlet.isPending || updateOutlet.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            {mode === "add" ? "Add Outlet" : "Edit Outlet"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new outlet location to manage inventory and sales."
              : "Update outlet details and settings."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="outlet-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-h-[60vh] overflow-y-auto px-1"
          >
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outlet Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. OUT-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loginCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ABC123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outlet Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Chennai Main Store" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Enter full address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Chennai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>State</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select state"
                      items={indianStates}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 600001" maxLength={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. outlet@textilehub.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="outlet-form" disabled={isSubmitting}>
            {mode === "add" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Adding..." : "Add Outlet"}
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
