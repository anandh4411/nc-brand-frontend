// src/features/products/components/subcategory-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubCategory } from "../data/schema";

interface SubCategoryCardProps {
  subCategory: SubCategory;
  productCount: number;
}

export const SubCategoryCard = ({
  subCategory,
  productCount,
}: SubCategoryCardProps) => {
  return (
    <Card className="hover:border-primary/20 transition-all">
      <CardHeader className="pb-3">
        <div>
          <CardTitle className="text-base font-semibold">
            {subCategory.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {productCount} products
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {subCategory.description}
        </p>
      </CardContent>
    </Card>
  );
};
