// src/features/admin/products/index.tsx
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createProductColumns } from "./config/columns";
import { ProductFormModal } from "./components/product-form-modal";
import { ProductDeleteDialog } from "./components/product-delete-dialog";
import { ProductViewModal } from "./components/product-view-modal";
import { mockProductGroups } from "./data/mock-data";
import { mockCategories } from "../categories/data/mock-data";
import type { ProductGroup } from "@/types/dto/product-catalog.dto";

export default function Products() {
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductGroup | null>(null);

  // Table state
  const tableState = useTableState<ProductGroup>({ debounceMs: 300 });

  // Using mock data for now
  const productList = mockProductGroups;

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

  // Columns
  const columns = useMemo(
    () => createProductColumns(handleView, handleEdit, handleDelete),
    []
  );

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
          selection: { enabled: true },
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
        categories={mockCategories}
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
            categories={mockCategories}
            mode="edit"
          />

          <ProductDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            product={selectedProduct}
          />
        </>
      )}
    </div>
  );
}
