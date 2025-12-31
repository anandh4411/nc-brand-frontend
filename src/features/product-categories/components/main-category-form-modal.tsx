import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { useCreateMainCategory, useUpdateMainCategory } from "@/api/hooks/categories";
import type { MainCategoryData } from "@/types/dto/main-category.dto";

const mainCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type MainCategoryFormData = z.infer<typeof mainCategorySchema>;

interface MainCategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: MainCategoryData;
}

export function MainCategoryFormModal({
  open,
  onOpenChange,
  category,
}: MainCategoryFormModalProps) {
  const isEdit = !!category?.uuid;
  const createMainCategory = useCreateMainCategory();
  const updateMainCategory = useUpdateMainCategory();

  const form = useForm<MainCategoryFormData>({
    resolver: zodResolver(mainCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Reset form when category changes or modal opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name || "",
        description: category?.description || "",
      });
    }
  }, [open, category, form]);

  const onSubmit = async (data: MainCategoryFormData) => {
    try {
      if (isEdit && category?.uuid) {
        await updateMainCategory.mutateAsync({
          uuid: category.uuid,
          data,
        });
      } else {
        await createMainCategory.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handled by hooks
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Main Category" : "Add Main Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the main category details"
              : "Create a new main category for products"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Electronics" {...field} />
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
                      placeholder="Brief description of this category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMainCategory.isPending || updateMainCategory.isPending}
              >
                {isEdit ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
