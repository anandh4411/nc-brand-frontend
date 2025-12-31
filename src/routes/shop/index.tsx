import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, CreditCard } from "lucide-react";

function ShopHomepage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Premium Quality
              <span className="text-primary block">Textiles</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our collection of high-quality fabrics and garments,
              crafted with care from our manufacturing unit to your doorstep.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link to="/shop/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/shop/categories">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  On orders above ₹999
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Quality Guaranteed</h3>
                <p className="text-sm text-muted-foreground">
                  Direct from manufacturer
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Multiple payment options
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">
              Explore our wide range of textile products
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {["Men", "Women", "Kids"].map((category) => (
              <Link
                key={category}
                to="/shop/categories/$slug"
                params={{ slug: category.toLowerCase() }}
                className="group relative overflow-hidden rounded-lg border bg-card aspect-[4/3]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category}
                  </h3>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                    View Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground">
              Hand-picked selections just for you
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border bg-card overflow-hidden"
              >
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Product {i}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">Product Name</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Category
                  </p>
                  <div className="font-semibold">₹999</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/shop/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/shop/")({
  component: ShopHomepage,
});
