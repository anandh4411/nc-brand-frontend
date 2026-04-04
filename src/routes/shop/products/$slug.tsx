import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Camera,
  MessageSquare,
  Loader2,
  Tag,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProductGrid } from "@/features/shop/components/product-grid";
import {
  useShopProduct,
  useShopProducts,
  useAddToCart,
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
  useProductReviews,
  useCreateReview,
} from "@/api/hooks/shop";
import { useAuth } from "@/context/auth-context";

function ProductDetailPage() {
  const { slug } = useParams({ from: "/shop/products/$slug" });
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();

  // Fetch product
  const { data: productData, isLoading, error } = useShopProduct(slug);
  const product = productData?.data as any;

  // Fetch reviews
  const { data: reviewsData } = useProductReviews(product?.uuid || "");
  const reviewsResponse = reviewsData?.data as any;
  const reviews = reviewsResponse?.reviews || [];
  const reviewStats = reviewsResponse?.stats;

  // Fetch related products (same category)
  const { data: relatedData } = useShopProducts({
    categoryId: product?.categoryId,
    pageSize: 4,
  } as any);
  const relatedProducts = (relatedData?.data?.products || []).filter(
    (p: any) => p.slug !== slug
  ).slice(0, 4);

  // Wishlist
  const { data: wishlistData } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  // Cart
  const addToCart = useAddToCart();

  // Reviews
  const createReview = useCreateReview();

  // State
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Free product selection state
  const [freeColorIndex, setFreeColorIndex] = useState(0);
  const [freeVariantIndex, setFreeVariantIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("description");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", comment: "" });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-6 w-64 mb-6" />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-16 h-16" />
              ))}
            </div>
            <Skeleton className="flex-1 aspect-[3/4]" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-1/3" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error or not found
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The product you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/shop/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const colors = product.colors || [];
  const selectedColor = colors[selectedColorIndex];
  const variants = selectedColor?.variants || [];
  const selectedVariant = variants[selectedVariantIndex];
  const images = selectedColor?.images || [];
  const currentImage = images[currentImageIndex] || product.primaryImage || "/placeholder.svg";

  const finalPrice = product.basePrice + (selectedVariant?.priceAdjustment || 0);

  // Check if offer matches the currently selected color/size
  const offerMatchesSelection = (() => {
    if (!product.offer) return false;
    const offer = product.offer;
    // If offer specifies a target color, selected color must match
    if (offer.targetProduct && selectedColor?.uuid !== offer.targetProduct.uuid) return false;
    // If offer specifies a target size, selected variant must match
    if (offer.targetVariant && selectedVariant?.uuid !== offer.targetVariant.uuid) return false;
    return true;
  })();

  // Check if in wishlist
  const wishlistItems = wishlistData?.data || [];
  const inWishlist = selectedVariant
    ? wishlistItems.some((item: any) => item.variantUuid === selectedVariant.uuid)
    : false;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleColorChange = (index: number) => {
    setSelectedColorIndex(index);
    setSelectedVariantIndex(0);
    setCurrentImageIndex(0);
  };

  // Free product colors/variants from the offer
  const freeColors = product?.offer?.freeProductGroup?.colors || [];
  const selectedFreeColor = freeColors[freeColorIndex];
  const freeVariants = selectedFreeColor?.variants || [];
  const selectedFreeVariant = freeVariants[freeVariantIndex];

  const handleAddToCart = () => {
    if (!isAuthenticated || !isCustomer) {
      navigate({ to: "/customer/sign-in" } as any);
      return;
    }
    if (!selectedVariant) {
      toast.error("Please select a size");
      return;
    }

    // Build payload — include free variant if offer applies and customer selected one
    const payload: any = { variantUuid: selectedVariant.uuid, quantity };
    if (offerMatchesSelection && selectedFreeVariant?.inStock && selectedFreeVariant?.uuid) {
      payload.freeVariantUuid = selectedFreeVariant.uuid;
    }

    addToCart.mutate(payload, {
      onSuccess: () => {
        toast.success("Added to cart");
      },
    });
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated || !isCustomer) {
      toast.error("Please sign in to add to wishlist");
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select a size");
      return;
    }

    if (inWishlist) {
      removeFromWishlist.mutate(selectedVariant.uuid);
    } else {
      addToWishlist.mutate(selectedVariant.uuid);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const scrollToReviews = () => {
    setActiveTab("reviews");
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmitReview = () => {
    if (!newReview.title || !newReview.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    createReview.mutate(
      {
        productGroupId: product.id,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
      } as any,
      {
        onSuccess: () => {
          setReviewModalOpen(false);
          setNewReview({ rating: 5, title: "", comment: "" });
        },
      }
    );
  };

  const formatReviewDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Rating breakdown (calculate from reviews or use stats)
  const ratingBreakdown = reviewStats?.breakdown || {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/shop">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/shop/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="flex gap-4">
          {/* Vertical Thumbnails */}
          {images.length > 1 && (
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
              {images.map((img: any, index: number) => (
                <button
                  key={index}
                  className={cn(
                    "w-16 h-16 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer",
                    currentImageIndex === index
                      ? "border-primary ring-1 ring-primary"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                  onMouseEnter={() => setCurrentImageIndex(index)}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img.imageUrl || img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div
            ref={imageContainerRef}
            className="flex-1 relative aspect-[3/4] bg-muted rounded-lg overflow-hidden cursor-crosshair"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={typeof currentImage === 'string' ? currentImage : currentImage.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
            />
            {/* Zoom Lens */}
            {isZooming && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${typeof currentImage === 'string' ? currentImage : currentImage.imageUrl})`,
                  backgroundSize: "200%",
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isFeatured && (
                <Badge className="bg-blue-500 hover:bg-blue-600">Featured</Badge>
              )}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev - 1 + images.length) % images.length
                    )
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev + 1) % images.length)
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & Title */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {product.category?.name || product.categoryName}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>
            {/* Fabric & Pattern badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {product.fabricType && (
                <Badge variant="outline">{product.fabricType}</Badge>
              )}
              {product.pattern && (
                <Badge variant="outline">{product.pattern}</Badge>
              )}
            </div>
          </div>

          {/* Offer Note — only when selected color/size matches the offer */}
          {offerMatchesSelection && (
            <div className="text-green-700 dark:text-green-300 text-sm">
              <p className="font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {product.offer.name || `Buy ${product.offer.buyQuantity} Get ${product.offer.freeQuantity} Free`}
              </p>
              {(product.offer.targetProduct || product.offer.targetVariant) && (
                <p className="text-xs mt-0.5 ml-6 text-green-600 dark:text-green-400">
                  Applicable for: {product.offer.targetProduct?.colorName}{product.offer.targetVariant ? ` / ${product.offer.targetVariant.size}` : ""}
                </p>
              )}
            </div>
          )}

          {/* Rating & Reviews disabled - has bugs */}

          {/* Price */}
          <div className="flex items-center gap-3">
            {product.offerPrice && product.offerPrice < product.basePrice ? (
              <>
                <span className="text-3xl font-bold">
                  {formatPrice(product.offerPrice + (selectedVariant?.priceAdjustment || 0))}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(finalPrice)}
                </span>
                <span className="text-sm text-green-600 font-semibold">
                  {Math.round(((product.basePrice - product.offerPrice) / product.basePrice) * 100)}% off
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">{formatPrice(finalPrice)}</span>
            )}
          </div>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">
                Color: <span className="font-normal">{selectedColor?.colorName}</span>
              </p>
              <div className="flex gap-2">
                {colors.map((color: any, index: number) => (
                  <button
                    key={color.uuid || index}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition-all cursor-pointer",
                      selectedColorIndex === index
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-gray-300"
                    )}
                    style={{ backgroundColor: color.colorCode }}
                    title={color.colorName}
                    onClick={() => handleColorChange(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {variants.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant: any, index: number) => (
                  <button
                    key={variant.uuid || index}
                    className={cn(
                      "px-4 py-2 border rounded-md text-sm transition-all cursor-pointer",
                      selectedVariantIndex === index
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-gray-300 hover:border-primary",
                      (variant.stockQuantity ?? variant.stock ?? 0) === 0 && "opacity-50 !cursor-not-allowed line-through"
                    )}
                    disabled={(variant.stockQuantity ?? variant.stock ?? 0) === 0}
                    onClick={() => setSelectedVariantIndex(index)}
                  >
                    {variant.size}
                    {(variant.stockQuantity ?? variant.stock ?? 0) === 0 && " (Out of Stock)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-3">Quantity</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={quantity >= (selectedVariant?.stockQuantity || selectedVariant?.stock || 10)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              {selectedVariant && (
                <span className="text-sm text-muted-foreground ml-2">
                  {selectedVariant.stockQuantity ?? selectedVariant.stock ?? 0} in stock
                </span>
              )}
            </div>
          </div>

          {/* Free Product Offer — customer picks color/size */}
          {offerMatchesSelection && product.offer?.freeProductGroup && freeColors.length > 0 && (
            <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30 p-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                  <img
                    src={product.offer.freeProductGroup.primaryImage || "/placeholder.svg"}
                    alt={product.offer.freeProductGroup.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-[10px] px-1.5 py-0">
                    FREE
                  </Badge>
                  <p className="text-sm font-medium mt-0.5">
                    {product.offer.freeProductGroup.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Buy {product.offer.buyQuantity}, get {product.offer.freeQuantity} free — choose your preference:
                  </p>
                </div>
              </div>

              {/* Free product color selector */}
              <div>
                <p className="text-xs font-medium mb-1.5">Color:</p>
                <div className="flex gap-2 flex-wrap">
                  {freeColors.map((color: any, index: number) => (
                    <button
                      key={color.uuid}
                      type="button"
                      className={cn(
                        "h-7 w-7 rounded-full border-2 transition-all",
                        freeColorIndex === index
                          ? "border-green-600 ring-2 ring-green-600/30 scale-110"
                          : "border-muted hover:scale-105"
                      )}
                      style={{ backgroundColor: color.colorCode }}
                      title={color.colorName}
                      onClick={() => {
                        setFreeColorIndex(index);
                        setFreeVariantIndex(0);
                      }}
                    />
                  ))}
                </div>
                {selectedFreeColor && (
                  <p className="text-xs text-muted-foreground mt-1">{selectedFreeColor.colorName}</p>
                )}
              </div>

              {/* Free product size selector */}
              {freeVariants.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1.5">Size:</p>
                  <div className="flex gap-2 flex-wrap">
                    {freeVariants.map((v: any, index: number) => (
                      <button
                        key={v.uuid}
                        type="button"
                        disabled={!v.inStock}
                        className={cn(
                          "px-3 py-1 text-xs rounded-md border transition-all",
                          !v.inStock
                            ? "opacity-40 line-through cursor-not-allowed"
                            : freeVariantIndex === index
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-muted hover:border-green-400"
                        )}
                        onClick={() => setFreeVariantIndex(index)}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                  {selectedFreeVariant && !selectedFreeVariant.inStock && (
                    <p className="text-xs text-destructive mt-1">This size is out of stock. Please choose another.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Delivery Note / Pre-booking */}
          {product.deliveryNote && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
              <Truck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Delivery Note</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">{product.deliveryNote}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!selectedVariant || (selectedVariant.stockQuantity ?? selectedVariant.stock ?? 0) === 0 || addToCart.isPending}
            >
              {addToCart.isPending ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <ShoppingCart className="h-5 w-5 mr-2" />
              )}
              {selectedVariant && (selectedVariant.stockQuantity ?? selectedVariant.stock ?? 0) === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            {/* Wishlist disabled - has bugs */}
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <Truck className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Shipping charges may apply</p>
            </div>
            <div className="text-center">
              <Shield className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Quality Assured</p>
            </div>
            <div className="text-center">
              <RefreshCw className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12" ref={tabsRef}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="care">Care Instructions</TabsTrigger>
            {/* Reviews tab disabled - has bugs */}
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </TabsContent>
          <TabsContent value="details" className="mt-4">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium">Fabric Type</dt>
                <dd className="text-muted-foreground">{product.fabricType || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Pattern</dt>
                <dd className="text-muted-foreground">{product.pattern || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Category</dt>
                <dd className="text-muted-foreground">{product.categoryName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">SKU</dt>
                <dd className="text-muted-foreground">{selectedVariant?.sku || "N/A"}</dd>
              </div>
            </dl>
          </TabsContent>
          <TabsContent value="care" className="mt-4">
            <p className="text-muted-foreground">{product.careInstructions || "No care instructions available."}</p>
          </TabsContent>
          {/* Reviews TabsContent disabled - has bugs */}
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </div>
      )}

      {/* Write Review Modal disabled - has bugs */}
    </div>
  );
}

export const Route = createFileRoute("/shop/products/$slug")({
  component: ProductDetailPage,
});
