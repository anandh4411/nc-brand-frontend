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
  ThumbsUp,
  Camera,
  MessageSquare,
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
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { toast } from "sonner";
import { getProductBySlug, type ShopProductColor, type ShopProductVariant } from "@/features/shop/data/mock-data";
import { ProductGrid } from "@/features/shop/components/product-grid";
import { shopProducts } from "@/features/shop/data/mock-data";

// Mock reviews data
interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: "1",
    userName: "Priya Sharma",
    rating: 5,
    date: "2024-12-15",
    title: "Absolutely beautiful!",
    comment: "The fabric quality is amazing and the colors are exactly as shown. Perfect for festive occasions. Received many compliments!",
    images: [
      "https://picsum.photos/seed/review1-1/200/200",
      "https://picsum.photos/seed/review1-2/200/200",
    ],
    helpful: 24,
    verified: true,
  },
  {
    id: "2",
    userName: "Anjali Reddy",
    rating: 4,
    date: "2024-12-10",
    title: "Great product, minor delay in shipping",
    comment: "Love the design and quality. The saree drapes beautifully. Only issue was shipping took a bit longer than expected.",
    helpful: 12,
    verified: true,
  },
  {
    id: "3",
    userName: "Meera Patel",
    rating: 5,
    date: "2024-12-05",
    title: "Worth every penny!",
    comment: "Exceptional craftsmanship. The zari work is intricate and the silk is pure. Will definitely buy more from this brand.",
    images: [
      "https://picsum.photos/seed/review3-1/200/200",
    ],
    helpful: 18,
    verified: true,
  },
  {
    id: "4",
    userName: "Kavitha Nair",
    rating: 4,
    date: "2024-11-28",
    title: "Good quality",
    comment: "Nice fabric and good finish. Colors are vibrant. Packaging was also very good.",
    helpful: 8,
    verified: false,
  },
  {
    id: "5",
    userName: "Deepa Krishnan",
    rating: 3,
    date: "2024-11-20",
    title: "Decent but expected more",
    comment: "The product is okay but I expected better quality at this price point. The design is nice though.",
    helpful: 5,
    verified: true,
  },
];

const ratingBreakdown = {
  5: 65,
  4: 20,
  3: 10,
  2: 3,
  1: 2,
};

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
  const [activeTab, setActiveTab] = useState("description");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", comment: "" });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

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

  const scrollToReviews = () => {
    setActiveTab("reviews");
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmitReview = () => {
    if (!newReview.title || !newReview.comment) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Review submitted successfully!");
    setReviewModalOpen(false);
    setNewReview({ rating: 5, title: "", comment: "" });
  };

  const formatReviewDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
                    "w-16 h-16 rounded-md overflow-hidden border-2 shrink-0 transition-all cursor-pointer",
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

          {/* Rating - Clickable to scroll to reviews */}
          <button
            onClick={scrollToReviews}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
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
            <span className="text-sm text-muted-foreground underline">
              ({product.reviewCount} reviews)
            </span>
          </button>

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
                    "h-10 w-10 rounded-full border-2 transition-all cursor-pointer",
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
                      "px-4 py-2 border rounded-md text-sm transition-all cursor-pointer",
                      selectedVariant?.id === variant.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-gray-300 hover:border-primary",
                      variant.stock === 0 && "opacity-50 !cursor-not-allowed line-through"
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
      <div className="mt-12" ref={tabsRef}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="care">Care Instructions</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviewCount})
            </TabsTrigger>
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
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-8">
              {/* Rating Summary */}
              <div className="grid md:grid-cols-[300px_1fr] gap-8">
                {/* Overall Rating */}
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-5xl font-bold mb-2">{product.rating}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on {product.reviewCount} reviews
                  </p>
                  <Button onClick={() => setReviewModalOpen(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Write a Review
                  </Button>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm w-12">{star} star</span>
                      <Progress
                        value={ratingBreakdown[star as keyof typeof ratingBreakdown]}
                        className="flex-1 h-2"
                      />
                      <span className="text-sm text-muted-foreground w-12">
                        {ratingBreakdown[star as keyof typeof ratingBreakdown]}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Images */}
              {mockReviews.some((r) => r.images?.length) && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Customer Photos
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {mockReviews
                      .flatMap((r) => r.images || [])
                      .slice(0, 6)
                      .map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Customer photo ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 hover:ring-2 hover:ring-primary transition-all"
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                <h3 className="font-semibold">Customer Reviews</h3>
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {review.userName.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.userName}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-3 w-3",
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatReviewDate(review.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium mb-1">{review.title}</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      {review.comment}
                    </p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Review image ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          />
                        ))}
                      </div>
                    )}
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            </div>
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

      {/* Write Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Rating Selection */}
            <div>
              <Label className="mb-2 block">Your Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        star <= newReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div>
              <Label htmlFor="review-title">Review Title</Label>
              <Input
                id="review-title"
                placeholder="Summarize your experience"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, title: e.target.value }))
                }
                className="mt-1.5"
              />
            </div>

            {/* Review Comment */}
            <div>
              <Label htmlFor="review-comment">Your Review</Label>
              <Textarea
                id="review-comment"
                placeholder="Share your experience with this product..."
                rows={4}
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                className="mt-1.5"
              />
            </div>

            {/* Image Upload Placeholder */}
            <div>
              <Label>Add Photos (Optional)</Label>
              <div className="mt-1.5 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag photos here or click to upload
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute("/shop/products/$slug")({
  component: ProductDetailPage,
});
