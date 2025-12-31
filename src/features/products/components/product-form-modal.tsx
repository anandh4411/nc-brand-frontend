// src/features/products/components/product-form-modal.tsx
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { SelectDropdown } from "@/components/select-dropdown";
import { Save, Edit, Upload, X, Star } from "lucide-react";
import { useCreateProduct, useUpdateProduct } from "@/api/hooks/products";
import { ProductData } from "@/types/dto/product.dto";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  price: z.string().min(1, { message: "Price is required." }),
  image: z.string().optional(),
  subCategoryId: z.union([z.string(), z.number()]).refine((val) => val !== undefined && val !== "" && val !== 0, {
    message: "Sub category is required.",
  }),
  isPopular: z.boolean(),
  imageRequired: z.boolean().optional(), // Helper field for validation
});

type ProductForm = z.infer<typeof formSchema>;

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductData;
  subCategories: Array<{ id: string | number; name: string }>;
  mainCategoryId: string | number;
}

export const ProductFormModal = ({
  open,
  onOpenChange,
  product,
  subCategories,
  mainCategoryId,
}: ProductFormModalProps) => {
  const isEdit = !!product;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    product?.image
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const form = useForm<ProductForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price?.toString() || "",
      image: product?.image || "",
      subCategoryId: product?.subCategoryId?.toString() || "",
      isPopular: product?.isPopular || false,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price?.toString() || "",
        image: product.image || "",
        subCategoryId: product.subCategoryId?.toString() || "",
        isPopular: product.isPopular || false,
      });
      setImagePreview(product.image);
      setImageFile(null);
    } else {
      form.reset({
        name: "",
        description: "",
        price: "",
        image: "",
        subCategoryId: "",
        isPopular: false,
      });
      setImagePreview(undefined);
      setImageFile(null);
    }
  }, [product, form]);

  const compressAndResizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Target width for compression (500px for good quality)
          const MAX_WIDTH = 500;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions maintaining aspect ratio
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }

          // Create canvas for compression
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Draw image with high quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression (0.85 quality for good balance)
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              // Create new File from compressed blob
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            file.type,
            0.85 // Quality: 85% (good balance between size and quality)
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (JPG, JPEG, PNG, WebP)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast.error("Invalid file type", {
        description: "Please upload JPG, JPEG, PNG, or WebP images only",
      });
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Image size should be less than 10MB",
      });
      return;
    }

    try {
      // Show loading toast
      const toastId = toast.loading("Compressing image...");

      // Compress and resize image
      const compressedFile = await compressAndResizeImage(file);

      // Calculate compression ratio
      const originalSizeKB = (file.size / 1024).toFixed(1);
      const compressedSizeKB = (compressedFile.size / 1024).toFixed(1);
      const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(0);

      // Update toast with success message
      toast.success("Image compressed", {
        id: toastId,
        description: `${originalSizeKB}KB → ${compressedSizeKB}KB (${compressionRatio}% smaller)`,
      });

      setImageFile(compressedFile);
      setImageError(""); // Clear error when image is selected

      // Create preview for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Image compression failed:', error);
      toast.error("Compression failed", {
        description: "Using original image instead",
      });

      // Fallback: use original file
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(undefined);
    form.setValue("image", "");
  };

  const handleSubmit = async (values: ProductForm) => {
    try {
      // Validate image is required for new products
      if (!isEdit && !imageFile) {
        setImageError("Product image is required");
        toast.error("Validation error", {
          description: "Please upload a product image",
        });
        return;
      }

      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        mainCategoryId: typeof mainCategoryId === 'number' ? mainCategoryId : Number(mainCategoryId),
        subCategoryId: typeof values.subCategoryId === 'number' ? values.subCategoryId : Number(values.subCategoryId),
        isPopular: values.isPopular,
        image: imageFile || (product?.image || undefined), // File object or existing URL string
      };

      if (isEdit && product?.uuid) {
        await updateProduct.mutateAsync({
          uuid: product.uuid,
          data: payload,
        });
      } else {
        await createProduct.mutateAsync(payload);
      }

      form.reset();
      setImagePreview(undefined);
      setImageFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit product:", error);
      toast.error("Error", {
        description: isEdit ? "Failed to update product" : "Failed to create product",
      });
    }
  };

  const subCategoryOptions = subCategories.map((sc) => ({
    label: sc.name,
    value: String(sc.id),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <Edit className="h-5 w-5" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {isEdit ? "Edit Product" : "Create Product"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update product details."
              : "Create a new product with details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="product-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Upload Area */}
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center gap-2 cursor-pointer"
                          >
                            <div className="p-3 rounded-full bg-primary/10">
                              <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                Click to upload image
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                JPG, JPEG, PNG, WebP up to 10MB
                              </p>
                            </div>
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                      ) : (
                        // Preview Area
                        <div className="relative">
                          <div className="h-48 rounded-lg overflow-hidden bg-muted border">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a high-quality product image {!isEdit && <span className="text-destructive">*</span>}
                  </FormDescription>
                  {imageError && (
                    <p className="text-sm font-medium text-destructive">{imageError}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., School Starter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sub Category */}
            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Category</FormLabel>
                  <SelectDropdown
                    defaultValue={String(field.value)}
                    onValueChange={field.onChange}
                    placeholder="Select sub category"
                    items={subCategoryOptions}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description..."
                      className="min-h-[70px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ₹999/month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Popular Toggle */}
            <FormField
              control={form.control}
              name="isPopular"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Mark as Popular
                    </FormLabel>
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
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={createProduct.isPending || updateProduct.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="product-form" disabled={createProduct.isPending || updateProduct.isPending}>
            {(createProduct.isPending || updateProduct.isPending) ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {isEdit ? (
                  <Edit className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isEdit ? "Update" : "Create"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
