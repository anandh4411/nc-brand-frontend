import { motion } from "framer-motion";
import {
  Building,
  Users,
  Smartphone,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  LogIn,
  Package,
  Layers,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProductCard from "./components/products-card";
import { useLandingProducts } from "@/api/hooks/products";
import type { LandingCategory } from "@/types/dto/product.dto";

const PRODUCTS_PER_PAGE = 10;


// Card components inline
const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
);

const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);

const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

// Hero components inline
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute pointer-events-none", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function HeroGeometric() {
  const router = useRouter();

  // const fadeUpVariants = {
  //   hidden: { opacity: 0, y: 30 },
  //   visible: (i: number) => ({
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 1,
  //       delay: 0.5 + i * 0.2,
  //       ease: [0.25, 0.4, 0.25, 1],
  //     },
  //   }),
  // };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030303] overflow-visible">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Institution Login Button - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-6 right-6 z-50"
      >
        <Button
          onClick={() => router.navigate({ to: "/institutions/login" })}
          className={cn(
            "group relative overflow-hidden",
            "bg-white/[0.03] hover:bg-white/[0.08]",
            "border border-white/[0.15] hover:border-blue-400/50",
            "backdrop-blur-md",
            "text-white font-medium",
            "px-6 py-2.5",
            "rounded-full",
            "transition-all duration-300",
            "shadow-[0_8px_32px_0_rgba(59,130,246,0.1)]",
            "hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.25)]",
            "hover:scale-105"
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            <span className="text-sm">Institution Login</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </motion.div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            // variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <img
              src="/logo.png"
              alt="Impressaa Logo"
              className="h-4 w-4 text-blue-500/80"
            />
            <span className="text-sm text-white/60 tracking-wide">
              impressaa
            </span>
          </motion.div>

          <motion.div
            custom={1}
            // variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                You imagine..
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 "
                )}
              >
                We print !
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            // variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              From personalized gifts to professional prints - bringing your
              ideas to life with quality craftsmanship and attention to detail.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/40"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

