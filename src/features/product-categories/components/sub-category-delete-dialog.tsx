import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteSubCategory } from "@/api/hooks/categories";
import type { SubCategoryData } from "@/types/dto/sub-category.dto";

interface SubCategoryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: SubCategoryData;
}

export function SubCategoryDeleteDialog({
  isOpen,
  onClose,
  category,
}: SubCategoryDeleteDialogProps) {
  const deleteSubCategory = useDeleteSubCategory();

  const handleDelete = async () => {
    if (!category.uuid) return;

    try {
      await deleteSubCategory.mutateAsync(category.uuid);
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Sub Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{category.name}</strong>?
            This will also delete all products in this category.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSubCategory.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteSubCategory.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
