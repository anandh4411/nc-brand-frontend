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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateSubCategory, useUpdateSubCategory } from "@/api/hooks/categories";
import type { SubCategoryData } from "@/types/dto/sub-category.dto";
import type { MainCategoryData } from "@/types/dto/main-category.dto";

const subCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  mainCategoryId: z.number().min(1, "Main category is required"),
});

type SubCategoryFormData = z.infer<typeof subCategorySchema>;

interface SubCategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: SubCategoryData;
  mainCategories: MainCategoryData[];
}

export function SubCategoryFormModal({
  open,
  onOpenChange,
  category,
  mainCategories,
}: SubCategoryFormModalProps) {
  const isEdit = !!category?.uuid;
  const createSubCategory = useCreateSubCategory();
  const updateSubCategory = useUpdateSubCategory();

  const form = useForm<SubCategoryFormData>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      mainCategoryId: undefined,
    },
  });

  // Reset form when category changes or modal opens/closes
  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name || "",
        description: category?.description || "",
        mainCategoryId: category?.mainCategoryId || undefined,
      });
    }
  }, [open, category, form]);

  const onSubmit = async (data: SubCategoryFormData) => {
    try {
      if (isEdit && category?.uuid) {
        await updateSubCategory.mutateAsync({
          uuid: category.uuid,
          data: {
            name: data.name,
            description: data.description,
          },
        });
      } else {
        await createSubCategory.mutateAsync(data);
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
            {isEdit ? "Edit Sub Category" : "Add Sub Category"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the sub category details"
              : "Create a new sub category under a main category"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mainCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Category</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select main category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mainCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id!.toString()}>
                          {cat.name}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Laptops" {...field} />
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
                      placeholder="Brief description of this subcategory"
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
                disabled={createSubCategory.isPending || updateSubCategory.isPending}
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
