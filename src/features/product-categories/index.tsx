import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { MainCategoryCard } from "./components/main-category-card";
import { SubCategoryCard } from "./components/sub-category-card";
import { MainCategoryFormModal } from "./components/main-category-form-modal";
import { SubCategoryFormModal } from "./components/sub-category-form-modal";
import { MainCategoryDeleteDialog } from "./components/main-category-delete-dialog";
import { SubCategoryDeleteDialog } from "./components/sub-category-delete-dialog";
import {
  useMainCategories,
  useSubCategories,
} from "@/api/hooks/categories";
import type { MainCategoryData } from "@/types/dto/main-category.dto";
import type { SubCategoryData } from "@/types/dto/sub-category.dto";

export default function ProductCategories() {
  // Dialog states
  const [mainCategoryModalOpen, setMainCategoryModalOpen] = useState(false);
  const [subCategoryModalOpen, setSubCategoryModalOpen] = useState(false);
  const [mainDeleteModalOpen, setMainDeleteModalOpen] = useState(false);
  const [subDeleteModalOpen, setSubDeleteModalOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategoryData | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryData | null>(null);

  // Fetch data
  const { data: mainCategoriesData, isLoading: isLoadingMain, error: mainError } = useMainCategories();
  const { data: subCategoriesData, isLoading: isLoadingSub, error: subError } = useSubCategories();

  const mainCategories = Array.isArray(mainCategoriesData?.data?.mainCategories)
    ? mainCategoriesData.data.mainCategories
    : [];
  const subCategories = Array.isArray(subCategoriesData?.data?.subCategories)
    ? subCategoriesData.data.subCategories
    : [];

  // Group subcategories by main category
  const subCategoriesByMain = subCategories.reduce((acc: Record<number, SubCategoryData[]>, sub: SubCategoryData) => {
    if (!acc[sub.mainCategoryId!]) {
      acc[sub.mainCategoryId!] = [];
    }
    acc[sub.mainCategoryId!].push(sub);
    return acc;
  }, {} as Record<number, SubCategoryData[]>);

  // Action handlers - Main Categories
  const handleMainCategoryEdit = (category: MainCategoryData) => {
    setSelectedMainCategory(category);
    setMainCategoryModalOpen(true);
  };

  const handleMainCategoryDelete = (category: MainCategoryData) => {
    setSelectedMainCategory(category);
    setMainDeleteModalOpen(true);
  };

  // Action handlers - Sub Categories
  const handleSubCategoryEdit = (category: SubCategoryData) => {
    setSelectedSubCategory(category);
    setSubCategoryModalOpen(true);
  };

  const handleSubCategoryDelete = (category: SubCategoryData) => {
    setSelectedSubCategory(category);
    setSubDeleteModalOpen(true);
  };

  const isLoading = isLoadingMain || isLoadingSub;
  const error = mainError || subError;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-[500] tracking-tight text-foreground">
            Product Categories
          </h1>
          <p className="text-muted-foreground">
            Manage main categories and subcategories for products
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedMainCategory(null);
            setMainCategoryModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Main Category
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <p className="text-destructive font-medium">Failed to load categories</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      ) : mainCategories.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No main categories yet</p>
            <Button
              onClick={() => {
                setSelectedMainCategory(null);
                setMainCategoryModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Main Category
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="main-categories">
          <TabsList>
            <TabsTrigger value="main-categories">Main Categories</TabsTrigger>
            <TabsTrigger value="sub-categories">Sub Categories</TabsTrigger>
          </TabsList>

          {/* Main Categories Tab */}
          <TabsContent value="main-categories" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainCategories.map((category: MainCategoryData) => (
                <MainCategoryCard
                  key={category.uuid}
                  category={category}
                  subCategoryCount={subCategoriesByMain[category.id!]?.length || 0}
                  onEdit={handleMainCategoryEdit}
                  onDelete={handleMainCategoryDelete}
                />
              ))}
            </div>
          </TabsContent>

          {/* Sub Categories Tab */}
          <TabsContent value="sub-categories" className="space-y-6 mt-6">
            {mainCategories.map((mainCat: MainCategoryData) => {
              const subs = subCategoriesByMain[mainCat.id!] || [];

              return (
                <div key={mainCat.uuid} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{mainCat.name}</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSubCategory({ mainCategoryId: mainCat.id } as SubCategoryData);
                        setSubCategoryModalOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subcategory
                    </Button>
                  </div>

                  {subs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subs.map((sub: SubCategoryData) => (
                        <SubCategoryCard
                          key={sub.uuid}
                          category={sub}
                          mainCategoryName={mainCat.name || ""}
                          onEdit={handleSubCategoryEdit}
                          onDelete={handleSubCategoryDelete}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        No subcategories in {mainCat.name}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      )}

      {/* Modals */}
      <MainCategoryFormModal
        open={mainCategoryModalOpen}
        onOpenChange={setMainCategoryModalOpen}
        category={selectedMainCategory || undefined}
      />

      <SubCategoryFormModal
        open={subCategoryModalOpen}
        onOpenChange={setSubCategoryModalOpen}
        category={selectedSubCategory || undefined}
        mainCategories={mainCategories}
      />

      {selectedMainCategory && (
        <MainCategoryDeleteDialog
          isOpen={mainDeleteModalOpen}
          onClose={() => setMainDeleteModalOpen(false)}
          category={selectedMainCategory}
        />
      )}

      {selectedSubCategory && (
        <SubCategoryDeleteDialog
          isOpen={subDeleteModalOpen}
          onClose={() => setSubDeleteModalOpen(false)}
          category={selectedSubCategory}
        />
      )}
    </div>
  );
}
