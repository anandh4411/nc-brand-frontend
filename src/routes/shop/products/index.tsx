import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
import { SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react";
import { ProductGrid } from "@/features/shop/components/product-grid";
import {
  ProductFilters,
  FilterTags,
  type FilterState,
} from "@/features/shop/components/product-filters";
import { shopProducts, sortOptions } from "@/features/shop/data/mock-data";

type SortOption = "newest" | "price_asc" | "price_desc" | "popular" | "rating";

interface SearchParams {
  category?: string;
  sale?: boolean;
  new?: boolean;
  q?: string;
}

function ProductsPage() {
  const search = useSearch({ from: "/shop/products/" }) as SearchParams;
  const searchQuery = search?.q || "";
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [columns, setColumns] = useState<2 | 3 | 4>(4);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 50000],
    fabricTypes: [],
    onSale: search?.sale || false,
    newArrivals: search?.new || false,
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...shopProducts];

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.categoryName.toLowerCase().includes(query) ||
          p.fabricType.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      products = products.filter((p) =>
        filters.categories.includes(p.categoryId)
      );
    }

    // Price range filter
    products = products.filter(
      (p) =>
        p.basePrice >= filters.priceRange[0] &&
        p.basePrice <= filters.priceRange[1]
    );

    // Fabric type filter
    if (filters.fabricTypes.length > 0) {
      products = products.filter((p) =>
        filters.fabricTypes.includes(p.fabricType)
      );
    }

    // On sale filter
    if (filters.onSale) {
      products = products.filter((p) => p.isOnSale);
    }

    // New arrivals filter
    if (filters.newArrivals) {
      products = products.filter((p) => p.isNewArrival);
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        products.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price_desc":
        products.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "popular":
        products.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        products.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return products;
  }, [filters, sortBy, searchQuery]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {searchQuery ? `Search: "${searchQuery}"` : "All Products"}
        </h1>
        <p className="text-muted-foreground">
          {searchQuery
            ? `Found ${filteredProducts.length} result${filteredProducts.length !== 1 ? "s" : ""}`
            : `Explore our collection of ${shopProducts.length}+ premium textiles`}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <h2 className="font-semibold mb-4">Filters</h2>
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} products
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
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
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
          <FilterTags filters={filters} onFiltersChange={setFilters} />

          {/* Products Grid */}
          <ProductGrid products={filteredProducts} columns={columns} />

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No products match your filters
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    categories: [],
                    priceRange: [0, 50000],
                    fabricTypes: [],
                    onSale: false,
                    newArrivals: false,
                  })
                }
              >
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
