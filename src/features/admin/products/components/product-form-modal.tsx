// src/features/admin/products/components/product-form-modal.tsx
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Plus, Save, Trash2, Palette } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectDropdown } from "@/components/select-dropdown";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { fabricTypeOptions, patternOptions, sizeOptions } from "../data/mock-data";
import { useCreateProductGroup, useUpdateProductGroup } from "@/api/hooks/admin";
import type { ProductGroup, Category } from "@/types/dto/product-catalog.dto";
import { toast } from "sonner";
import { ProductPreviewCard } from "./product-preview-card";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductGroup | null;
  categories: Category[];
  mode: "add" | "edit";
}

// Size variant schema
const sizeVariantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  priceAdjustment: z.number().default(0),
});

// Color variant schema
const colorVariantSchema = z.object({
  colorCode: z.string().min(1, "Color code is required"),
  colorName: z.string().min(1, "Color name is required"),
  sizes: z.array(sizeVariantSchema).min(1, "At least one size is required"),
});

// Product form schema
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.number().min(0, "Price must be positive"),
  categoryId: z.number({ required_error: "Category is required" }),
  fabricType: z.string().optional(),
  pattern: z.string().optional(),
  careInstructions: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  colorVariants: z.array(colorVariantSchema).min(1, "At least one color variant is required"),
});

type ProductFormData = z.infer<typeof productFormSchema>;

