// src/features/admin/categories/components/category-form-modal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderTree, Plus, Save } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  CreateCategoryRequestSchema,
  type Category,
  type CreateCategoryRequest,
} from "@/types/dto/product-catalog.dto";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  parentCategories: { label: string; value: string }[];
  mode: "add" | "edit";
}

const formSchema = CreateCategoryRequestSchema.extend({
  isActive: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function CategoryFormModal({
  open,
  onOpenChange,
  category,
  parentCategories,
  mode,
}: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      parentId: category?.parentId || null,
      isActive: category?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name || "",
        description: category?.description || "",
        parentId: category?.parentId || null,
        isActive: category?.isActive ?? true,
      });
    }
  }, [category, open, form]);

  const onSubmit = async (values: FormData) => {
    // TODO: Replace with actual API call
    console.log("Submit category:", values);
    toast.success(
      mode === "add"
        ? "Category created successfully"
        : "Category updated successfully"
    );
    form.reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = form.formState.isSubmitting;

  // Filter out current category from parent options (can't be its own parent)
  const filteredParentOptions = parentCategories.filter(
    (p) => p.value !== String(category?.id)
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            {mode === "add" ? "Add Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new product category."
              : "Update category details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="category-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-h-[60vh] overflow-y-auto px-1"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Silk Sarees" {...field} />
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
                      placeholder="Brief description of the category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Category Type</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value ? String(field.value) : "_none"}
                    onValueChange={(val) =>
                      field.onChange(val === "_none" ? null : Number(val))
                    }
                    placeholder="Select type"
                    items={[
                      { label: "Main Category", value: "_none" },
                      ...filteredParentOptions.map((p) => ({
                        label: `Sub of: ${p.label}`,
                        value: p.value,
                      })),
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === "edit" && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Status</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value
                          ? "Category is active"
                          : "Category is inactive"}
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
          <Button type="submit" form="category-form" disabled={isSubmitting}>
            {mode === "add" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Adding..." : "Add Category"}
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
