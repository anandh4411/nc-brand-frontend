# Simplified Feature Pattern Guide

## Overview
This is the new simplified pattern for building features with API integration. No context providers, no over-engineering - just straightforward React with hooks.

## Example: Institutions Feature

The institutions feature demonstrates the complete pattern in a single file: `src/features/institutions/index.tsx`

### File Structure
```
features/institutions/
├── index.tsx                          # Main component (all-in-one)
├── components/
│   ├── institution-form-modal.tsx     # Create/Edit form
│   ├── institution-view-modal.tsx     # View details
│   └── institution-delete-dialog.tsx  # Delete confirmation
├── config/
│   └── columns.tsx                    # Table column definitions
└── data/
    └── schema.ts                      # Zod validation schemas (if needed)
```

### Pattern Breakdown

#### 1. Local State Management (No Context!)
```typescript
export default function Institutions() {
  // Dialog states - simple useState
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Selected item for edit/delete/view
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionData | null>(null);

  // ...rest of component
}
```

#### 2. Table State Hook
```typescript
// Built-in hook handles search, sort, filter, pagination
const tableState = useTableState<InstitutionData>({ debounceMs: 300 });
```

#### 3. API Query Params
```typescript
// Convert table state to API params
const queryParams = useMemo(() => ({
  page: tableState.state.pagination.pageIndex + 1,
  pageSize: tableState.state.pagination.pageSize,
  search: tableState.state.search || undefined,
  sortBy: tableState.state.sorting[0]?.id || "createdAt",
  sortOrder: (tableState.state.sorting[0]?.desc ? "desc" : "asc") as "asc" | "desc",
}), [
  tableState.state.pagination.pageIndex,
  tableState.state.pagination.pageSize,
  tableState.state.search,
  tableState.state.sorting,
]);
```

#### 4. Data Fetching
```typescript
// React Query hook - automatic caching, refetching, error handling
const { data, isLoading, error } = useInstitutions(queryParams);

// Extract data from response
const responseData = data?.data as { institutions: InstitutionData[]; pagination: any } | undefined;
const institutionList = responseData?.institutions || [];
const pagination = responseData?.pagination;
```

#### 5. Action Handlers (Inline)
```typescript
// Simple inline handlers - no context needed
const handleView = (institution: InstitutionData) => {
  setSelectedInstitution(institution);
  setViewDialogOpen(true);
};

const handleEdit = (institution: InstitutionData) => {
  setSelectedInstitution(institution);
  setEditDialogOpen(true);
};

const handleDelete = (institution: InstitutionData) => {
  setSelectedInstitution(institution);
  setDeleteDialogOpen(true);
};
```

#### 6. Table Columns
```typescript
// Memoize columns with empty dependency array
// Handlers are stable - won't cause re-renders
const columns = useMemo(
  () => createInstitutionColumns(handleView, handleEdit, handleDelete),
  []
);
```

#### 7. Render Dialogs Conditionally
```typescript
return (
  <div className="space-y-8">
    {/* Header + Add Button */}
    <Button onClick={() => setAddDialogOpen(true)}>Add Institution</Button>

    {/* Table */}
    <DataTable data={institutionList} columns={columns} config={{...}} />

    {/* Add Dialog - always rendered */}
    <InstitutionFormModal
      open={addDialogOpen}
      onOpenChange={setAddDialogOpen}
      mode="add"
    />

    {/* Edit/View/Delete - only when item selected */}
    {selectedInstitution && (
      <>
        <InstitutionViewModal
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          institution={selectedInstitution}
        />

        <InstitutionFormModal
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          institution={selectedInstitution}
          mode="edit"
        />

        <InstitutionDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          currentRow={selectedInstitution}
        />
      </>
    )}
  </div>
);
```

## Why This Pattern?

### Problems with Old Pattern
❌ Context provider wrapper adds unnecessary complexity
❌ Multiple files to manage simple dialog state
❌ Causes unnecessary re-renders on every state change
❌ Harder to debug and understand
❌ More boilerplate code

### Benefits of New Pattern
✅ Single file - easy to understand
✅ No context overhead - better performance
✅ Simple local state - React basics
✅ Fewer re-renders - columns memoized with empty deps
✅ Easy to copy/paste for new features
✅ Clear data flow - top to bottom

## How to Create a New Feature

### Step 1: Create API Hooks
```typescript
// src/api/hooks/products/useProducts.ts
export const useProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.getProducts(params),
  });
};

// src/api/hooks/products/useCreateProduct.ts
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      toast({ title: 'Product created' });
    },
  });
};
```

### Step 2: Copy institutions/index.tsx
```bash
cp src/features/institutions/index.tsx src/features/products/index.tsx
```

### Step 3: Find & Replace
- `Institution` → `Product`
- `institution` → `product`
- `useInstitutions` → `useProducts`
- Update import paths

### Step 4: Create Dialog Components
```typescript
// src/features/products/components/product-form-modal.tsx
export function ProductFormModal({ open, onOpenChange, product, mode }) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const onSubmit = async (data) => {
    if (mode === 'add') {
      await createProduct.mutateAsync(data);
    } else {
      await updateProduct.mutateAsync({ uuid: product.uuid, data });
    }
    onOpenChange(false);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>...</Dialog>
}
```

### Step 5: Create Table Columns
```typescript
// src/features/products/config/columns.tsx
export const createProductColumns = (
  handleView: (product: Product) => void,
  handleEdit: (product: Product) => void,
  handleDelete: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuItem onClick={() => handleView(row.original)}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEdit(row.original)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(row.original)}>Delete</DropdownMenuItem>
      </DropdownMenu>
    ),
  },
];
```

Done! You have a fully functional CRUD feature.

## Key Rules

1. **No Context Providers** - Use local state only
2. **Memoize Columns with Empty Deps** - Prevents re-renders
3. **One Main Component** - Keep it simple
4. **Separate Dialog Components** - Reusable and testable
5. **Use React Query Hooks** - For all API calls
6. **Conditional Rendering** - Only render dialogs when needed

## Performance Tips

### Prevent Re-renders
```typescript
// ❌ BAD - columns recreated on every render
const columns = createColumns(handleView, handleEdit, handleDelete);

// ✅ GOOD - memoized, stable reference
const columns = useMemo(
  () => createColumns(handleView, handleEdit, handleDelete),
  []
);
```

### Table State Updates
```typescript
// The useTableState hook already debounces search input (300ms)
// No need to add extra debouncing
const tableState = useTableState<T>({ debounceMs: 300 });
```

### React Query Caching
```typescript
// React Query automatically caches and deduplicates requests
// queryParams changes → new API call
// Same queryParams → cached response (5 min stale time)
const { data } = useProducts(queryParams);
```

## Common Mistakes to Avoid

❌ Don't create context providers for simple dialog state
❌ Don't over-memoize callbacks - they're stable
❌ Don't forget empty dependency array for columns useMemo
❌ Don't manually manage loading states - React Query does it
❌ Don't forget to invalidate queries after mutations

## Migration from Old Pattern

If you have existing features with context:

1. Move dialog states to component useState
2. Move currentRow/selectedItem to component useState
3. Delete context file
4. Delete dialog orchestrator component
5. Render dialogs directly in main component
6. Remove provider wrapper

That's it!
