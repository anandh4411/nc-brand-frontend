import { ProductCard } from "./product-card";
import type { ShopProduct } from "../data/mock-data";

interface ProductGridProps {
  products: ShopProduct[];
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