export function ProductFormModal({
  open,
  onOpenChange,
  product,
  categories,
  mode,
}: Props) {
  const createProductGroup = useCreateProductGroup();
  const updateProductGroup = useUpdateProductGroup();

  const defaultColorVariant = {
    colorCode: "#000000",
    colorName: "",
    sizes: [{ size: "M", priceAdjustment: 0 }],
  };

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      categoryId: undefined,
      fabricType: "",
      pattern: "",
      careInstructions: "",
      isFeatured: false,
      isActive: true,
      colorVariants: [defaultColorVariant],
    },
  });

  const { fields: colorFields, append: addColor, remove: removeColor } = useFieldArray({
    control: form.control,
    name: "colorVariants",
  });

  useEffect(() => {
    if (open) {
      if (product && mode === "edit") {
        form.reset({
          name: product.name,
          description: product.description,
          basePrice: product.basePrice,
          categoryId: product.categoryId,
          fabricType: product.attributes?.fabricType || "",
          pattern: product.attributes?.pattern || "",
          careInstructions: product.attributes?.careInstructions || "",
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          colorVariants: product.colorVariants.map((cv) => ({
            colorCode: cv.colorCode,
            colorName: cv.colorName,
            sizes: cv.sizeVariants.map((sv) => ({
              size: sv.size,
              priceAdjustment: sv.priceAdjustment,
            })),
          })),
        });
      } else {
        form.reset({
          name: "",
          description: "",
          basePrice: 0,
          categoryId: undefined,
          fabricType: "",
          pattern: "",
          careInstructions: "",
          isFeatured: false,
          isActive: true,
          colorVariants: [defaultColorVariant],
        });
      }
    }
  }, [product, open, form, mode]);

  const onSubmit = async (values: ProductFormData) => {
    const apiData = {
      name: values.name,
      description: values.description,
      basePrice: values.basePrice,
      categoryId: values.categoryId,
      fabricType: values.fabricType,
      pattern: values.pattern,
      careInstructions: values.careInstructions,
      isFeatured: values.isFeatured,
      isActive: values.isActive,
      colorVariants: values.colorVariants.map((cv) => ({
        colorCode: cv.colorCode,
        colorName: cv.colorName,
        sizeVariants: cv.sizes.map((s) => ({
          size: s.size,
          priceAdjustment: s.priceAdjustment,
        })),
      })),
    };

    if (mode === "add") {
      createProductGroup.mutate(apiData as any, {
        onSuccess: () => {
          toast.success("Product created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to create product");
        },
      });
    } else if (product) {
      updateProductGroup.mutate(
        { uuid: product.uuid, data: apiData as any },
        {
          onSuccess: () => {
            toast.success("Product updated successfully");
            form.reset();
            onOpenChange(false);
          },
          onError: () => {
            toast.error("Failed to update product");
          },
        }
      );
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const isSubmitting = createProductGroup.isPending || updateProductGroup.isPending;

  const categoryOptions = (Array.isArray(categories) ? categories : [])
    .filter((c) => c.isActive)
    .map((c) => ({ label: c.name, value: String(c.id) }));

  // Watch form values for live preview
  const watchedValues = form.watch();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[950px] h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Left Section - Form */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <DialogHeader className="text-left px-6 pt-6 pb-4 shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {mode === "add" ? "Add Product" : "Edit Product"}
              </DialogTitle>
              <DialogDescription>
                {mode === "add"
                  ? "Create a new product with color and size variants."
                  : "Update product details and variants."}
              </DialogDescription>
            </DialogHeader>

            <div className="h-0 flex-1 flex flex-col overflow-y-scroll">
              <div className="h-0 flex-1 overflow-y-auto px-6">
                <Form {...form}>
                  <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-4">
                    {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Kanchipuram Silk Saree" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Category</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value ? String(field.value) : ""}
                          onValueChange={(val) => field.onChange(Number(val))}
                          placeholder="Select category"
                          items={categoryOptions}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder="Describe the product..."
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
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fabricType"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Fabric Type</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value || ""}
                          onValueChange={field.onChange}
                          placeholder="Select fabric"
                          items={fabricTypeOptions}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pattern"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Pattern</FormLabel>
                        <SelectDropdown
                          defaultValue={field.value || ""}
                          onValueChange={field.onChange}
                          placeholder="Select pattern"
                          items={patternOptions}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="careInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Care Instructions</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Dry clean only" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Featured Product</FormLabel>
                      </FormItem>
                    )}
                  />

                  {mode === "edit" && (
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Active</FormLabel>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <Separator />

                {/* Color Variants */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span className="font-medium">Color Variants</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addColor(defaultColorVariant)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Color
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {colorFields.map((colorField, colorIndex) => (
                      <div
                        key={colorField.id}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="grid grid-cols-3 gap-3 flex-1">
                            <FormField
                              control={form.control}
                              name={`colorVariants.${colorIndex}.colorCode`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Color</FormLabel>
                                  <FormControl>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="color"
                                        className="w-10 h-9 p-1"
                                        {...field}
                                      />
                                      <Input
                                        placeholder="#000000"
                                        className="flex-1"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`colorVariants.${colorIndex}.colorName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Color Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Maroon" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div>
                              <FormLabel className="text-xs">Sizes</FormLabel>
                              <ColorSizeManager
                                control={form.control}
                                colorIndex={colorIndex}
                              />
                            </div>
                          </div>

                          {colorFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive ml-2"
                              onClick={() => removeColor(colorIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                  </form>
                </Form>
              </div>

              <DialogFooter className="px-6 py-4 border-t shrink-0">
                <DialogClose asChild>
                  <Button variant="outline" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" form="product-form" disabled={isSubmitting}>
                  {mode === "add" ? (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Adding..." : "Add Product"}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>

          {/* Right Section - Preview */}
          <div className="hidden sm:flex w-[320px] border-l bg-muted/30 flex-col">
            <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
              <ProductPreviewCard
                name={watchedValues.name || ""}
                description={watchedValues.description || ""}
                basePrice={watchedValues.basePrice || 0}
                fabricType={watchedValues.fabricType}
                pattern={watchedValues.pattern}
                isFeatured={watchedValues.isFeatured}
                colorVariants={watchedValues.colorVariants || []}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for managing sizes within a color variant
function ColorSizeManager({
  control,
  colorIndex,
}: {
  control: any;
  colorIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `colorVariants.${colorIndex}.sizes`,
  });

  return (
    <div className="flex flex-wrap gap-1">
      {fields.map((field, sizeIndex) => (
        <Badge
          key={field.id}
          variant="secondary"
          className="cursor-pointer hover:bg-destructive/20"
          onClick={() => fields.length > 1 && remove(sizeIndex)}
        >
          {(field as any).size || "?"}
          {fields.length > 1 && <span className="ml-1">×</span>}
        </Badge>
      ))}
      <SelectDropdown
        defaultValue=""
        onValueChange={(val) => {
          if (val && !fields.some((f: any) => f.size === val)) {
            append({ size: val, priceAdjustment: 0 });
          }
        }}
        placeholder="+"
        items={sizeOptions}
        className="h-6 text-xs w-12"
      />
    </div>
  );
}
