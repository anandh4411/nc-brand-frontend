// src/features/admin/categories/index.tsx
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, useTableState } from "@/components/elements/app-data-table";
import { createCategoryColumns } from "./config/columns";
import { CategoryFormModal } from "./components/category-form-modal";
import { CategoryDeleteDialog } from "./components/category-delete-dialog";
import { CategoryViewModal } from "./components/category-view-modal";
import { mockCategories, getParentCategoryOptions } from "./data/mock-data";
import type { Category } from "@/types/dto/product-catalog.dto";

export default function Categories() {
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Table state
  const tableState = useTableState<Category>({ debounceMs: 300 });

  // Using mock data for now
  const categoryList = mockCategories;
  const parentCategories = getParentCategoryOptions();

  // Action handlers
  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setViewDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  // Check if category has children
  const hasChildren = (categoryId: number) => {
    return categoryList.some((c) => c.parentId === categoryId);
  };

  // Get parent category
  const getParentCategory = (parentId: number | null) => {
    if (!parentId) return null;
    return categoryList.find((c) => c.id === parentId) || null;
  };

  // Columns
  const columns = useMemo(
    () => createCategoryColumns(handleView, handleEdit, handleDelete, categoryList),
    [categoryList]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            Categories
          </h1>
          <p className="text-muted-foreground">
            Manage product categories and subcategories.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddDialogOpen(true)} className="h-9">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <DataTable
        data={categoryList}
        columns={columns}
        config={{
          search: {
            enabled: true,
            placeholder: "Search categories...",
            columnKey: "name",
          },
          pagination: {
            enabled: true,
            defaultPageSize: 10,
          },
          selection: { enabled: true },
          sorting: {
            enabled: true,
            defaultSort: { columnKey: "sortOrder", desc: false },
          },
          viewOptions: { enabled: true },
          emptyStateMessage: "No categories found.",
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
      <CategoryFormModal
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        parentCategories={parentCategories}
        mode="add"
      />

      {selectedCategory && (
        <>
          <CategoryViewModal
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            category={selectedCategory}
            parentCategory={getParentCategory(selectedCategory.parentId)}
          />

          <CategoryFormModal
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            category={selectedCategory}
            parentCategories={parentCategories}
            mode="edit"
          />

          <CategoryDeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            category={selectedCategory}
            hasChildren={hasChildren(selectedCategory.id)}
          />
        </>
      )}
    </div>
  );
}
