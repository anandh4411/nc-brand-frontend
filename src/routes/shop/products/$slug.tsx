import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { toast } from "sonner";
import { getProductBySlug, type ShopProductColor, type ShopProductVariant } from "@/features/shop/data/mock-data";
import { ProductGrid } from "@/features/shop/components/product-grid";
import { shopProducts } from "@/features/shop/data/mock-data";

function ProductDetailPage() {
  const { slug } = useParams({ from: "/shop/products/$slug" });
  const product = getProductBySlug(slug);
  const { addItem: addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState<ShopProductColor | null>(
    product?.colors[0] || null
  );
  const [selectedVariant, setSelectedVariant] = useState<ShopProductVariant | null>(
    product?.colors[0]?.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  if (!product) {
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

  const inWishlist = isInWishlist(product.id);
  const images = selectedColor?.images || [];
  const currentImage = images[currentImageIndex] || "/placeholder-product.jpg";

  const finalPrice = product.basePrice + (selectedVariant?.priceAdjustment || 0);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleColorChange = (color: ShopProductColor) => {
    setSelectedColor(color);
    setSelectedVariant(color.variants[0]);
    setCurrentImageIndex(0);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedVariant) {
      toast.error("Please select size and color");
      return;
    }

    addToCart({
      productId: product.id,
      productGroupId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      colorName: selectedColor.colorName,
      size: selectedVariant.size,
      price: finalPrice,
      quantity,
      imageUrl: currentImage,
      sku: selectedVariant.sku,
      maxQuantity: selectedVariant.stock,
    });
  };

  const handleWishlistClick = () => {
    toggleWishlist({
      productGroupId: product.id,
      name: product.name,
      basePrice: product.basePrice,
      imageUrl: currentImage,
      categoryName: product.categoryName,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Related products (same category)
  const relatedProducts = useMemo(() => {
    return shopProducts
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

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
        {/* Image Gallery - Amazon Style */}
        <div className="flex gap-4">
          {/* Vertical Thumbnails */}
          {images.length > 1 && (
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-16 h-16 rounded-md overflow-hidden border-2 shrink-0 transition-all",
                    currentImageIndex === index
                      ? "border-primary ring-1 ring-primary"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                  onMouseEnter={() => setCurrentImageIndex(index)}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
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
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Zoom Lens */}
            {isZooming && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${currentImage})`,
                  backgroundSize: "200%",
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNewArrival && (
                <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
              )}
              {discount > 0 && (
                <Badge variant="destructive">{discount}% OFF</Badge>
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
              {product.categoryName}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">{formatPrice(finalPrice)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge variant="destructive">{discount}% OFF</Badge>
              </>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <p className="text-sm font-medium mb-3">
              Color: <span className="font-normal">{selectedColor?.colorName}</span>
            </p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 transition-all",
                    selectedColor?.id === color.id
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-gray-300"
                  )}
                  style={{ backgroundColor: color.colorCode }}
                  title={color.colorName}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          {selectedColor && selectedColor.variants.length > 1 && (
            <div>
              <p className="text-sm font-medium mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {selectedColor.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={cn(
                      "px-4 py-2 border rounded-md text-sm transition-all",
                      selectedVariant?.id === variant.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-gray-300 hover:border-primary",
                      variant.stock === 0 && "opacity-50 cursor-not-allowed line-through"
                    )}
                    disabled={variant.stock === 0}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.size}
                    {variant.stock === 0 && " (Out of Stock)"}
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
                disabled={quantity >= (selectedVariant?.stock || 10)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              {selectedVariant && (
                <span className="text-sm text-muted-foreground ml-2">
                  {selectedVariant.stock} in stock
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlistClick}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  inWishlist && "fill-red-500 text-red-500"
                )}
              />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <Truck className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Free Shipping</p>
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
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="care">Care Instructions</TabsTrigger>
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
                <dd className="text-muted-foreground">{product.fabricType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Pattern</dt>
                <dd className="text-muted-foreground">{product.pattern}</dd>
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
            <p className="text-muted-foreground">{product.careInstructions}</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/shop/products/$slug")({
  component: ProductDetailPage,
});
