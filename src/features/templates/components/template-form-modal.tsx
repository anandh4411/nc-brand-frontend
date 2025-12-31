import React, { useEffect, useRef, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Save, Edit, Upload, X, Plus, Star } from "lucide-react";
import { useCreateTemplate, useUpdateTemplate } from "@/api/hooks/templates";
import { TemplateData } from "@/types/dto/template.dto";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, { message: "Template name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  imageUrl: z.string().optional(),
  category: z.string().min(1, { message: "Category is required." }),
  features: z
    .array(z.string())
    .min(1, { message: "At least one feature is required." }),
  isPopular: z.boolean(),
  usageCount: z.number().optional(),
});

type TemplateForm = z.infer<typeof formSchema>;

const categoryOptions = [
  { label: "School", value: "school" },
  { label: "Office", value: "office" },
  { label: "Medical", value: "medical" },
  { label: "Generic", value: "generic" },
  { label: "Other", value: "other" },
];

interface TemplateFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: TemplateData;
  mode: "add" | "edit";
}

export const TemplateFormModal = ({
  open,
  onOpenChange,
  template,
  mode,
}: TemplateFormModalProps) => {
  const isEdit = !!template;
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [features, setFeatures] = useState<string[]>([""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(template?.imageUrl);
  const [imageError, setImageError] = useState<string>("");

  useEffect(() => {
    if (template) {
      if (template.features && template.features.length > 0) {
        setFeatures(template.features);
      } else {
        setFeatures([""]);
      }
      setImagePreview(template.imageUrl);
      setImageFile(null);
    } else {
      setFeatures([""]);
      setImagePreview(undefined);
      setImageFile(null);
    }
  }, [template]);

  const form = useForm<TemplateForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name || "",
      description: template?.description || "",
      imageUrl: template?.imageUrl || "",
      category: template?.category || "",
      features: template?.features || [""],
      isPopular: template?.isPopular || false,
      usageCount: template?.usageCount || 0,
    },
  });

  const compressAndResizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 500;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            file.type,
            0.85
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (values: TemplateForm) => {
    try {
      // Validate image is required for new templates
      if (!isEdit && !imageFile) {
        setImageError("Template image is required");
        toast.error("Validation error", {
          description: "Please upload a template image",
        });
        return;
      }

      const filteredFeatures = values.features.filter(
        (feature) => feature.trim() !== ""
      );

      const payload = {
        name: values.name,
        description: values.description,
        imageUrl: imageFile || (template?.imageUrl || undefined),
        category: values.category,
        features: filteredFeatures,
        isPopular: values.isPopular,
      };

      if (isEdit && template?.uuid) {
        await updateTemplate.mutateAsync({
          uuid: template.uuid,
          data: payload,
        });
      } else {
        await createTemplate.mutateAsync(payload);
      }

      form.reset();
      setImageFile(null);
      setImagePreview(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit template:", error);
      toast.error("Error", {
        description: isEdit ? "Failed to update template" : "Failed to create template",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
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
      const toastId = toast.loading("Compressing image...");

      // Compress and resize image
      const compressedFile = await compressAndResizeImage(file);

      // Calculate compression ratio
      const originalSizeKB = (file.size / 1024).toFixed(1);
      const compressedSizeKB = (compressedFile.size / 1024).toFixed(1);
      const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(0);

      toast.success("Image compressed", {
        id: toastId,
        description: `${originalSizeKB}KB → ${compressedSizeKB}KB (${compressionRatio}% smaller)`,
      });

      setImageFile(compressedFile);
      setImageError("");

      // Create preview
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
    form.setValue("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <Edit className="h-5 w-5" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {mode === "add" ? "Create Template" : "Edit Template"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update template details and features."
              : "Create a new ID card template with image and features."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="template-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Template Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Classic School ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select category"
                    items={categoryOptions}
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
                      placeholder="Brief description of the template..."
                      className="min-h-[80px]"
                      {...field}
                    />
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
                    <FormDescription className="text-sm text-muted-foreground">
                      Popular templates are highlighted to users
                    </FormDescription>
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

            {/* Features */}
            <div className="space-y-4">
              <FormLabel>Template Features</FormLabel>
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`features.${index}` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="e.g., Student Photo"
                            value={features[index]}
                            onChange={(e) => {
                              const newFeatures = [...features];
                              newFeatures[index] = e.target.value;
                              setFeatures(newFeatures);
                              form.setValue("features", newFeatures);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFeatures = features.filter(
                          (_, i) => i !== index
                        );
                        setFeatures(newFeatures);
                        form.setValue("features", newFeatures);
                      }}
                      className="px-3"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFeatures([...features, ""])}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Image</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Upload Area */}
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                          <label
                            htmlFor="template-image-upload"
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
                            id="template-image-upload"
                            ref={fileInputRef}
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
                              alt="Template preview"
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
                    Upload a high-quality template image {!isEdit && <span className="text-destructive">*</span>}
                  </FormDescription>
                  {imageError && (
                    <p className="text-sm font-medium text-destructive">{imageError}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={createTemplate.isPending || updateTemplate.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="template-form" disabled={createTemplate.isPending || updateTemplate.isPending}>
            {(createTemplate.isPending || updateTemplate.isPending) ? (
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
                {isEdit ? "Update Template" : "Create Template"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
