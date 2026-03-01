import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Truck, Shield, CreditCard, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductGrid } from "@/features/shop/components/product-grid";
import { PageSpinner } from "@/components/page-spinner";
import {
  useShopFeatured,
  useShopBanners,
  useShopProducts,
} from "@/api/hooks/shop";

function ShopHomepage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  // Fetch data from API
  const { data: featuredData, isLoading: featuredLoading } = useShopFeatured();
  const { data: bannersData, isLoading: bannersLoading } = useShopBanners();
  const { data: productsData, isLoading: productsLoading } = useShopProducts({ pageSize: 8 });

  const featuredProducts = featuredData?.data || [];
  const banners = bannersData?.data || [];
  const newArrivals = productsData?.data?.products || [];

  const isLoading = featuredLoading || bannersLoading || productsLoading;

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  if (isLoading) {
    return <PageSpinner className="min-h-[60vh]" size="lg" />;
  }

  return (
    <div className="flex flex-col">
      {/* Hero Banner Carousel */}
      {banners.length > 0 && (
        <section className="relative overflow-hidden">
          <div className="relative grid">
            {banners.map((banner: any, index: number) => (
              <div
                key={banner.id || index}
                className={`col-start-1 row-start-1 transition-opacity duration-500 ${
                  index === currentBanner ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Link to={banner.link || "/shop/products"} className="block w-full relative">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || "Banner"}
                    className="w-full h-auto block"
                  />
                  {banner.title && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-white">{banner.title}</h1>
                      </div>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
          {/* Banner Navigation */}
          {banners.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
                onClick={prevBanner}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
                onClick={nextBanner}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_: any, index: number) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentBanner ? "w-6 bg-white" : "w-2 bg-white/50"
                    }`}
                    onClick={() => setCurrentBanner(index)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Features Strip */}
      <section className="py-6 border-y bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Quality Assured</p>
                <p className="text-xs text-muted-foreground">100% Authentic</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">Multiple options</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-muted-foreground">7 days policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Featured Products</h2>
                <p className="text-muted-foreground">Hand-picked selections for you</p>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/shop/products">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductGrid products={featuredProducts} columns={4} />
          </div>
        </section>
      )}

      {/* Sale Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-500 to-pink-600 p-8 md:p-12">
            <div className="relative z-10 max-w-lg text-white">
              <Badge className="bg-white/20 text-white mb-4">Special Offer</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                New Collection is Live!
              </h2>
              <p className="text-lg mb-6 text-white/90">
                Check out our latest arrivals with premium quality fabrics.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/shop/products">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20">
              <svg width="300" height="300" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">New Arrivals</h2>
                <p className="text-muted-foreground">Fresh additions to our collection</p>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/shop/products">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductGrid products={newArrivals} columns={4} />
          </div>
        </section>
      )}
    </div>
  );
}

export const Route = createFileRoute("/shop/")({
  component: ShopHomepage,
});
