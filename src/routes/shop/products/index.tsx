import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";
import { ProductGrid } from "@/features/shop/components/product-grid";
import { useShopProducts, useShopCategories } from "@/api/hooks/shop";

type SortOption = "newest" | "price_asc" | "price_desc" | "popular" | "rating";

interface SearchParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  fabric?: string;
  q?: string;
  page?: number;
  sortBy?: SortOption;
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
];

function ProductsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/shop/products/" }) as SearchParams;

  // Local filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([
    search.minPrice || 0,
    search.maxPrice || 50000,
  ]);
  const [columns, setColumns] = useState<2 | 3 | 4>(4);

  // Fetch categories for filter
  const { data: categoriesData } = useShopCategories();
  const categories = categoriesData?.data || [];

  // Build API params from search
  const apiParams = {
    category: search.category,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    fabric: search.fabric,
    search: search.q,
    page: search.page || 1,
    pageSize: 20,
    sortBy: search.sortBy === "price_asc" || search.sortBy === "price_desc"
      ? "basePrice"
      : search.sortBy === "newest"
      ? "createdAt"
      : undefined,
    sortOrder: search.sortBy === "price_asc" ? "asc" as const : "desc" as const,
  };

  // Fetch products
  const { data: productsData, isLoading } = useShopProducts(apiParams as any);
  const products = productsData?.data?.products || [];
  const pagination = (productsData?.data as any)?.pagination || productsData?.data?.meta;

  // Update URL params
  const updateSearch = (updates: Partial<SearchParams>) => {
    navigate({
      to: "/shop/products",
      search: (prev: SearchParams) => ({
        ...prev,
        ...updates,
        page: updates.page || (Object.keys(updates).length > 0 ? 1 : prev.page),
      }),
    });
  };

  // Apply price filter
  const handleApplyPriceFilter = () => {
    updateSearch({ minPrice: priceRange[0], maxPrice: priceRange[1] });
  };

  // Clear all filters
  const clearFilters = () => {
    navigate({ to: "/shop/products", search: {} });
    setPriceRange([0, 50000]);
  };

  // Active filter count
  const activeFilterCount = [
    search.category,
    search.minPrice || search.maxPrice,
    search.fabric,
  ].filter(Boolean).length;

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.filter((c: any) => !c.parentId).map((category: any) => (
            <div key={category.uuid} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.slug}`}
                checked={search.category === category.slug}
                onCheckedChange={(checked) => {
                  updateSearch({ category: checked ? category.slug : undefined });
                }}
              />
              <Label htmlFor={`cat-${category.slug}`} className="text-sm cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={50000}
            step={500}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground mb-3">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <Button size="sm" variant="outline" className="w-full" onClick={handleApplyPriceFilter}>
            Apply Price Filter
          </Button>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <h2 className="font-semibold mb-4">Filters</h2>
            <FilterContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {search.q ? `Search: "${search.q}"` : "All Products"}
            </h1>
            <p className="text-muted-foreground">
              {search.q
                ? `Found ${pagination?.total || 0} result${pagination?.total !== 1 ? "s" : ""}`
                : `Explore our collection of premium textiles`}
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <span className="text-sm text-muted-foreground">
                {pagination?.total || 0} products
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Grid Toggle */}
              <div className="hidden sm:flex items-center border rounded-md">
                <Button
                  variant={columns === 3 ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-none rounded-l-md"
                  onClick={() => setColumns(3)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={columns === 4 ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-none rounded-r-md"
                  onClick={() => setColumns(4)}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort */}
              <Select
                value={search.sortBy || "newest"}
                onValueChange={(value) => updateSearch({ sortBy: value as SortOption })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(search.category || search.q) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {search.category && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                  Category: {search.category}
                  <button
                    className="ml-1 hover:bg-muted rounded"
                    onClick={() => updateSearch({ category: undefined })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {search.q && (
                <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                  Search: {search.q}
                  <button
                    className="ml-1 hover:bg-muted rounded"
                    onClick={() => updateSearch({ q: undefined })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-square mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Products Grid */}
              <ProductGrid products={products} columns={columns} />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => updateSearch({ page: pagination.page - 1 })}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={pagination.page === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSearch({ page })}
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {pagination.totalPages > 5 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => updateSearch({ page: pagination.page + 1 })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* No Results */
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No products match your filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/shop/products/")({
  component: ProductsPage,
});
