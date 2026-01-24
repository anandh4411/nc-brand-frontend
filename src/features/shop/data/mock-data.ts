// src/features/shop/data/mock-data.ts

export interface ShopCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount: number;
  parentId: number | null;
}

export interface ShopProductVariant {
  id: number;
  sku: string;
  size: string;
  priceAdjustment: number;
  stock: number;
}

export interface ShopProductColor {
  id: number;
  colorCode: string;
  colorName: string;
  images: string[];
  variants: ShopProductVariant[];
}

export interface ShopProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  categoryId: number;
  categoryName: string;
  fabricType: string;
  pattern: string;
  careInstructions: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  rating: number;
  reviewCount: number;
  colors: ShopProductColor[];
  createdAt: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
}

// Categories
export const shopCategories: ShopCategory[] = [
  { id: 1, name: "Churidhars", slug: "churidhars", description: "Traditional churidhars", imageUrl: "/churidhar-1.jpeg", productCount: 4, parentId: null },
  { id: 2, name: "Frocks", slug: "frocks", description: "Designer frocks", imageUrl: "/frok.jpg", productCount: 3, parentId: null },
  { id: 3, name: "Kaffthans", slug: "kaffthans", description: "Comfortable kaffthans", imageUrl: "/Kaffthan.jpeg", productCount: 1, parentId: null },
  { id: 4, name: "Nightwear", slug: "nightwear", description: "Comfortable nightwear", imageUrl: "/Nighty.jpeg", productCount: 1, parentId: null },
  { id: 5, name: "Bottoms", slug: "bottoms", description: "Bottom wear", imageUrl: "/bottom.jpeg", productCount: 1, parentId: null },
];

// Banners
export const shopBanners: Banner[] = [
  {
    id: 1,
    title: "New Arrivals",
    subtitle: "Check out our latest churidhar collection",
    imageUrl: "/churidhar-1.jpeg",
    buttonText: "Shop Now",
    buttonLink: "/shop/categories/churidhars",
    bgColor: "from-rose-500 to-pink-600",
  },
  {
    id: 2,
    title: "Maternity Collection",
    subtitle: "Comfortable frocks for expecting mothers",
    imageUrl: "/meternity-frock.jpeg",
    buttonText: "Explore",
    buttonLink: "/shop/categories/frocks",
    bgColor: "from-purple-500 to-indigo-600",
  },
];

