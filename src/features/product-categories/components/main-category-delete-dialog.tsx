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
import { useDeleteMainCategory } from "@/api/hooks/categories";
import type { MainCategoryData } from "@/types/dto/main-category.dto";

interface MainCategoryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: MainCategoryData;
}

export function MainCategoryDeleteDialog({
  isOpen,
  onClose,
  category,
}: MainCategoryDeleteDialogProps) {
  const deleteMainCategory = useDeleteMainCategory();

  const handleDelete = async () => {
    if (!category.uuid) return;

    try {
      await deleteMainCategory.mutateAsync(category.uuid);
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Main Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{category.name}</strong>?
            This will also delete all associated subcategories and products.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMainCategory.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteMainCategory.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
