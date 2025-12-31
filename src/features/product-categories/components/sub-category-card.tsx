import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Folder } from "lucide-react";
import type { SubCategoryData } from "@/types/dto/sub-category.dto";

interface SubCategoryCardProps {
  category: SubCategoryData;
  mainCategoryName: string;
  onEdit: (category: SubCategoryData) => void;
  onDelete: (category: SubCategoryData) => void;
}

export function SubCategoryCard({
  category,
  mainCategoryName,
  onEdit,
  onDelete,
}: SubCategoryCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{mainCategoryName}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(category)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {category.description && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