// Products
export const shopProducts: ShopProduct[] = [
  {
    id: 1,
    name: "Churidhar Style 1",
    slug: "churidhar-style-1",
    description: "Elegant churidhar with beautiful design. Perfect for casual and festive occasions.",
    basePrice: 1299,
    originalPrice: 1599,
    categoryId: 1,
    categoryName: "Churidhars",
    fabricType: "Cotton",
    pattern: "Printed",
    careInstructions: "Hand wash or dry clean",
    isFeatured: true,
    isNewArrival: true,
    isOnSale: true,
    rating: 4.8,
    reviewCount: 45,
    colors: [
      { id: 101, colorCode: "#E91E63", colorName: "Pink", images: ["/churidhar-1.jpeg"], variants: [
        { id: 1001, sku: "CHU1-S", size: "S", priceAdjustment: 0, stock: 10 },
        { id: 1002, sku: "CHU1-M", size: "M", priceAdjustment: 0, stock: 15 },
        { id: 1003, sku: "CHU1-L", size: "L", priceAdjustment: 0, stock: 12 },
      ]},
    ],
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Churidhar Style 2",
    slug: "churidhar-style-2",
    description: "Traditional churidhar with modern touch. Ideal for office and daily wear.",
    basePrice: 1499,
    categoryId: 1,
    categoryName: "Churidhars",
    fabricType: "Cotton",
    pattern: "Printed",
    careInstructions: "Hand wash or dry clean",
    isFeatured: false,
    isNewArrival: true,
    isOnSale: false,
    rating: 4.6,
    reviewCount: 32,
    colors: [
      { id: 201, colorCode: "#9C27B0", colorName: "Purple", images: ["/churidhar-2.jpeg"], variants: [
        { id: 2001, sku: "CHU2-S", size: "S", priceAdjustment: 0, stock: 8 },
        { id: 2002, sku: "CHU2-M", size: "M", priceAdjustment: 0, stock: 12 },
        { id: 2003, sku: "CHU2-L", size: "L", priceAdjustment: 0, stock: 10 },
      ]},
    ],
    createdAt: "2024-01-16",
  },
  {
    id: 3,
    name: "Churidhar Style 3",
    slug: "churidhar-style-3",
    description: "Premium churidhar with intricate patterns. Perfect for special occasions.",
    basePrice: 1799,
    originalPrice: 2199,
    categoryId: 1,
    categoryName: "Churidhars",
    fabricType: "Silk",
    pattern: "Floral",
    careInstructions: "Dry clean only",
    isFeatured: true,
    isNewArrival: false,
    isOnSale: true,
    rating: 4.9,
    reviewCount: 67,
    colors: [
      { id: 301, colorCode: "#FF5722", colorName: "Orange", images: ["/churidhar-3.jpeg"], variants: [
        { id: 3001, sku: "CHU3-S", size: "S", priceAdjustment: 0, stock: 5 },
        { id: 3002, sku: "CHU3-M", size: "M", priceAdjustment: 0, stock: 8 },
        { id: 3003, sku: "CHU3-L", size: "L", priceAdjustment: 0, stock: 6 },
      ]},
    ],
    createdAt: "2024-01-17",
  },
  {
    id: 4,
    name: "Churidhar Style 4",
    slug: "churidhar-style-4",
    description: "Festive churidhar with rich embroidery. A must-have for your wardrobe.",
    basePrice: 1999,
    categoryId: 1,
    categoryName: "Churidhars",
    fabricType: "Silk",
    pattern: "Printed",
    careInstructions: "Dry clean only",
    isFeatured: false,
    isNewArrival: true,
    isOnSale: false,
    rating: 4.7,
    reviewCount: 28,
    colors: [
      { id: 401, colorCode: "#3F51B5", colorName: "Blue", images: ["/churidhar-4.jpeg"], variants: [
        { id: 4001, sku: "CHU4-S", size: "S", priceAdjustment: 0, stock: 7 },
        { id: 4002, sku: "CHU4-M", size: "M", priceAdjustment: 0, stock: 10 },
        { id: 4003, sku: "CHU4-L", size: "L", priceAdjustment: 0, stock: 8 },
      ]},
    ],
    createdAt: "2024-01-18",
  },
  {
    id: 5,
    name: "Frock",
    slug: "frock",
    description: "Stylish frock for casual wear. Comfortable and trendy.",
    basePrice: 899,
    originalPrice: 1099,
    categoryId: 2,
    categoryName: "Frocks",
    fabricType: "Cotton",
    pattern: "Solid",
    careInstructions: "Machine washable",
    isFeatured: true,
    isNewArrival: false,
    isOnSale: true,
    rating: 4.5,
    reviewCount: 89,
    colors: [
      { id: 501, colorCode: "#4CAF50", colorName: "Green", images: ["/frok.jpg"], variants: [
        { id: 5001, sku: "FRK-S", size: "S", priceAdjustment: 0, stock: 15 },
        { id: 5002, sku: "FRK-M", size: "M", priceAdjustment: 0, stock: 20 },
        { id: 5003, sku: "FRK-L", size: "L", priceAdjustment: 0, stock: 18 },
      ]},
    ],
    createdAt: "2024-01-19",
  },
  {
    id: 6,
    name: "Frock Style 2",
    slug: "frock-style-2",
    description: "Elegant frock with beautiful design. Perfect for parties.",
    basePrice: 999,
    categoryId: 2,
    categoryName: "Frocks",
    fabricType: "Cotton",
    pattern: "Printed",
    careInstructions: "Machine washable",
    isFeatured: false,
    isNewArrival: true,
    isOnSale: false,
    rating: 4.4,
    reviewCount: 34,
    colors: [
      { id: 601, colorCode: "#FF9800", colorName: "Orange", images: ["/frok-2.jpeg"], variants: [
        { id: 6001, sku: "FRK2-S", size: "S", priceAdjustment: 0, stock: 12 },
        { id: 6002, sku: "FRK2-M", size: "M", priceAdjustment: 0, stock: 15 },
        { id: 6003, sku: "FRK2-L", size: "L", priceAdjustment: 0, stock: 10 },
      ]},
    ],
    createdAt: "2024-01-20",
  },
  {
    id: 7,
    name: "Kaffthan",
    slug: "kaffthan",
    description: "Comfortable kaffthan for everyday wear. Soft and breathable fabric.",
    basePrice: 799,
    categoryId: 3,
    categoryName: "Kaffthans",
    fabricType: "Cotton",
    pattern: "Solid",
    careInstructions: "Machine washable",
    isFeatured: false,
    isNewArrival: false,
    isOnSale: false,
    rating: 4.3,
    reviewCount: 56,
    colors: [
      { id: 701, colorCode: "#795548", colorName: "Brown", images: ["/Kaffthan.jpeg"], variants: [
        { id: 7001, sku: "KAF-Free", size: "Free Size", priceAdjustment: 0, stock: 25 },
      ]},
    ],
    createdAt: "2024-01-21",
  },
  {
    id: 8,
    name: "Nighty",
    slug: "nighty",
    description: "Comfortable nighty for peaceful sleep. Soft cotton fabric.",
    basePrice: 599,
    originalPrice: 799,
    categoryId: 4,
    categoryName: "Nightwear",
    fabricType: "Cotton",
    pattern: "Printed",
    careInstructions: "Machine washable",
    isFeatured: false,
    isNewArrival: false,
    isOnSale: true,
    rating: 4.6,
    reviewCount: 123,
    colors: [
      { id: 801, colorCode: "#E91E63", colorName: "Pink", images: ["/Nighty.jpeg"], variants: [
        { id: 8001, sku: "NGT-Free", size: "Free Size", priceAdjustment: 0, stock: 30 },
      ]},
    ],
    createdAt: "2024-01-22",
  },
  {
    id: 9,
    name: "Bottom",
    slug: "bottom",
    description: "Quality bottom wear for daily use. Comfortable fit.",
    basePrice: 499,
    categoryId: 5,
    categoryName: "Bottoms",
    fabricType: "Cotton",
    pattern: "Solid",
    careInstructions: "Machine washable",
    isFeatured: false,
    isNewArrival: false,
    isOnSale: false,
    rating: 4.2,
    reviewCount: 78,
    colors: [
      { id: 901, colorCode: "#607D8B", colorName: "Grey", images: ["/bottom.jpeg"], variants: [
        { id: 9001, sku: "BTM-S", size: "S", priceAdjustment: 0, stock: 20 },
        { id: 9002, sku: "BTM-M", size: "M", priceAdjustment: 0, stock: 25 },
        { id: 9003, sku: "BTM-L", size: "L", priceAdjustment: 0, stock: 18 },
      ]},
    ],
    createdAt: "2024-01-23",
  },
  {
    id: 10,
    name: "Maternity Frock",
    slug: "maternity-frock",
    description: "Comfortable maternity frock for expecting mothers. Soft and stretchable.",
    basePrice: 1199,
    originalPrice: 1499,
    categoryId: 2,
    categoryName: "Frocks",
    fabricType: "Cotton",
    pattern: "Printed",
    careInstructions: "Machine washable",
    isFeatured: true,
    isNewArrival: true,
    isOnSale: true,
    rating: 4.8,
    reviewCount: 56,
    colors: [
      { id: 1001, colorCode: "#9C27B0", colorName: "Purple", images: ["/meternity-frock.jpeg"], variants: [
        { id: 10001, sku: "MAT-M", size: "M", priceAdjustment: 0, stock: 10 },
        { id: 10002, sku: "MAT-L", size: "L", priceAdjustment: 0, stock: 12 },
        { id: 10003, sku: "MAT-XL", size: "XL", priceAdjustment: 0, stock: 8 },
      ]},
    ],
    createdAt: "2024-01-24",
  },
];

// Options
export const fabricTypeOptions = [
  { label: "Cotton", value: "cotton" },
  { label: "Silk", value: "silk" },
  { label: "Linen", value: "linen" },
  { label: "Polyester", value: "polyester" },
];

export const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
];

// Helper functions
export const getFeaturedProducts = () => shopProducts.filter(p => p.isFeatured);
export const getNewArrivals = () => shopProducts.filter(p => p.isNewArrival);
export const getOnSaleProducts = () => shopProducts.filter(p => p.isOnSale);
export const getProductsByCategory = (categoryId: number) => shopProducts.filter(p => p.categoryId === categoryId);
export const getProductBySlug = (slug: string) => shopProducts.find(p => p.slug === slug);
export const getProductById = (id: number) => shopProducts.find(p => p.id === id);
