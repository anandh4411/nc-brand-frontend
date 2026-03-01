// src/features/admin/products/index.tsx
import { useState, useMemo, useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createProductColumns } from "./config/columns";
import { ProductFormModal } from "./components/product-form-modal";
import { ProductDeleteDialog } from "./components/product-delete-dialog";
import { ProductViewModal } from "./components/product-view-modal";
import { useAdminProductGroups, useAdminCategories, useDeleteProductGroup } from "@/api/hooks/admin";
import type { ProductGroup, Category } from "@/types/dto/product-catalog.dto";
import { toast } from "sonner";

export default function Products() {
  // Check if navigated with openAdd search param
  const { openAdd } = useSearch({ from: "/admin/products/" });

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductGroup | null>(null);

  // Table state
  const tableState = useTableState<ProductGroup>({ debounceMs: 300 });

  // API Hooks
  const { data: productsResponse, isLoading: productsLoading } = useAdminProductGroups();
  const { data: categoriesResponse, isLoading: categoriesLoading } = useAdminCategories();
  const deleteProduct = useDeleteProductGroup();

  // Get data from API
  const productList = ((productsResponse?.data as any)?.productGroups || productsResponse?.data || []) as ProductGroup[];
  const categories = ((categoriesResponse?.data as any)?.categories || categoriesResponse?.data || []) as Category[];

  const isLoading = productsLoading || categoriesLoading;

  // Auto-open add modal when navigated from inventory page
  useEffect(() => {
    if (openAdd && !isLoading) {
      setAddDialogOpen(true);
    }
  }, [openAdd, isLoading]);

  // Action handlers
  const handleView = (product: ProductGroup) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  const handleEdit = (product: ProductGroup) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = (product: ProductGroup) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedProduct) return;
    deleteProduct.mutate(selectedProduct.uuid, {
      onSuccess: () => {
        toast.success("Product deleted");
        setDeleteDialogOpen(false);
        setSelectedProduct(null);
      },
      onError: () => {
        toast.error("Failed to delete product");
      },
    });
  };

  // Columns
  const columns = useMemo(
    () => createProductColumns(handleView, handleEdit, handleDelete),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground">
            Manage product catalog with color and size variants.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={productList}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search products...",
            columnKey: "name",
          },
          pagination: {
            enabled: true,
            defaultPageSize: 10,
          },
          selection: { enabled: false },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "createdAt", desc: true },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No products found.",
          filters: [
            {
              columnKey: "isActive",
              title: "Status",
              options: [
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ],
            },
          ],
        }}
        callbacks={{
          onSearch: tableState.updateSearch,
          onFiltersChange: tableState.updateFilters,
          onSortingChange: tableState.updateSorting,
          onRowSelectionChange: tableState.updateSelection,
          onPaginationChange: tableState.updatePagination,
        }}
      />

      {/* Dialogs */}
      <ProductFormModal
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        categories={categories}
        mode="add"
      />

      {selectedProduct && (
        <>
          <ProductViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            product={selectedProduct}
          />

          <ProductFormModal
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            product={selectedProduct}
            categories={categories}
            mode="edit"
          />

          <ProductDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            product={selectedProduct}
            onConfirm={handleConfirmDelete}
            isDeleting={deleteProduct.isPending}
          />
        </>
      )}
    </div>
  );
}