export default function Landing() {
  // Fetch products from API
  const { data: productsData, isLoading, error } = useLandingProducts();

  // Ensure scrolling is enabled
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const categories: LandingCategory[] = productsData?.data?.categories || [];
  const [activeMainCategory, setActiveMainCategory] = useState<string>("");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("");
  const [productPage, setProductPage] = useState(1);

  // Set first category as active when data loads
  useEffect(() => {
    if (categories.length > 0 && !activeMainCategory) {
      setActiveMainCategory(categories[0].uuid);
      if (categories[0].subCategories.length > 0) {
        setActiveSubCategory(categories[0].subCategories[0].uuid);
      }
    }
  }, [categories, activeMainCategory]);

  // Update subcategory when main category changes
  useEffect(() => {
    const category = categories.find((cat: LandingCategory) => cat.uuid === activeMainCategory);
    if (category && category.subCategories.length > 0) {
      setActiveSubCategory(category.subCategories[0].uuid);
    }
    setProductPage(1); // Reset page when category changes
  }, [activeMainCategory, categories]);

  // Reset page when subcategory changes
  useEffect(() => {
    setProductPage(1);
  }, [activeSubCategory]);

  const currentCategory = categories.find((cat: LandingCategory) => cat.uuid === activeMainCategory);
  const currentSubCategory = currentCategory?.subCategories.find(
    (sub: LandingCategory['subCategories'][number]) => sub.uuid === activeSubCategory
  );

  // Pagination logic for products
  const allProducts = currentSubCategory?.products || [];
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const showPagination = totalProducts > PRODUCTS_PER_PAGE;

  const paginatedProducts = useMemo(() => {
    const startIndex = (productPage - 1) * PRODUCTS_PER_PAGE;
    return allProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [allProducts, productPage]);

  const handlePrevPage = () => {
    if (productPage > 1) setProductPage(productPage - 1);
  };

  const handleNextPage = () => {
    if (productPage < totalPages) setProductPage(productPage + 1);
  };

  return (
    <div className="w-full bg-[#030303] overflow-auto">
      {/* Hero Section */}
      <HeroGeometric />

      {/* Services Section */}
      <section className="py-16 md:py-32 relative">
        <div className="absolute inset-0 bg-blue-500/[0.02]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Our Services
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Complete digital solution for institutions to manage ID card
              creation efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white/[0.03] border-blue-500/[0.2] backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-500/20 w-fit">
                  <Building className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">
                  Institution Management
                </CardTitle>
                <CardDescription className="text-white/60">
                  Manage multiple institutions with custom forms and
                  requirements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/[0.03] border-blue-500/[0.2] backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-500/20 w-fit">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">Bulk Data Import</CardTitle>
                <CardDescription className="text-white/60">
                  Import student/employee data via CSV and generate unique codes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/[0.03] border-blue-500/[0.2] backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-500/20 w-fit">
                  <Smartphone className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">Mobile App</CardTitle>
                <CardDescription className="text-white/60">
                  User-friendly mobile app for form submission and photo upload
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-32 relative">
        <div className="absolute inset-0 bg-rose-500/[0.02]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Our Products
            </h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full mb-4"
              />
              <p className="text-white/60 text-lg">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-red-400 text-lg mb-2">Failed to load products</p>
              <p className="text-white/40 text-sm">Please try again later</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && categories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mb-6 mx-auto border border-white/[0.08]">
                  <Package className="h-10 w-10 text-white/40" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  No products yet
                </h3>
                <p className="text-white/60 text-lg max-w-md mx-auto">
                  We're currently preparing our product catalog. Check back soon for amazing deals!
                </p>
              </motion.div>
            </div>
          )}

          {/* Main Categories */}
          {!isLoading && !error && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category: LandingCategory) => {
                const isActive = activeMainCategory === category.uuid;

                return (
                  <button
                    key={category.uuid}
                    onClick={() => setActiveMainCategory(category.uuid)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300",
                      "border backdrop-blur-sm",
                      isActive
                        ? "bg-blue-500/20 border-blue-400/50 text-white scale-105"
                        : "bg-white/[0.03] border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.08]"
                    )}
                  >
                    <Package className="h-5 w-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sub Categories */}
          {currentCategory && currentCategory.subCategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {currentCategory.subCategories.map((subCategory: LandingCategory['subCategories'][number]) => {
                const isActive = activeSubCategory === subCategory.uuid;

                return (
                  <button
                    key={subCategory.uuid}
                    onClick={() => setActiveSubCategory(subCategory.uuid)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium",
                      isActive
                        ? "bg-blue-500/30 text-white border border-blue-400/50"
                        : "bg-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.15] border border-transparent"
                    )}
                  >
                    <Layers className="h-4 w-4" />
                    {subCategory.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Products Grid */}
          {currentSubCategory && allProducts.length > 0 ? (
            <>
              <motion.div
                key={`${activeMainCategory}-${activeSubCategory}-${productPage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto justify-items-center"
              >
                {paginatedProducts.map((product: LandingCategory['subCategories'][number]['products'][number], index: number) => (
                  <motion.div
                    key={product.uuid}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination Controls - Only show if products > 10 */}
              {showPagination && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-4 mt-10"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevPage}
                    disabled={productPage === 1}
                    className={cn(
                      "h-10 w-10 rounded-full",
                      "bg-white/[0.03] border-white/[0.15]",
                      "text-white/70 hover:text-white",
                      "hover:bg-white/[0.08] hover:border-blue-400/50",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                      "transition-all duration-200"
                    )}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setProductPage(pageNum)}
                        className={cn(
                          "h-8 w-8 rounded-full text-sm font-medium transition-all duration-200",
                          pageNum === productPage
                            ? "bg-blue-500/30 text-white border border-blue-400/50"
                            : "text-white/50 hover:text-white hover:bg-white/[0.08]"
                        )}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextPage}
                    disabled={productPage === totalPages}
                    className={cn(
                      "h-10 w-10 rounded-full",
                      "bg-white/[0.03] border-white/[0.15]",
                      "text-white/70 hover:text-white",
                      "hover:bg-white/[0.08] hover:border-blue-400/50",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                      "transition-all duration-200"
                    )}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </>
          ) : currentSubCategory ? (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mb-4 mx-auto border border-white/[0.08]">
                  <Package className="h-8 w-8 text-white/30" />
                </div>
                <p className="text-white/50 text-lg font-light">
                  No products available in this subcategory yet
                </p>
              </motion.div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Android App Download Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.03] via-indigo-500/[0.03] to-blue-500/[0.03]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border-blue-500/[0.3] backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.05] to-indigo-500/[0.05]" />
                <CardContent className="p-8 md:p-12 relative z-10">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 mb-2">
                        <Smartphone className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-blue-300 font-medium">For Institutions</span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Download Our Mobile App
                      </h2>

                      <p className="text-white/70 text-lg leading-relaxed">
                        Get the Impressaa mobile app and streamline your institution's ID card submission process. Available for Android devices.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Button
                          onClick={() => window.open('https://cdn.impressaa.com/app/impressaa-release.apk', '_blank')}
                          className={cn(
                            "group relative overflow-hidden",
                            "bg-gradient-to-r from-blue-600 to-indigo-600",
                            "hover:from-blue-500 hover:to-indigo-500",
                            "text-white font-semibold",
                            "px-8 py-6 h-auto",
                            "rounded-xl",
                            "transition-all duration-300",
                            "shadow-lg shadow-blue-500/25",
                            "hover:shadow-xl hover:shadow-blue-500/40",
                            "hover:scale-105"
                          )}
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            <Download className="h-5 w-5" />
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-blue-200">Download for</span>
                              <span className="text-base">Android</span>
                            </div>
                          </span>
                        </Button>

                        <div className="flex flex-col justify-center text-sm text-white/60 space-y-1">
                          <span>• Easy form submission</span>
                          <span>• Photo upload with validation</span>
                          <span>• Real-time status tracking</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative hidden md:block">
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative"
                      >
                        <div className="w-48 h-96 mx-auto relative">
                          {/* Phone Frame */}
                          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] border-8 border-gray-700 shadow-2xl">
                            {/* Screen */}
                            <div className="absolute inset-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-[2rem] overflow-hidden">
                              <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
                                <Smartphone className="h-20 w-20 text-blue-400" />
                                <div className="space-y-2 w-full">
                                  <div className="h-2 bg-white/20 rounded-full w-3/4 mx-auto" />
                                  <div className="h-2 bg-white/20 rounded-full w-1/2 mx-auto" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-16 md:py-32 relative">
        <div className="absolute inset-0 bg-blue-500/[0.02]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Get In Touch
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Ready to transform your ID card process? Contact us today for a
                demo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Email</h3>
                    <p className="text-white/60">info.impressaa@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Phone className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Phone</h3>
                    <p className="text-white/60">+91 6238250500</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <MapPin className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Location</h3>
                    <p className="text-white/60">
                      IMPRESSAA<br />
                      VI/191 A, Opp KEMHS<br />
                      P O Alangad, Kottappuram<br />
                      Ernakulam, Kerala 683511
                    </p>
                  </div>
                </div>
              </div>

              <Card className="bg-white/[0.03] border-blue-500/[0.2] backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Ready to Start?
                  </h3>
                  <p className="text-white/60 mb-6">
                    Book a demo and see how Impressa can streamline your ID card
                    management
                  </p>
                  <Button
                    className="bg-blue-500 text-white border-0 hover:bg-blue-600 transition-all duration-300"
                    onClick={() =>
                      window.open("mailto:info.impressaa@gmail.com", "_blank")
                    }
                  >
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.08] bg-black/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-rose-500/[0.02]" />
        <div className="container mx-auto px-4 py-12 md:px-6 relative z-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-rose-300">
                Impressaa
              </h3>
              <p className="mb-4 text-white/60">
                Streamlining ID card management for institutions worldwide.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/[0.03] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
                >
                  <Instagram className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                Quick Links
              </h4>
              <nav className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Support
                </a>
              </nav>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">
                Services
              </h4>
              <nav className="space-y-2 text-sm">
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Institution Management
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Form Builder
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Data Import
                </a>
                <a
                  href="#"
                  className="block text-white/60 transition-colors hover:text-white"
                >
                  Mobile App
                </a>
              </nav>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-white">Contact</h4>
              <div className="space-y-2 text-sm text-white/60">
                <p>VI/191 A, Opp KEMHS</p>
                <p>P O Alangad, Kottappuram</p>
                <p>Ernakulam, Kerala 683511</p>
                <p>info.impressaa@gmail.com</p>
                <p>+91 6238250500</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-center md:flex-row">
            <p className="text-sm text-white/60">
              © 2025 Impressaa. All rights reserved.
            </p>
            <nav className="flex gap-4 text-sm">
              <Link
                to="/privacy-policy"
                className="text-white/60 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <a
                href="#"
                className="text-white/60 transition-colors hover:text-white"
              >
                Terms of Service
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
