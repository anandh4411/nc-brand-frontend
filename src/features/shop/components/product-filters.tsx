import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useShopCategories } from "@/api/hooks/shop";

const fabricTypeOptions = [
  { label: "Cotton", value: "cotton" },
  { label: "Silk", value: "silk" },
  { label: "Linen", value: "linen" },
  { label: "Polyester", value: "polyester" },
  { label: "Wool", value: "wool" },
  { label: "Blend", value: "blend" },
];

export interface FilterState {
  categories: number[];
  priceRange: [number, number];
  fabricTypes: string[];
  onSale: boolean;
  newArrivals: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  maxPrice?: number;
}

export function ProductFilters({
  filters,
  onFiltersChange,
  maxPrice = 50000,
}: ProductFiltersProps) {
  const { data: categoriesData } = useShopCategories();
  const categories = categoriesData?.data || [];
  const mainCategories = categories.filter((c: any) => !c.parentId);

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleFabricChange = (fabric: string, checked: boolean) => {
    const newFabrics = checked
      ? [...filters.fabricTypes, fabric]
      : filters.fabricTypes.filter((f) => f !== fabric);
    onFiltersChange({ ...filters, fabricTypes: newFabrics });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, maxPrice],
      fabricTypes: [],
      onSale: false,
      newArrivals: false,
    });
  };

  const activeFilterCount =
    filters.categories.length +
    filters.fabricTypes.length +
    (filters.onSale ? 1 : 0) +
    (filters.newArrivals ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between pb-4 border-b">
          <span className="text-sm font-medium">
            {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={["categories", "price", "fabric"]}
        className="w-full"
      >
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {mainCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {category.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    ({(category as any).productCount ?? 0})
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                value={[filters.priceRange[0], filters.priceRange[1]]}
                onValueChange={handlePriceChange}
                max={maxPrice}
                step={500}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Fabric Type */}
        <AccordionItem value="fabric">
          <AccordionTrigger className="text-sm font-medium">
            Fabric Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {fabricTypeOptions.slice(0, 8).map((fabric) => (
                <div key={fabric.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fabric-${fabric.value}`}
                    checked={filters.fabricTypes.includes(fabric.value)}
                    onCheckedChange={(checked) =>
                      handleFabricChange(fabric.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`fabric-${fabric.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {fabric.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Quick Filters */}
        <AccordionItem value="quick">
          <AccordionTrigger className="text-sm font-medium">
            Quick Filters
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="on-sale"
                  checked={filters.onSale}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, onSale: checked as boolean })
                  }
                />
                <Label
                  htmlFor="on-sale"
                  className="text-sm font-normal cursor-pointer"
                >
                  On Sale
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-arrivals"
                  checked={filters.newArrivals}
                  onCheckedChange={(checked) =>
                    onFiltersChange({
                      ...filters,
                      newArrivals: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor="new-arrivals"
                  className="text-sm font-normal cursor-pointer"
                >
                  New Arrivals
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Mobile Filter Tags
export function FilterTags({
  filters,
  onFiltersChange,
  maxPrice = 50000,
}: ProductFiltersProps) {
  const removeCategory = (categoryId: number) => {
    onFiltersChange({
      ...filters,
      categories: filters.categories.filter((id) => id !== categoryId),
    });
  };

  const removeFabric = (fabric: string) => {
    onFiltersChange({
      ...filters,
      fabricTypes: filters.fabricTypes.filter((f) => f !== fabric),
    });
  };

  const { data: categoriesData } = useShopCategories();
  const categories = categoriesData?.data || [];

  const getCategoryName = (id: number) =>
    categories.find((c: any) => c.id === id)?.name || "";

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.fabricTypes.length > 0 ||
    filters.onSale ||
    filters.newArrivals;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {filters.categories.map((id) => (
        <Badge
          key={id}
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80"
          onClick={() => removeCategory(id)}
        >
          {getCategoryName(id)}
          <X className="h-3 w-3" />
        </Badge>
      ))}
      {filters.fabricTypes.map((fabric) => (
        <Badge
          key={fabric}
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80"
          onClick={() => removeFabric(fabric)}
        >
          {fabric}
          <X className="h-3 w-3" />
        </Badge>
      ))}
      {filters.onSale && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80"
          onClick={() => onFiltersChange({ ...filters, onSale: false })}
        >
          On Sale
          <X className="h-3 w-3" />
        </Badge>
      )}
      {filters.newArrivals && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80"
          onClick={() => onFiltersChange({ ...filters, newArrivals: false })}
        >
          New Arrivals
          <X className="h-3 w-3" />
        </Badge>
      )}
    </div>
  );
}
