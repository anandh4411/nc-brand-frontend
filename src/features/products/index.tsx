// src/features/products/index.tsx
import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FolderTree, Package as PackageIcon, Loader2 } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "./components/product-card";
import { SubCategoryCard } from "./components/subcategory-card";
import { ProductFormModal } from "./components/product-form-modal";
import { ProductDeleteDialog } from "./components/product-delete-dialog";
import { ProductViewModal } from "./components/product-view-modal";
import { useProducts } from "@/api/hooks/products";
import { useMainCategories, useSubCategories } from "@/api/hooks/categories";
import { ProductData } from "@/types/dto/product.dto";

const DEFAULT_PAGE_SIZE = 100;

export default function Products() {
  // Dialog states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    null
  );
  const [activeMainCategory, setActiveMainCategory] = useState<number | null>(
    null
  );

  // Fetch categories
  const { data: mainCategoriesData, isLoading: isLoadingMainCategories } =
    useMainCategories();
  const { data: subCategoriesData, isLoading: isLoadingSubCategories } =
    useSubCategories();

  // Fetch products
  const queryParams = useMemo(
    () => ({
      mainCategoryId: activeMainCategory || undefined,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
    [activeMainCategory]
  );

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error,
  } = useProducts(queryParams);

  // Extract data from responses
  const mainCategories = Array.isArray(mainCategoriesData?.data?.mainCategories)
    ? mainCategoriesData.data.mainCategories
    : [];
  const allSubCategories = Array.isArray(subCategoriesData?.data?.subCategories)
    ? subCategoriesData.data.subCategories
    : [];
  const products = Array.isArray(productsData?.data?.products)
    ? productsData.data.products
    : [];

  // Set initial active main category when data loads
  useEffect(() => {
    if (mainCategories.length > 0 && activeMainCategory === null) {
      setActiveMainCategory(mainCategories[0].id!);
    }
  }, [mainCategories, activeMainCategory]);

  // Filter data
  const activeSubCategories = allSubCategories.filter(
    (sc: { mainCategoryId?: number }) =>
      sc.mainCategoryId === activeMainCategory
  );

  const activeProducts = products.filter(
    (p: ProductData) => p.mainCategoryId === activeMainCategory
  );

  const productsBySubCategory = activeProducts.reduce(
    (acc: Record<number, ProductData[]>, product: ProductData) => {
      if (!acc[product.subCategoryId!]) {
        acc[product.subCategoryId!] = [];
      }
      acc[product.subCategoryId!].push(product);
      return acc;
    },
    {} as Record<number, ProductData[]>
  );

  // Action handlers
  const handleProductEdit = (product: ProductData) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleProductDelete = (product: ProductData) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleProductView = (product: ProductData) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  // Combined loading state
  const isLoading =
    isLoadingProducts || isLoadingMainCategories || isLoadingSubCategories;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-[500] tracking-tight text-foreground">
          Products Management
        </h1>
        <p className="text-muted-foreground">
          Manage categories and products across all sections
        </p>
      </div>

      {/* Loading State */}
      {isLoading && mainCategories.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : mainCategories.length === 0 ? (
        /* Empty State - No Categories */
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FolderTree className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No Categories Yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Create main categories and subcategories first to start managing
                products.
              </p>
            </div>
            <Button
              onClick={() =>
                (window.location.href = "/dashboard/product-categories")
              }
            >
              Go to Product Categories
            </Button>
          </div>
        </div>
      ) : (
        /* Main Category Tabs */
        <Tabs
          value={activeMainCategory?.toString() || ""}
          onValueChange={(value) => setActiveMainCategory(Number(value))}
        >
          <TabsList className="w-full justify-start overflow-x-auto">
            {mainCategories.map((cat: { id?: number; name?: string }) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id!.toString()}
                className="text-sm cursor-pointer"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {mainCategories.map((mainCat: { id?: number; name?: string }) => (
            <TabsContent
              key={mainCat.id}
              value={mainCat.id!.toString()}
              className="space-y-8 mt-6"
            >
              {isLoadingProducts ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-2">
                    <p className="text-destructive font-medium">
                      Failed to load products
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {error.message}
                    </p>
                  </div>
                </div>
              ) : activeSubCategories.length === 0 ? (
                /* Empty State - No Subcategories */
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <FolderTree className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        No Subcategories
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Create subcategories in this main category to organize
                        your products.
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        (window.location.href = "/dashboard/product-categories")
                      }
                    >
                      Manage Categories
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Sub Categories Section */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <FolderTree className="h-5 w-5" />
                      Sub Categories
                    </h2>

                    {activeSubCategories.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeSubCategories.map((subCat: any) => (
                          <SubCategoryCard
                            key={subCat.uuid || subCat.id}
                            subCategory={subCat}
                            productCount={
                              productsBySubCategory[subCat.id!]?.length || 0
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-dashed rounded-lg">
                        <FolderTree className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          No sub categories yet. Create them in Product Categories page.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Products by Sub Category */}
                  {activeSubCategories.map((subCat: any) => {
                    const subCatProducts =
                      productsBySubCategory[subCat.id!] || [];

                    return (
                      <div key={subCat.uuid || subCat.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              <PackageIcon className="h-4 w-4" />
                              {subCat.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {subCat.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProduct(null);
                              setProductModalOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                          </Button>
                        </div>

                        {isLoadingProducts ? (
                          <div className="flex flex-wrap gap-4">
                            {[...Array(3)].map((_, i) => (
                              <ProductCardSkeleton key={i} />
                            ))}
                          </div>
                        ) : subCatProducts.length > 0 ? (
                          <div className="flex flex-wrap gap-4">
                            {subCatProducts.map((product: ProductData) => (
                              <ProductCard
                                key={product.uuid || product.id}
                                product={product}
                                onEdit={handleProductEdit}
                                onDelete={handleProductDelete}
                                onView={handleProductView}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 border border-dashed rounded-lg bg-muted/20">
                            <p className="text-sm text-muted-foreground">
                              No products in this category yet
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Modals */}
      <ProductFormModal
        open={productModalOpen}
        onOpenChange={setProductModalOpen}
        product={selectedProduct || undefined}
        subCategories={activeSubCategories}
        mainCategoryId={activeMainCategory!}
      />

      {selectedProduct && (
        <>
          <ProductDeleteDialog
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            product={selectedProduct}
          />

          <ProductViewModal
            isOpen={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            product={selectedProduct}
          />
        </>
      )}
    </div>
  );
}
