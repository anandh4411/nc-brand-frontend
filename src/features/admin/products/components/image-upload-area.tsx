import { useCallback, useRef, useState } from "react";
import { ImagePlus, X, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/dto/product-catalog.dto";

const MAX_FILES = 5;
const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface PendingFile {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploadAreaProps {
  existingImages?: ProductImage[];
  pendingFiles: PendingFile[];
  onFilesAdd: (files: PendingFile[]) => void;
  onFileRemove: (id: string) => void;
  onExistingImageDelete?: (uuid: string) => void;
  uploadingImageIds?: Set<string>;
  disabled?: boolean;
}

export type { PendingFile };

export function ImageUploadArea({
  existingImages = [],
  pendingFiles,
  onFilesAdd,
  onFileRemove,
  onExistingImageDelete,
  uploadingImageIds = new Set(),
  disabled = false,
}: ImageUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const totalCount = existingImages.length + pendingFiles.length;
  const canAdd = totalCount < MAX_FILES;

  const validateAndAddFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      const remaining = MAX_FILES - totalCount;
      if (remaining <= 0) return;

      const valid = files
        .filter((f) => {
          if (!ACCEPTED_TYPES.includes(f.type)) return false;
          if (f.size > MAX_SIZE_MB * 1024 * 1024) return false;
          return true;
        })
        .slice(0, remaining);

      if (valid.length === 0) return;

      const newPending: PendingFile[] = valid.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }));

      onFilesAdd(newPending);
    },
    [totalCount, onFilesAdd]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled || !canAdd) return;
      validateAndAddFiles(e.dataTransfer.files);
    },
    [disabled, canAdd, validateAndAddFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && canAdd) setDragOver(true);
    },
    [disabled, canAdd]
  );

  return (
    <div className="space-y-2">
      {/* Thumbnails */}
      {(existingImages.length > 0 || pendingFiles.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {existingImages.map((img) => (
            <div
              key={img.uuid}
              className="relative group w-16 h-16 rounded-md overflow-hidden border"
            >
              <img
                src={img.imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              {img.isPrimary && (
                <div className="absolute top-0.5 left-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </div>
              )}
              {uploadingImageIds.has(img.uuid) ? (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
              ) : (
                onExistingImageDelete && (
                  <button
                    type="button"
                    onClick={() => onExistingImageDelete(img.uuid)}
                    className="absolute top-0.5 right-0.5 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )
              )}
            </div>
          ))}

          {pendingFiles.map((pf) => (
            <div
              key={pf.id}
              className="relative group w-16 h-16 rounded-md overflow-hidden border"
            >
              <img
                src={pf.preview}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onFileRemove(pf.id)}
                className="absolute top-0.5 right-0.5 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAdd && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "flex items-center gap-2 p-2 border border-dashed rounded-md cursor-pointer transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <ImagePlus className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Drop images or click ({totalCount}/{MAX_FILES})
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) validateAndAddFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}
