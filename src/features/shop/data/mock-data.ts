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
  originalPrice?: number; // For showing discounts
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
  { id: 1, name: "Sarees", slug: "sarees", description: "Traditional and modern sarees", imageUrl: "/categories/sarees.jpg", productCount: 18, parentId: null },
  { id: 2, name: "Kurtis", slug: "kurtis", description: "Elegant kurtis for every occasion", imageUrl: "/categories/kurtis.jpg", productCount: 12, parentId: null },
  { id: 3, name: "Lehengas", slug: "lehengas", description: "Bridal and party lehengas", imageUrl: "/categories/lehengas.jpg", productCount: 8, parentId: null },
  { id: 4, name: "Dress Materials", slug: "dress-materials", description: "Unstitched dress materials", imageUrl: "/categories/dress-materials.jpg", productCount: 10, parentId: null },
  { id: 5, name: "Dupattas", slug: "dupattas", description: "Designer dupattas", imageUrl: "/categories/dupattas.jpg", productCount: 6, parentId: null },
  { id: 6, name: "Fabrics", slug: "fabrics", description: "Premium quality fabrics", imageUrl: "/categories/fabrics.jpg", productCount: 8, parentId: null },
  // Sub-categories
  { id: 7, name: "Silk Sarees", slug: "silk-sarees", description: "Pure silk sarees", imageUrl: "/categories/silk-sarees.jpg", productCount: 8, parentId: 1 },
  { id: 8, name: "Cotton Sarees", slug: "cotton-sarees", description: "Comfortable cotton sarees", imageUrl: "/categories/cotton-sarees.jpg", productCount: 6, parentId: 1 },
  { id: 9, name: "Designer Sarees", slug: "designer-sarees", description: "Party wear designer sarees", imageUrl: "/categories/designer-sarees.jpg", productCount: 4, parentId: 1 },
];

// Banners
export const shopBanners: Banner[] = [
  {
    id: 1,
    title: "New Year Sale",
    subtitle: "Up to 50% off on all sarees",
    imageUrl: "/banners/sale.jpg",
    buttonText: "Shop Now",
    buttonLink: "/shop/offers",
    bgColor: "from-rose-500 to-pink-600",
  },
  {
    id: 2,
    title: "Wedding Collection",
    subtitle: "Exclusive bridal lehengas & sarees",
    imageUrl: "/banners/wedding.jpg",
    buttonText: "Explore",
    buttonLink: "/shop/categories/lehengas",
    bgColor: "from-amber-500 to-orange-600",
  },
  {
    id: 3,
    title: "Pure Silk Range",
    subtitle: "Authentic Kanchipuram & Banarasi",
    imageUrl: "/banners/silk.jpg",
    buttonText: "View Collection",
    buttonLink: "/shop/categories/silk-sarees",
    bgColor: "from-purple-500 to-indigo-600",
  },
];

// Helper to generate mock images
const getProductImage = (id: number, color: string) =>
  `https://picsum.photos/seed/${id}-${color}/400/500`;

// 50+ Products
export const shopProducts: ShopProduct[] = [
  // SAREES (18 products)
  {
    id: 1,
    name: "Kanchipuram Pure Silk Saree",
    slug: "kanchipuram-pure-silk-saree",
    description: "Authentic Kanchipuram silk saree with traditional temple border and rich pallu. Handwoven by master weavers with pure zari work.",
    basePrice: 12999,
    originalPrice: 15999,
    categoryId: 7,
    categoryName: "Silk Sarees",
    fabricType: "Pure Silk",
    pattern: "Traditional",
    careInstructions: "Dry clean only",
    isFeatured: true,
    isNewArrival: false,
    isOnSale: true,
    rating: 4.8,
    reviewCount: 124,
    colors: [
      { id: 101, colorCode: "#8B0000", colorName: "Maroon", images: [getProductImage(1, "maroon")], variants: [
        { id: 1001, sku: "KPS-001-M-S", size: "Standard", priceAdjustment: 0, stock: 15 },
      ]},
      { id: 102, colorCode: "#006400", colorName: "Bottle Green", images: [getProductImage(1, "green")], variants: [
        { id: 1002, sku: "KPS-001-G-S", size: "Standard", priceAdjustment: 0, stock: 12 },
      ]},
      { id: 103, colorCode: "#4B0082", colorName: "Purple", images: [getProductImage(1, "purple")], variants: [
        { id: 1003, sku: "KPS-001-P-S", size: "Standard", priceAdjustment: 0, stock: 8 },
      ]},
    ],
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Banarasi Silk Wedding Saree",
    slug: "banarasi-silk-wedding-saree",
    description: "Exquisite Banarasi silk saree with intricate brocade work. Perfect for weddings and special occasions.",
    basePrice: 18999,
    originalPrice: 22999,
    categoryId: 7,
    categoryName: "Silk Sarees",
    fabricType: "Banarasi Silk",
    pattern: "Brocade",
    careInstructions: "Dry clean only",
    isFeatured: true,
    isNewArrival: true,
    isOnSale: true,
    rating: 4.9,
    reviewCount: 89,
    colors: [
      { id: 201, colorCode: "#FFD700", colorName: "Golden", images: [getProductImage(2, "gold")], variants: [
        { id: 2001, sku: "BSW-002-G-S", size: "Standard", priceAdjustment: 0, stock: 10 },
      ]},
      { id: 202, colorCode: "#DC143C", colorName: "Crimson", images: [getProductImage(2, "crimson")], variants: [
        { id: 2002, sku: "BSW-002-C-S", size: "Standard", priceAdjustment: 0, stock: 8 },
      ]},
    ],
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    name: "Chanderi Cotton Silk Saree",
    slug: "chanderi-cotton-silk-saree",
    description: "Lightweight Chanderi saree with subtle gold weave. Ideal for office wear and casual occasions.",
    basePrice: 4999,
    categoryId: 1,
    categoryName: "Sarees",
    fabricType: "Cotton Silk",
    pattern: "Geometric",
    careInstructions: "Hand wash or dry clean",
    isFeatured: false,
    isNewArrival: true,
    isOnSale: false,
    rating: 4.5,
    reviewCount: 67,
    colors: [
      { id: 301, colorCode: "#FFC0CB", colorName: "Baby Pink", images: [getProductImage(3, "pink")], variants: [
        { id: 3001, sku: "CCS-003-P-S", size: "Standard", priceAdjustment: 0, stock: 20 },
      ]},
      { id: 302, colorCode: "#87CEEB", colorName: "Sky Blue", images: [getProductImage(3, "blue")], variants: [
        { id: 3002, sku: "CCS-003-B-S", size: "Standard", priceAdjustment: 0, stock: 18 },
      ]},
      { id: 303, colorCode: "#98FB98", colorName: "Mint Green", images: [getProductImage(3, "mint")], variants: [
        { id: 3003, sku: "CCS-003-M-S", size: "Standard", priceAdjustment: 0, stock: 15 },
      ]},
    ],
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    name: "Organza Designer Saree",
    slug: "organza-designer-saree",
    description: "Trendy organza saree with floral prints. Modern and stylish for parties and events.",
    basePrice: 3499,
    originalPrice: 4499,
    categoryId: 9,
    categoryName: "Designer Sarees",
    fabricType: "Organza",
    pattern: "Floral",
    careInstructions: "Dry clean only",
    isFeatured: true,
    isNewArrival: true,
    isOnSale: true,
    rating: 4.6,
    reviewCount: 45,
    colors: [
      { id: 401, colorCode: "#E6E6FA", colorName: "Lavender", images: [getProductImage(4, "lavender")], variants: [
        { id: 4001, sku: "ODS-004-L-S", size: "Standard", priceAdjustment: 0, stock: 25 },
      ]},
      { id: 402, colorCode: "#FFDAB9", colorName: "Peach", images: [getProductImage(4, "peach")], variants: [
        { id: 4002, sku: "ODS-004-P-S", size: "Standard", priceAdjustment: 0, stock: 22 },
      ]},
    ],
    createdAt: "2024-03-25",
  },
  {
    id: 5,
    name: "Pure Cotton Handloom Saree",
    slug: "pure-cotton-handloom-saree",
    description: "Breathable handloom cotton saree with traditional weave. Perfect for daily wear in summer.",
    basePrice: 2499,
    categoryId: 8,
    categoryName: "Cotton Sarees",
    fabricType: "Pure Cotton",
    pattern: "Striped",
    careInstructions: "Machine washable",
    isFeatured: false,
    isNewArrival: false,
    isOnSale: false,
    rating: 4.4,
    reviewCount: 112,
    colors: [
      { id: 501, colorCode: "#FFFFFF", colorName: "Off White", images: [getProductImage(5, "white")], variants: [
        { id: 5001, sku: "PCH-005-W-S", size: "Standard", priceAdjustment: 0, stock: 30 },
      ]},
      { id: 502, colorCode: "#F5DEB3", colorName: "Beige", images: [getProductImage(5, "beige")], variants: [
        { id: 5002, sku: "PCH-005-B-S", size: "Standard", priceAdjustment: 0, stock: 28 },
      ]},
    ],
    createdAt: "2024-01-05",
  },
  {
    id: 6,
    name: "Patola Silk Saree",
    slug: "patola-silk-saree",
    description: "Traditional Patola silk saree with geometric patterns. Double ikat weaving technique.",
    basePrice: 24999,
    categoryId: 7,
    categoryName: "Silk Sarees",
    fabricType: "Patola Silk",
    pattern: "Geometric",
    careInstructions: "Dry clean only",
    isFeatured: true,
    isNewArrival: false,
    isOnSale: false,
    rating: 4.9,
    reviewCount: 34,
    colors: [
      { id: 601, colorCode: "#FF4500", colorName: "Orange Red", images: [getProductImage(6, "orange")], variants: [
        { id: 6001, sku: "PSS-006-O-S", size: "Standard", priceAdjustment: 0, stock: 5 },
      ]},
    ],
    createdAt: "2024-02-01",
  },
  {
    id: 7,
    name: "Linen Saree with Zari",
    slug: "linen-saree-zari",
    description: "Premium linen saree with silver zari border. Comfortable and elegant for formal occasions.",
    basePrice: 3999,
    categoryId: 1,
    categoryName: "Sarees",
    fabricType: "Linen",
    pattern: "Plain with Border",
    careInstructions: "Hand wash",
    isFeatured: false,
    isNewArrival: true,
    isOnSale: false,
    rating: 4.3,
    reviewCount: 78,
    colors: [
      { id: 701, colorCode: "#808080", colorName: "Grey", images: [getProductImage(7, "grey")], variants: [
        { id: 7001, sku: "LSZ-007-G-S", size: "Standard", priceAdjustment: 0, stock: 20 },
      ]},
      { id: 702, colorCode: "#000080", colorName: "Navy Blue", images: [getProductImage(7, "navy")], variants: [
        { id: 7002, sku: "LSZ-007-N-S", size: "Standard", priceAdjustment: 0, stock: 18 },
      ]},
    ],
    createdAt: "2024-04-01",
  },
  {
    id: 8,
    name: "Tussar Silk Printed Saree",
    slug: "tussar-silk-printed-saree",
    description: "Eco-friendly Tussar silk with hand block prints. Natural texture with artistic patterns.",
    basePrice: 5999,
    originalPrice: 6999,
    categoryId: 7,
    categoryName: "Silk Sarees",
    fabricType: "Tussar Silk",
    pattern: "Block Print",
    careInstructions: "Dry clean only",
    isFeatured: false,
    isNewArrival: false,
    isOnSale: true,
    rating: 4.5,
    reviewCount: 56,
    colors: [
      { id: 801, colorCode: "#D2691E", colorName: "Brown", images: [getProductImage(8, "brown")], variants: [
        { id: 8001, sku: "TSP-008-B-S", size: "Standard", priceAdjustment: 0, stock: 14 },
      ]},
      { id: 802, colorCode: "#556B2F", colorName: "Olive", images: [getProductImage(8, "olive")], variants: [
        { id: 8002, sku: "TSP-008-O-S", size: "Standard", priceAdjustment: 0, stock: 12 },
      ]},
    ],
    createdAt: "2024-02-15",
  },
  {
    id: 9,
    name: "Mysore Crepe Silk Saree",
    slug: "mysore-crepe-silk-saree",
    description: "Soft Mysore crepe silk with elegant drape. Lightweight and comfortable for all-day wear.",
    basePrice: 7499,
    categoryId: 7,
    categoryName: "Silk Sarees",
    fabricType: "Crepe Silk",
    pattern: "Plain",
    careInstructions: "Dry clean recommended",
    isFeatured: false,
    isNewArrival: false,
    isOnSale: false,
    rating: 4.6,
    reviewCount: 89,
    colors: [
      { id: 901, colorCode: "#800020", colorName: "Burgundy", images: [getProductImage(9, "burgundy")], variants: [
        { id: 9001, sku: "MCS-009-B-S", size: "Standard", priceAdjustment: 0, stock: 16 },
      ]},
      { id: 902, colorCode: "#008B8B", colorName: "Teal", images: [getProductImage(9, "teal")], variants: [
        { id: 9002, sku: "MCS-009-T-S", size: "Standard", priceAdjustment: 0, stock: 14 },
      ]},
    ],
    createdAt: "2024-01-20",
  },
  {
    id: 10,
    name: "Pochampally Ikat Saree",
    slug: "pochampally-ikat-saree",
    description: "Handwoven Pochampally ikat with traditional geometric motifs. GI tagged heritage weave.",
    basePrice: 4499,
    categoryId: 8,
    categoryName: "Cotton Sarees",
    fabricType: "Cotton",
    pattern: "Ikat",
    careInstructions: "Hand wash",
    isFeatured: true,
    isNewArrival: false,
    isOnSale: false,
    rating: 4.7,
    reviewCount: 98,
    colors: [
      { id: 1001, colorCode: "#4169E1", colorName: "Royal Blue", images: [getProductImage(10, "royalblue")], variants: [
        { id: 10001, sku: "PIS-010-R-S", size: "Standard", priceAdjustment: 0, stock: 22 },
      ]},
      { id: 1002, colorCode: "#B22222", colorName: "Firebrick", images: [getProductImage(10, "red")], variants: [
        { id: 10002, sku: "PIS-010-F-S", size: "Standard", priceAdjustment: 0, stock: 18 },
      ]},
    ],
    createdAt: "2024-02-28",
  },
  // More sarees...
  {
    id: 11, name: "Gadwal Silk Saree", slug: "gadwal-silk-saree",
    description: "Traditional Gadwal silk with cotton body and silk border. Perfect blend of comfort and elegance.",
    basePrice: 8999, categoryId: 7, categoryName: "Silk Sarees", fabricType: "Silk Cotton", pattern: "Temple Border",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: true, isOnSale: false, rating: 4.5, reviewCount: 45,
    colors: [{ id: 1101, colorCode: "#DAA520", colorName: "Goldenrod", images: [getProductImage(11, "gold")], variants: [{ id: 11001, sku: "GSS-011-G-S", size: "Standard", priceAdjustment: 0, stock: 10 }]}],
    createdAt: "2024-04-05",
  },
  {
    id: 12, name: "Mangalagiri Cotton Saree", slug: "mangalagiri-cotton-saree",
    description: "Soft Mangalagiri cotton with zari checks. Cool and comfortable for summer.",
    basePrice: 1999, categoryId: 8, categoryName: "Cotton Sarees", fabricType: "Cotton", pattern: "Checks",
    careInstructions: "Machine wash", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.2, reviewCount: 156,
    colors: [
      { id: 1201, colorCode: "#FF69B4", colorName: "Hot Pink", images: [getProductImage(12, "pink")], variants: [{ id: 12001, sku: "MCS-012-P-S", size: "Standard", priceAdjustment: 0, stock: 35 }]},
      { id: 1202, colorCode: "#20B2AA", colorName: "Light Sea Green", images: [getProductImage(12, "green")], variants: [{ id: 12002, sku: "MCS-012-G-S", size: "Standard", priceAdjustment: 0, stock: 30 }]},
    ],
    createdAt: "2024-01-10",
  },
  {
    id: 13, name: "Uppada Silk Saree", slug: "uppada-silk-saree",
    description: "Delicate Uppada silk with jamdani patterns. Light as feather with intricate weaving.",
    basePrice: 11999, originalPrice: 14999, categoryId: 7, categoryName: "Silk Sarees", fabricType: "Uppada Silk", pattern: "Jamdani",
    careInstructions: "Dry clean only", isFeatured: true, isNewArrival: false, isOnSale: true, rating: 4.8, reviewCount: 67,
    colors: [{ id: 1301, colorCode: "#C71585", colorName: "Magenta", images: [getProductImage(13, "magenta")], variants: [{ id: 13001, sku: "USS-013-M-S", size: "Standard", priceAdjustment: 0, stock: 8 }]}],
    createdAt: "2024-03-01",
  },
  {
    id: 14, name: "Kalamkari Print Saree", slug: "kalamkari-print-saree",
    description: "Hand-painted Kalamkari on cotton. Ancient art form with mythological scenes.",
    basePrice: 3299, categoryId: 8, categoryName: "Cotton Sarees", fabricType: "Cotton", pattern: "Kalamkari",
    careInstructions: "Gentle wash", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.4, reviewCount: 89,
    colors: [{ id: 1401, colorCode: "#8B4513", colorName: "Saddle Brown", images: [getProductImage(14, "brown")], variants: [{ id: 14001, sku: "KPS-014-B-S", size: "Standard", priceAdjustment: 0, stock: 25 }]}],
    createdAt: "2024-02-10",
  },
  {
    id: 15, name: "Chiffon Party Wear Saree", slug: "chiffon-party-wear-saree",
    description: "Lightweight chiffon with stone work border. Glamorous and perfect for parties.",
    basePrice: 2799, originalPrice: 3499, categoryId: 9, categoryName: "Designer Sarees", fabricType: "Chiffon", pattern: "Stone Work",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: true, isOnSale: true, rating: 4.3, reviewCount: 112,
    colors: [
      { id: 1501, colorCode: "#FF0000", colorName: "Red", images: [getProductImage(15, "red")], variants: [{ id: 15001, sku: "CPW-015-R-S", size: "Standard", priceAdjustment: 0, stock: 28 }]},
      { id: 1502, colorCode: "#000000", colorName: "Black", images: [getProductImage(15, "black")], variants: [{ id: 15002, sku: "CPW-015-B-S", size: "Standard", priceAdjustment: 0, stock: 24 }]},
    ],
    createdAt: "2024-04-10",
  },
  {
    id: 16, name: "Sambalpuri Cotton Saree", slug: "sambalpuri-cotton-saree",
    description: "Traditional Sambalpuri bandha with natural dyes. Odisha's heritage craft.",
    basePrice: 3799, categoryId: 8, categoryName: "Cotton Sarees", fabricType: "Cotton", pattern: "Bandha",
    careInstructions: "Hand wash", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.6, reviewCount: 78,
    colors: [{ id: 1601, colorCode: "#FF8C00", colorName: "Dark Orange", images: [getProductImage(16, "orange")], variants: [{ id: 16001, sku: "SCS-016-O-S", size: "Standard", priceAdjustment: 0, stock: 18 }]}],
    createdAt: "2024-01-25",
  },
  {
    id: 17, name: "Georgette Sequin Saree", slug: "georgette-sequin-saree",
    description: "Flowing georgette with heavy sequin work. Statement piece for special occasions.",
    basePrice: 4999, originalPrice: 5999, categoryId: 9, categoryName: "Designer Sarees", fabricType: "Georgette", pattern: "Sequin Work",
    careInstructions: "Dry clean only", isFeatured: true, isNewArrival: true, isOnSale: true, rating: 4.7, reviewCount: 56,
    colors: [
      { id: 1701, colorCode: "#00CED1", colorName: "Dark Turquoise", images: [getProductImage(17, "turquoise")], variants: [{ id: 17001, sku: "GSS-017-T-S", size: "Standard", priceAdjustment: 0, stock: 15 }]},
      { id: 1702, colorCode: "#FF1493", colorName: "Deep Pink", images: [getProductImage(17, "pink")], variants: [{ id: 17002, sku: "GSS-017-P-S", size: "Standard", priceAdjustment: 0, stock: 12 }]},
    ],
    createdAt: "2024-04-15",
  },
  {
    id: 18, name: "Paithani Silk Saree", slug: "paithani-silk-saree",
    description: "Maharashtra's pride - Paithani silk with peacock motifs. Handwoven masterpiece.",
    basePrice: 35999, categoryId: 7, categoryName: "Silk Sarees", fabricType: "Paithani Silk", pattern: "Peacock Motif",
    careInstructions: "Dry clean only", isFeatured: true, isNewArrival: false, isOnSale: false, rating: 5.0, reviewCount: 23,
    colors: [{ id: 1801, colorCode: "#9400D3", colorName: "Dark Violet", images: [getProductImage(18, "violet")], variants: [{ id: 18001, sku: "PSS-018-V-S", size: "Standard", priceAdjustment: 0, stock: 3 }]}],
    createdAt: "2024-02-05",
  },

  // KURTIS (12 products)
  {
    id: 19, name: "Anarkali Cotton Kurti", slug: "anarkali-cotton-kurti",
    description: "Flowy Anarkali style kurti with embroidered yoke. Perfect for festive occasions.",
    basePrice: 1499, categoryId: 2, categoryName: "Kurtis", fabricType: "Cotton", pattern: "Embroidered",
    careInstructions: "Machine wash", isFeatured: true, isNewArrival: true, isOnSale: false, rating: 4.5, reviewCount: 234,
    colors: [
      { id: 1901, colorCode: "#FFD700", colorName: "Yellow", images: [getProductImage(19, "yellow")], variants: [
        { id: 19001, sku: "ACK-019-Y-S", size: "S", priceAdjustment: 0, stock: 25 },
        { id: 19002, sku: "ACK-019-Y-M", size: "M", priceAdjustment: 0, stock: 30 },
        { id: 19003, sku: "ACK-019-Y-L", size: "L", priceAdjustment: 0, stock: 28 },
        { id: 19004, sku: "ACK-019-Y-XL", size: "XL", priceAdjustment: 50, stock: 20 },
      ]},
      { id: 1902, colorCode: "#008000", colorName: "Green", images: [getProductImage(19, "green")], variants: [
        { id: 19005, sku: "ACK-019-G-S", size: "S", priceAdjustment: 0, stock: 22 },
        { id: 19006, sku: "ACK-019-G-M", size: "M", priceAdjustment: 0, stock: 28 },
        { id: 19007, sku: "ACK-019-G-L", size: "L", priceAdjustment: 0, stock: 25 },
        { id: 19008, sku: "ACK-019-G-XL", size: "XL", priceAdjustment: 50, stock: 18 },
      ]},
    ],
    createdAt: "2024-03-20",
  },
  {
    id: 20, name: "Straight Fit Rayon Kurti", slug: "straight-fit-rayon-kurti",
    description: "Simple and elegant straight fit kurti. Great for office and casual wear.",
    basePrice: 899, categoryId: 2, categoryName: "Kurtis", fabricType: "Rayon", pattern: "Plain",
    careInstructions: "Machine wash", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.3, reviewCount: 345,
    colors: [
      { id: 2001, colorCode: "#000080", colorName: "Navy", images: [getProductImage(20, "navy")], variants: [
        { id: 20001, sku: "SRK-020-N-S", size: "S", priceAdjustment: 0, stock: 40 },
        { id: 20002, sku: "SRK-020-N-M", size: "M", priceAdjustment: 0, stock: 45 },
        { id: 20003, sku: "SRK-020-N-L", size: "L", priceAdjustment: 0, stock: 42 },
        { id: 20004, sku: "SRK-020-N-XL", size: "XL", priceAdjustment: 0, stock: 35 },
        { id: 20005, sku: "SRK-020-N-XXL", size: "XXL", priceAdjustment: 100, stock: 20 },
      ]},
      { id: 2002, colorCode: "#800000", colorName: "Maroon", images: [getProductImage(20, "maroon")], variants: [
        { id: 20006, sku: "SRK-020-M-S", size: "S", priceAdjustment: 0, stock: 38 },
        { id: 20007, sku: "SRK-020-M-M", size: "M", priceAdjustment: 0, stock: 42 },
        { id: 20008, sku: "SRK-020-M-L", size: "L", priceAdjustment: 0, stock: 40 },
        { id: 20009, sku: "SRK-020-M-XL", size: "XL", priceAdjustment: 0, stock: 32 },
      ]},
      { id: 2003, colorCode: "#FFFFFF", colorName: "White", images: [getProductImage(20, "white")], variants: [
        { id: 20010, sku: "SRK-020-W-S", size: "S", priceAdjustment: 0, stock: 35 },
        { id: 20011, sku: "SRK-020-W-M", size: "M", priceAdjustment: 0, stock: 40 },
        { id: 20012, sku: "SRK-020-W-L", size: "L", priceAdjustment: 0, stock: 38 },
      ]},
    ],
    createdAt: "2024-01-15",
  },
  {
    id: 21, name: "A-Line Printed Kurti", slug: "a-line-printed-kurti",
    description: "Trendy A-line kurti with ethnic prints. Flattering silhouette for all body types.",
    basePrice: 1199, originalPrice: 1499, categoryId: 2, categoryName: "Kurtis", fabricType: "Cotton Blend", pattern: "Printed",
    careInstructions: "Machine wash", isFeatured: false, isNewArrival: true, isOnSale: true, rating: 4.4, reviewCount: 189,
    colors: [
      { id: 2101, colorCode: "#FF6347", colorName: "Tomato", images: [getProductImage(21, "tomato")], variants: [
        { id: 21001, sku: "ALK-021-T-S", size: "S", priceAdjustment: 0, stock: 28 },
        { id: 21002, sku: "ALK-021-T-M", size: "M", priceAdjustment: 0, stock: 32 },
        { id: 21003, sku: "ALK-021-T-L", size: "L", priceAdjustment: 0, stock: 30 },
        { id: 21004, sku: "ALK-021-T-XL", size: "XL", priceAdjustment: 50, stock: 22 },
      ]},
    ],
    createdAt: "2024-04-01",
  },
  {
    id: 22, name: "Chikankari Lucknowi Kurti", slug: "chikankari-lucknowi-kurti",
    description: "Authentic Lucknowi chikankari on pure cotton. Delicate hand embroidery.",
    basePrice: 2499, categoryId: 2, categoryName: "Kurtis", fabricType: "Cotton", pattern: "Chikankari",
    careInstructions: "Hand wash", isFeatured: true, isNewArrival: false, isOnSale: false, rating: 4.8, reviewCount: 156,
    colors: [
      { id: 2201, colorCode: "#FFFAFA", colorName: "Snow White", images: [getProductImage(22, "white")], variants: [
        { id: 22001, sku: "CLK-022-W-S", size: "S", priceAdjustment: 0, stock: 18 },
        { id: 22002, sku: "CLK-022-W-M", size: "M", priceAdjustment: 0, stock: 22 },
        { id: 22003, sku: "CLK-022-W-L", size: "L", priceAdjustment: 0, stock: 20 },
        { id: 22004, sku: "CLK-022-W-XL", size: "XL", priceAdjustment: 100, stock: 15 },
      ]},
      { id: 2202, colorCode: "#ADD8E6", colorName: "Light Blue", images: [getProductImage(22, "lightblue")], variants: [
        { id: 22005, sku: "CLK-022-B-S", size: "S", priceAdjustment: 0, stock: 16 },
        { id: 22006, sku: "CLK-022-B-M", size: "M", priceAdjustment: 0, stock: 20 },
        { id: 22007, sku: "CLK-022-B-L", size: "L", priceAdjustment: 0, stock: 18 },
      ]},
    ],
    createdAt: "2024-02-20",
  },
  {
    id: 23, name: "Palazzo Kurti Set", slug: "palazzo-kurti-set",
    description: "Complete kurti set with matching palazzo pants. Ready to wear ethnic ensemble.",
    basePrice: 1999, originalPrice: 2499, categoryId: 2, categoryName: "Kurtis", fabricType: "Rayon", pattern: "Solid",
    careInstructions: "Machine wash", isFeatured: true, isNewArrival: true, isOnSale: true, rating: 4.6, reviewCount: 267,
    colors: [
      { id: 2301, colorCode: "#008B8B", colorName: "Dark Cyan", images: [getProductImage(23, "cyan")], variants: [
        { id: 23001, sku: "PKS-023-C-S", size: "S", priceAdjustment: 0, stock: 22 },
        { id: 23002, sku: "PKS-023-C-M", size: "M", priceAdjustment: 0, stock: 28 },
        { id: 23003, sku: "PKS-023-C-L", size: "L", priceAdjustment: 0, stock: 25 },
        { id: 23004, sku: "PKS-023-C-XL", size: "XL", priceAdjustment: 100, stock: 18 },
      ]},
      { id: 2302, colorCode: "#9932CC", colorName: "Dark Orchid", images: [getProductImage(23, "orchid")], variants: [
        { id: 23005, sku: "PKS-023-O-S", size: "S", priceAdjustment: 0, stock: 20 },
        { id: 23006, sku: "PKS-023-O-M", size: "M", priceAdjustment: 0, stock: 25 },
        { id: 23007, sku: "PKS-023-O-L", size: "L", priceAdjustment: 0, stock: 22 },
      ]},
    ],
    createdAt: "2024-04-05",
  },
  {
    id: 24, name: "Bandhani Print Kurti", slug: "bandhani-print-kurti",
    description: "Vibrant Bandhani tie-dye pattern kurti. Traditional Rajasthani craft.",
    basePrice: 1299, categoryId: 2, categoryName: "Kurtis", fabricType: "Cotton", pattern: "Bandhani",
    careInstructions: "Hand wash", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.4, reviewCount: 134,
    colors: [
      { id: 2401, colorCode: "#FF4500", colorName: "Orange Red", images: [getProductImage(24, "orange")], variants: [
        { id: 24001, sku: "BPK-024-O-S", size: "S", priceAdjustment: 0, stock: 30 },
        { id: 24002, sku: "BPK-024-O-M", size: "M", priceAdjustment: 0, stock: 35 },
        { id: 24003, sku: "BPK-024-O-L", size: "L", priceAdjustment: 0, stock: 32 },
      ]},
    ],
    createdAt: "2024-02-10",
  },
  {
    id: 25, name: "Denim Kurti Tunic", slug: "denim-kurti-tunic",
    description: "Trendy denim kurti with button details. Perfect Indo-western fusion.",
    basePrice: 1599, categoryId: 2, categoryName: "Kurtis", fabricType: "Denim", pattern: "Solid",
    careInstructions: "Machine wash", isFeatured: false, isNewArrival: true, isOnSale: false, rating: 4.2, reviewCount: 89,
    colors: [
      { id: 2501, colorCode: "#4169E1", colorName: "Royal Blue", images: [getProductImage(25, "denim")], variants: [
        { id: 25001, sku: "DKT-025-B-S", size: "S", priceAdjustment: 0, stock: 25 },
        { id: 25002, sku: "DKT-025-B-M", size: "M", priceAdjustment: 0, stock: 30 },
        { id: 25003, sku: "DKT-025-B-L", size: "L", priceAdjustment: 0, stock: 28 },
        { id: 25004, sku: "DKT-025-B-XL", size: "XL", priceAdjustment: 50, stock: 20 },
      ]},
    ],
    createdAt: "2024-03-28",
  },
  {
    id: 26, name: "Mirror Work Kurti", slug: "mirror-work-kurti",
    description: "Colorful kurti with traditional mirror work. Gujarati craft on cotton base.",
    basePrice: 1799, originalPrice: 2199, categoryId: 2, categoryName: "Kurtis", fabricType: "Cotton", pattern: "Mirror Work",
    careInstructions: "Hand wash", isFeatured: false, isNewArrival: false, isOnSale: true, rating: 4.5, reviewCount: 112,
    colors: [
      { id: 2601, colorCode: "#DC143C", colorName: "Crimson", images: [getProductImage(26, "crimson")], variants: [
        { id: 26001, sku: "MWK-026-C-S", size: "S", priceAdjustment: 0, stock: 18 },
        { id: 26002, sku: "MWK-026-C-M", size: "M", priceAdjustment: 0, stock: 22 },
        { id: 26003, sku: "MWK-026-C-L", size: "L", priceAdjustment: 0, stock: 20 },
      ]},
    ],
    createdAt: "2024-01-30",
  },
  {
    id: 27, name: "Kaftan Style Kurti", slug: "kaftan-style-kurti",
    description: "Relaxed kaftan style kurti with bat sleeves. Comfortable lounge wear.",
    basePrice: 999, categoryId: 2, categoryName: "Kurtis", fabricType: "Viscose", pattern: "Printed",
    careInstructions: "Machine wash", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.1, reviewCount: 178,
    colors: [
      { id: 2701, colorCode: "#2E8B57", colorName: "Sea Green", images: [getProductImage(27, "seagreen")], variants: [
        { id: 27001, sku: "KSK-027-S-FREE", size: "Free Size", priceAdjustment: 0, stock: 45 },
      ]},
      { id: 2702, colorCode: "#BA55D3", colorName: "Medium Orchid", images: [getProductImage(27, "orchid")], variants: [
        { id: 27002, sku: "KSK-027-O-FREE", size: "Free Size", priceAdjustment: 0, stock: 40 },
      ]},
    ],
    createdAt: "2024-02-05",
  },
  {
    id: 28, name: "Asymmetric Designer Kurti", slug: "asymmetric-designer-kurti",
    description: "Modern asymmetric hemline kurti. Contemporary design for fashion forward.",
    basePrice: 1899, categoryId: 2, categoryName: "Kurtis", fabricType: "Crepe", pattern: "Solid",
    careInstructions: "Dry clean", isFeatured: true, isNewArrival: true, isOnSale: false, rating: 4.6, reviewCount: 67,
    colors: [
      { id: 2801, colorCode: "#2F4F4F", colorName: "Dark Slate Grey", images: [getProductImage(28, "grey")], variants: [
        { id: 28001, sku: "ADK-028-G-S", size: "S", priceAdjustment: 0, stock: 15 },
        { id: 28002, sku: "ADK-028-G-M", size: "M", priceAdjustment: 0, stock: 20 },
        { id: 28003, sku: "ADK-028-G-L", size: "L", priceAdjustment: 0, stock: 18 },
      ]},
    ],
    createdAt: "2024-04-12",
  },
  {
    id: 29, name: "Angrakha Style Kurti", slug: "angrakha-style-kurti",
    description: "Traditional angrakha overlap style kurti. Elegant festive wear.",
    basePrice: 1699, categoryId: 2, categoryName: "Kurtis", fabricType: "Silk Blend", pattern: "Brocade",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.5, reviewCount: 98,
    colors: [
      { id: 2901, colorCode: "#DAA520", colorName: "Goldenrod", images: [getProductImage(29, "gold")], variants: [
        { id: 29001, sku: "ASK-029-G-S", size: "S", priceAdjustment: 0, stock: 20 },
        { id: 29002, sku: "ASK-029-G-M", size: "M", priceAdjustment: 0, stock: 25 },
        { id: 29003, sku: "ASK-029-G-L", size: "L", priceAdjustment: 0, stock: 22 },
        { id: 29004, sku: "ASK-029-G-XL", size: "XL", priceAdjustment: 100, stock: 15 },
      ]},
    ],
    createdAt: "2024-03-05",
  },
  {
    id: 30, name: "Short Kurti Top", slug: "short-kurti-top",
    description: "Trendy short kurti perfect with jeans. Casual daily wear essential.",
    basePrice: 699, originalPrice: 899, categoryId: 2, categoryName: "Kurtis", fabricType: "Cotton", pattern: "Solid",
    careInstructions: "Machine wash", isFeatured: false, isNewArrival: false, isOnSale: true, rating: 4.2, reviewCount: 289,
    colors: [
      { id: 3001, colorCode: "#FF69B4", colorName: "Hot Pink", images: [getProductImage(30, "pink")], variants: [
        { id: 30001, sku: "SKT-030-P-S", size: "S", priceAdjustment: 0, stock: 50 },
        { id: 30002, sku: "SKT-030-P-M", size: "M", priceAdjustment: 0, stock: 55 },
        { id: 30003, sku: "SKT-030-P-L", size: "L", priceAdjustment: 0, stock: 52 },
        { id: 30004, sku: "SKT-030-P-XL", size: "XL", priceAdjustment: 0, stock: 45 },
      ]},
      { id: 3002, colorCode: "#4682B4", colorName: "Steel Blue", images: [getProductImage(30, "blue")], variants: [
        { id: 30005, sku: "SKT-030-B-S", size: "S", priceAdjustment: 0, stock: 48 },
        { id: 30006, sku: "SKT-030-B-M", size: "M", priceAdjustment: 0, stock: 52 },
        { id: 30007, sku: "SKT-030-B-L", size: "L", priceAdjustment: 0, stock: 50 },
      ]},
    ],
    createdAt: "2024-01-20",
  },

  // LEHENGAS (8 products)
  {
    id: 31, name: "Bridal Red Lehenga", slug: "bridal-red-lehenga",
    description: "Stunning bridal lehenga with heavy zardozi work. Complete set with dupatta and blouse.",
    basePrice: 45999, originalPrice: 55999, categoryId: 3, categoryName: "Lehengas", fabricType: "Velvet Silk", pattern: "Zardozi",
    careInstructions: "Dry clean only", isFeatured: true, isNewArrival: false, isOnSale: true, rating: 4.9, reviewCount: 45,
    colors: [
      { id: 3101, colorCode: "#B22222", colorName: "Bridal Red", images: [getProductImage(31, "red")], variants: [
        { id: 31001, sku: "BRL-031-R-S", size: "S", priceAdjustment: 0, stock: 3 },
        { id: 31002, sku: "BRL-031-R-M", size: "M", priceAdjustment: 0, stock: 5 },
        { id: 31003, sku: "BRL-031-R-L", size: "L", priceAdjustment: 0, stock: 4 },
      ]},
    ],
    createdAt: "2024-02-14",
  },
  {
    id: 32, name: "Designer Party Lehenga", slug: "designer-party-lehenga",
    description: "Elegant party wear lehenga with sequin work. Perfect for sangeet and reception.",
    basePrice: 18999, categoryId: 3, categoryName: "Lehengas", fabricType: "Net", pattern: "Sequin Work",
    careInstructions: "Dry clean only", isFeatured: true, isNewArrival: true, isOnSale: false, rating: 4.7, reviewCount: 78,
    colors: [
      { id: 3201, colorCode: "#FF1493", colorName: "Deep Pink", images: [getProductImage(32, "pink")], variants: [
        { id: 32001, sku: "DPL-032-P-S", size: "S", priceAdjustment: 0, stock: 8 },
        { id: 32002, sku: "DPL-032-P-M", size: "M", priceAdjustment: 0, stock: 10 },
        { id: 32003, sku: "DPL-032-P-L", size: "L", priceAdjustment: 0, stock: 8 },
      ]},
      { id: 3202, colorCode: "#7B68EE", colorName: "Medium Slate Blue", images: [getProductImage(32, "blue")], variants: [
        { id: 32004, sku: "DPL-032-B-S", size: "S", priceAdjustment: 0, stock: 6 },
        { id: 32005, sku: "DPL-032-B-M", size: "M", priceAdjustment: 0, stock: 8 },
        { id: 32006, sku: "DPL-032-B-L", size: "L", priceAdjustment: 0, stock: 7 },
      ]},
    ],
    createdAt: "2024-04-08",
  },
  {
    id: 33, name: "Pastel Lehenga Set", slug: "pastel-lehenga-set",
    description: "Soft pastel lehenga with delicate embroidery. Dreamy look for pre-wedding events.",
    basePrice: 12999, categoryId: 3, categoryName: "Lehengas", fabricType: "Organza", pattern: "Thread Work",
    careInstructions: "Dry clean only", isFeatured: false, isNewArrival: true, isOnSale: false, rating: 4.6, reviewCount: 56,
    colors: [
      { id: 3301, colorCode: "#E6E6FA", colorName: "Lavender", images: [getProductImage(33, "lavender")], variants: [
        { id: 33001, sku: "PLS-033-L-S", size: "S", priceAdjustment: 0, stock: 10 },
        { id: 33002, sku: "PLS-033-L-M", size: "M", priceAdjustment: 0, stock: 12 },
        { id: 33003, sku: "PLS-033-L-L", size: "L", priceAdjustment: 0, stock: 10 },
      ]},
      { id: 3302, colorCode: "#FFDAB9", colorName: "Peach Puff", images: [getProductImage(33, "peach")], variants: [
        { id: 33004, sku: "PLS-033-P-S", size: "S", priceAdjustment: 0, stock: 8 },
        { id: 33005, sku: "PLS-033-P-M", size: "M", priceAdjustment: 0, stock: 10 },
        { id: 33006, sku: "PLS-033-P-L", size: "L", priceAdjustment: 0, stock: 9 },
      ]},
    ],
    createdAt: "2024-03-25",
  },
  {
    id: 34, name: "Banarasi Lehenga", slug: "banarasi-lehenga",
    description: "Traditional Banarasi brocade lehenga. Rich heritage wear for weddings.",
    basePrice: 28999, categoryId: 3, categoryName: "Lehengas", fabricType: "Banarasi Silk", pattern: "Brocade",
    careInstructions: "Dry clean only", isFeatured: true, isNewArrival: false, isOnSale: false, rating: 4.8, reviewCount: 34,
    colors: [
      { id: 3401, colorCode: "#DC143C", colorName: "Crimson", images: [getProductImage(34, "crimson")], variants: [
        { id: 34001, sku: "BLN-034-C-S", size: "S", priceAdjustment: 0, stock: 5 },
        { id: 34002, sku: "BLN-034-C-M", size: "M", priceAdjustment: 0, stock: 7 },
        { id: 34003, sku: "BLN-034-C-L", size: "L", priceAdjustment: 0, stock: 6 },
      ]},
    ],
    createdAt: "2024-01-28",
  },
  {
    id: 35, name: "Floral Print Lehenga", slug: "floral-print-lehenga",
    description: "Modern floral printed lehenga. Fresh and youthful for mehendi ceremony.",
    basePrice: 8999, originalPrice: 10999, categoryId: 3, categoryName: "Lehengas", fabricType: "Georgette", pattern: "Floral Print",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: false, isOnSale: true, rating: 4.4, reviewCount: 89,
    colors: [
      { id: 3501, colorCode: "#FFB6C1", colorName: "Light Pink", images: [getProductImage(35, "pink")], variants: [
        { id: 35001, sku: "FPL-035-P-S", size: "S", priceAdjustment: 0, stock: 12 },
        { id: 35002, sku: "FPL-035-P-M", size: "M", priceAdjustment: 0, stock: 15 },
        { id: 35003, sku: "FPL-035-P-L", size: "L", priceAdjustment: 0, stock: 13 },
      ]},
    ],
    createdAt: "2024-02-22",
  },
  {
    id: 36, name: "Velvet Winter Lehenga", slug: "velvet-winter-lehenga",
    description: "Rich velvet lehenga for winter weddings. Luxurious fabric with gota patti work.",
    basePrice: 22999, categoryId: 3, categoryName: "Lehengas", fabricType: "Velvet", pattern: "Gota Patti",
    careInstructions: "Dry clean only", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.7, reviewCount: 45,
    colors: [
      { id: 3601, colorCode: "#191970", colorName: "Midnight Blue", images: [getProductImage(36, "blue")], variants: [
        { id: 36001, sku: "VWL-036-B-S", size: "S", priceAdjustment: 0, stock: 6 },
        { id: 36002, sku: "VWL-036-B-M", size: "M", priceAdjustment: 0, stock: 8 },
        { id: 36003, sku: "VWL-036-B-L", size: "L", priceAdjustment: 0, stock: 7 },
      ]},
    ],
    createdAt: "2024-01-05",
  },
  {
    id: 37, name: "Cancan Lehenga", slug: "cancan-lehenga",
    description: "Voluminous cancan lehenga for dramatic look. Perfect for receptions.",
    basePrice: 15999, categoryId: 3, categoryName: "Lehengas", fabricType: "Tissue", pattern: "Embroidered",
    careInstructions: "Dry clean only", isFeatured: false, isNewArrival: true, isOnSale: false, rating: 4.5, reviewCount: 67,
    colors: [
      { id: 3701, colorCode: "#FF6347", colorName: "Tomato", images: [getProductImage(37, "tomato")], variants: [
        { id: 37001, sku: "CCL-037-T-S", size: "S", priceAdjustment: 0, stock: 8 },
        { id: 37002, sku: "CCL-037-T-M", size: "M", priceAdjustment: 0, stock: 10 },
        { id: 37003, sku: "CCL-037-T-L", size: "L", priceAdjustment: 0, stock: 9 },
      ]},
    ],
    createdAt: "2024-04-02",
  },
  {
    id: 38, name: "Half Saree Lehenga", slug: "half-saree-lehenga",
    description: "South Indian style half saree. Traditional wear for coming-of-age ceremonies.",
    basePrice: 6999, categoryId: 3, categoryName: "Lehengas", fabricType: "Art Silk", pattern: "Temple Border",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.3, reviewCount: 78,
    colors: [
      { id: 3801, colorCode: "#32CD32", colorName: "Lime Green", images: [getProductImage(38, "green")], variants: [
        { id: 38001, sku: "HSL-038-G-S", size: "S", priceAdjustment: 0, stock: 15 },
        { id: 38002, sku: "HSL-038-G-M", size: "M", priceAdjustment: 0, stock: 18 },
        { id: 38003, sku: "HSL-038-G-L", size: "L", priceAdjustment: 0, stock: 16 },
      ]},
    ],
    createdAt: "2024-03-10",
  },

  // DRESS MATERIALS (10 products)
  {
    id: 39, name: "Cotton Suit Material", slug: "cotton-suit-material",
    description: "Pure cotton unstitched suit with dupatta. Easy to customize to your measurements.",
    basePrice: 1299, categoryId: 4, categoryName: "Dress Materials", fabricType: "Cotton", pattern: "Printed",
    careInstructions: "Machine wash", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.3, reviewCount: 156,
    colors: [
      { id: 3901, colorCode: "#FF7F50", colorName: "Coral", images: [getProductImage(39, "coral")], variants: [
        { id: 39001, sku: "CSM-039-C-S", size: "Unstitched", priceAdjustment: 0, stock: 30 },
      ]},
      { id: 3902, colorCode: "#6B8E23", colorName: "Olive Drab", images: [getProductImage(39, "olive")], variants: [
        { id: 39002, sku: "CSM-039-O-S", size: "Unstitched", priceAdjustment: 0, stock: 28 },
      ]},
    ],
    createdAt: "2024-02-08",
  },
  {
    id: 40, name: "Chanderi Suit Piece", slug: "chanderi-suit-piece",
    description: "Elegant Chanderi silk suit material. Lightweight with golden zari work.",
    basePrice: 2499, categoryId: 4, categoryName: "Dress Materials", fabricType: "Chanderi Silk", pattern: "Zari Work",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: true, isOnSale: false, rating: 4.5, reviewCount: 89,
    colors: [
      { id: 4001, colorCode: "#DEB887", colorName: "Burlywood", images: [getProductImage(40, "burlywood")], variants: [
        { id: 40001, sku: "CSP-040-B-S", size: "Unstitched", priceAdjustment: 0, stock: 22 },
      ]},
    ],
    createdAt: "2024-03-15",
  },
  {
    id: 41, name: "Embroidered Lawn Suit", slug: "embroidered-lawn-suit",
    description: "Pakistani style lawn suit with heavy embroidery. Premium quality fabric.",
    basePrice: 3299, originalPrice: 3999, categoryId: 4, categoryName: "Dress Materials", fabricType: "Lawn Cotton", pattern: "Embroidered",
    careInstructions: "Hand wash", isFeatured: true, isNewArrival: false, isOnSale: true, rating: 4.6, reviewCount: 112,
    colors: [
      { id: 4101, colorCode: "#F0E68C", colorName: "Khaki", images: [getProductImage(41, "khaki")], variants: [
        { id: 41001, sku: "ELS-041-K-S", size: "Unstitched", priceAdjustment: 0, stock: 18 },
      ]},
      { id: 4102, colorCode: "#E0FFFF", colorName: "Light Cyan", images: [getProductImage(41, "cyan")], variants: [
        { id: 41002, sku: "ELS-041-C-S", size: "Unstitched", priceAdjustment: 0, stock: 15 },
      ]},
    ],
    createdAt: "2024-01-22",
  },
  {
    id: 42, name: "Jamavar Suit Material", slug: "jamavar-suit-material",
    description: "Rich Jamavar patterned suit piece. Traditional Kashmiri weave.",
    basePrice: 4999, categoryId: 4, categoryName: "Dress Materials", fabricType: "Jamavar", pattern: "Paisley",
    careInstructions: "Dry clean only", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.7, reviewCount: 56,
    colors: [
      { id: 4201, colorCode: "#8B0000", colorName: "Dark Red", images: [getProductImage(42, "darkred")], variants: [
        { id: 42001, sku: "JSM-042-R-S", size: "Unstitched", priceAdjustment: 0, stock: 12 },
      ]},
    ],
    createdAt: "2024-02-28",
  },
  {
    id: 43, name: "Georgette Palazzo Suit", slug: "georgette-palazzo-suit",
    description: "Trendy georgette suit with palazzo pattern. Ready to stitch modern look.",
    basePrice: 1899, categoryId: 4, categoryName: "Dress Materials", fabricType: "Georgette", pattern: "Printed",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: true, isOnSale: false, rating: 4.4, reviewCount: 78,
    colors: [
      { id: 4301, colorCode: "#9370DB", colorName: "Medium Purple", images: [getProductImage(43, "purple")], variants: [
        { id: 43001, sku: "GPS-043-P-S", size: "Unstitched", priceAdjustment: 0, stock: 25 },
      ]},
    ],
    createdAt: "2024-04-05",
  },
  {
    id: 44, name: "Jacquard Suit Set", slug: "jacquard-suit-set",
    description: "Self-design jacquard suit with contrast dupatta. Elegant formal wear.",
    basePrice: 2199, originalPrice: 2699, categoryId: 4, categoryName: "Dress Materials", fabricType: "Jacquard", pattern: "Self Design",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: false, isOnSale: true, rating: 4.3, reviewCount: 92,
    colors: [
      { id: 4401, colorCode: "#2E8B57", colorName: "Sea Green", images: [getProductImage(44, "seagreen")], variants: [
        { id: 44001, sku: "JSS-044-G-S", size: "Unstitched", priceAdjustment: 0, stock: 20 },
      ]},
    ],
    createdAt: "2024-03-02",
  },
  {
    id: 45, name: "Banarasi Suit Material", slug: "banarasi-suit-material",
    description: "Luxurious Banarasi brocade suit piece. Perfect for festive occasions.",
    basePrice: 5499, categoryId: 4, categoryName: "Dress Materials", fabricType: "Banarasi", pattern: "Brocade",
    careInstructions: "Dry clean only", isFeatured: true, isNewArrival: false, isOnSale: false, rating: 4.8, reviewCount: 67,
    colors: [
      { id: 4501, colorCode: "#FFD700", colorName: "Gold", images: [getProductImage(45, "gold")], variants: [
        { id: 45001, sku: "BSM-045-G-S", size: "Unstitched", priceAdjustment: 0, stock: 10 },
      ]},
    ],
    createdAt: "2024-01-18",
  },
  {
    id: 46, name: "Kota Doria Suit", slug: "kota-doria-suit",
    description: "Airy Kota Doria suit for summer. Light and comfortable with zari checks.",
    basePrice: 1799, categoryId: 4, categoryName: "Dress Materials", fabricType: "Kota Doria", pattern: "Checks",
    careInstructions: "Hand wash", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.2, reviewCount: 104,
    colors: [
      { id: 4601, colorCode: "#FFA07A", colorName: "Light Salmon", images: [getProductImage(46, "salmon")], variants: [
        { id: 46001, sku: "KDS-046-S-S", size: "Unstitched", priceAdjustment: 0, stock: 28 },
      ]},
    ],
    createdAt: "2024-02-12",
  },
  {
    id: 47, name: "Printed Crepe Suit", slug: "printed-crepe-suit",
    description: "Digital printed crepe suit material. Modern prints on quality fabric.",
    basePrice: 1499, categoryId: 4, categoryName: "Dress Materials", fabricType: "Crepe", pattern: "Digital Print",
    careInstructions: "Machine wash", isFeatured: false, isNewArrival: true, isOnSale: false, rating: 4.1, reviewCount: 134,
    colors: [
      { id: 4701, colorCode: "#FF4500", colorName: "Orange Red", images: [getProductImage(47, "orange")], variants: [
        { id: 47001, sku: "PCS-047-O-S", size: "Unstitched", priceAdjustment: 0, stock: 32 },
      ]},
      { id: 4702, colorCode: "#4682B4", colorName: "Steel Blue", images: [getProductImage(47, "blue")], variants: [
        { id: 47002, sku: "PCS-047-B-S", size: "Unstitched", priceAdjustment: 0, stock: 30 },
      ]},
    ],
    createdAt: "2024-04-10",
  },
  {
    id: 48, name: "Muslin Suit Material", slug: "muslin-suit-material",
    description: "Soft muslin cotton suit with delicate embroidery. Breathable and elegant.",
    basePrice: 1999, categoryId: 4, categoryName: "Dress Materials", fabricType: "Muslin", pattern: "Embroidered",
    careInstructions: "Hand wash", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.4, reviewCount: 87,
    colors: [
      { id: 4801, colorCode: "#FFFAF0", colorName: "Floral White", images: [getProductImage(48, "white")], variants: [
        { id: 48001, sku: "MSM-048-W-S", size: "Unstitched", priceAdjustment: 0, stock: 24 },
      ]},
    ],
    createdAt: "2024-03-18",
  },

  // DUPATTAS (6 products)
  {
    id: 49, name: "Phulkari Dupatta", slug: "phulkari-dupatta",
    description: "Traditional Punjabi Phulkari with vibrant thread work. Handmade artisan craft.",
    basePrice: 1999, categoryId: 5, categoryName: "Dupattas", fabricType: "Cotton", pattern: "Phulkari",
    careInstructions: "Dry clean", isFeatured: true, isNewArrival: false, isOnSale: false, rating: 4.7, reviewCount: 89,
    colors: [
      { id: 4901, colorCode: "#FF0000", colorName: "Red", images: [getProductImage(49, "red")], variants: [
        { id: 49001, sku: "PHD-049-R-S", size: "Standard", priceAdjustment: 0, stock: 20 },
      ]},
      { id: 4902, colorCode: "#FFFF00", colorName: "Yellow", images: [getProductImage(49, "yellow")], variants: [
        { id: 49002, sku: "PHD-049-Y-S", size: "Standard", priceAdjustment: 0, stock: 18 },
      ]},
    ],
    createdAt: "2024-02-05",
  },
  {
    id: 50, name: "Banarasi Silk Dupatta", slug: "banarasi-silk-dupatta",
    description: "Rich Banarasi silk dupatta with zari work. Perfect to pair with suits.",
    basePrice: 2499, categoryId: 5, categoryName: "Dupattas", fabricType: "Banarasi Silk", pattern: "Zari",
    careInstructions: "Dry clean only", isFeatured: false, isNewArrival: true, isOnSale: false, rating: 4.6, reviewCount: 67,
    colors: [
      { id: 5001, colorCode: "#800080", colorName: "Purple", images: [getProductImage(50, "purple")], variants: [
        { id: 50001, sku: "BSD-050-P-S", size: "Standard", priceAdjustment: 0, stock: 15 },
      ]},
    ],
    createdAt: "2024-04-01",
  },
  {
    id: 51, name: "Chiffon Printed Dupatta", slug: "chiffon-printed-dupatta",
    description: "Light chiffon dupatta with digital prints. Versatile and elegant.",
    basePrice: 699, originalPrice: 899, categoryId: 5, categoryName: "Dupattas", fabricType: "Chiffon", pattern: "Printed",
    careInstructions: "Hand wash", isFeatured: false, isNewArrival: false, isOnSale: true, rating: 4.2, reviewCount: 145,
    colors: [
      { id: 5101, colorCode: "#FF69B4", colorName: "Hot Pink", images: [getProductImage(51, "pink")], variants: [
        { id: 51001, sku: "CPD-051-P-S", size: "Standard", priceAdjustment: 0, stock: 40 },
      ]},
      { id: 5102, colorCode: "#87CEEB", colorName: "Sky Blue", images: [getProductImage(51, "blue")], variants: [
        { id: 51002, sku: "CPD-051-B-S", size: "Standard", priceAdjustment: 0, stock: 38 },
      ]},
    ],
    createdAt: "2024-01-28",
  },
  {
    id: 52, name: "Gotta Patti Dupatta", slug: "gotta-patti-dupatta",
    description: "Rajasthani gotta patti work dupatta. Festive and traditional.",
    basePrice: 1299, categoryId: 5, categoryName: "Dupattas", fabricType: "Net", pattern: "Gotta Patti",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.5, reviewCount: 78,
    colors: [
      { id: 5201, colorCode: "#FF4500", colorName: "Orange", images: [getProductImage(52, "orange")], variants: [
        { id: 52001, sku: "GPD-052-O-S", size: "Standard", priceAdjustment: 0, stock: 22 },
      ]},
    ],
    createdAt: "2024-03-08",
  },
  {
    id: 53, name: "Bandhani Dupatta", slug: "bandhani-dupatta",
    description: "Colorful Bandhani tie-dye dupatta. Traditional Gujarati craft.",
    basePrice: 899, categoryId: 5, categoryName: "Dupattas", fabricType: "Cotton", pattern: "Bandhani",
    careInstructions: "Hand wash", isFeatured: false, isNewArrival: true, isOnSale: false, rating: 4.4, reviewCount: 112,
    colors: [
      { id: 5301, colorCode: "#DC143C", colorName: "Crimson", images: [getProductImage(53, "crimson")], variants: [
        { id: 53001, sku: "BND-053-C-S", size: "Standard", priceAdjustment: 0, stock: 30 },
      ]},
      { id: 5302, colorCode: "#228B22", colorName: "Forest Green", images: [getProductImage(53, "green")], variants: [
        { id: 53002, sku: "BND-053-G-S", size: "Standard", priceAdjustment: 0, stock: 28 },
      ]},
    ],
    createdAt: "2024-04-12",
  },
  {
    id: 54, name: "Organza Embroidered Dupatta", slug: "organza-embroidered-dupatta",
    description: "Sheer organza dupatta with delicate embroidery. Modern and chic.",
    basePrice: 1599, categoryId: 5, categoryName: "Dupattas", fabricType: "Organza", pattern: "Embroidered",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.3, reviewCount: 56,
    colors: [
      { id: 5401, colorCode: "#DDA0DD", colorName: "Plum", images: [getProductImage(54, "plum")], variants: [
        { id: 54001, sku: "OED-054-P-S", size: "Standard", priceAdjustment: 0, stock: 18 },
      ]},
    ],
    createdAt: "2024-02-18",
  },

  // FABRICS (8 products)
  {
    id: 55, name: "Pure Silk Fabric", slug: "pure-silk-fabric",
    description: "Premium quality pure silk fabric. Sold per meter for custom tailoring.",
    basePrice: 899, categoryId: 6, categoryName: "Fabrics", fabricType: "Pure Silk", pattern: "Plain",
    careInstructions: "Dry clean only", isFeatured: true, isNewArrival: false, isOnSale: false, rating: 4.8, reviewCount: 234,
    colors: [
      { id: 5501, colorCode: "#C71585", colorName: "Medium Violet Red", images: [getProductImage(55, "violet")], variants: [
        { id: 55001, sku: "PSF-055-V-1M", size: "1 Meter", priceAdjustment: 0, stock: 50 },
        { id: 55002, sku: "PSF-055-V-2M", size: "2 Meters", priceAdjustment: 899, stock: 40 },
        { id: 55003, sku: "PSF-055-V-3M", size: "3 Meters", priceAdjustment: 1798, stock: 30 },
      ]},
      { id: 5502, colorCode: "#008080", colorName: "Teal", images: [getProductImage(55, "teal")], variants: [
        { id: 55004, sku: "PSF-055-T-1M", size: "1 Meter", priceAdjustment: 0, stock: 45 },
        { id: 55005, sku: "PSF-055-T-2M", size: "2 Meters", priceAdjustment: 899, stock: 38 },
      ]},
    ],
    createdAt: "2024-01-10",
  },
  {
    id: 56, name: "Cotton Cambric Fabric", slug: "cotton-cambric-fabric",
    description: "Soft cotton cambric for summer wear. Easy to stitch and comfortable.",
    basePrice: 299, categoryId: 6, categoryName: "Fabrics", fabricType: "Cotton Cambric", pattern: "Plain",
    careInstructions: "Machine wash", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.4, reviewCount: 345,
    colors: [
      { id: 5601, colorCode: "#FFFFFF", colorName: "White", images: [getProductImage(56, "white")], variants: [
        { id: 56001, sku: "CCF-056-W-1M", size: "1 Meter", priceAdjustment: 0, stock: 100 },
        { id: 56002, sku: "CCF-056-W-5M", size: "5 Meters", priceAdjustment: 1196, stock: 50 },
      ]},
      { id: 5602, colorCode: "#F5F5DC", colorName: "Beige", images: [getProductImage(56, "beige")], variants: [
        { id: 56003, sku: "CCF-056-B-1M", size: "1 Meter", priceAdjustment: 0, stock: 90 },
      ]},
    ],
    createdAt: "2024-02-02",
  },
  {
    id: 57, name: "Brocade Fabric", slug: "brocade-fabric",
    description: "Rich brocade fabric with metallic thread work. Perfect for festive wear.",
    basePrice: 699, originalPrice: 849, categoryId: 6, categoryName: "Fabrics", fabricType: "Brocade", pattern: "Jacquard",
    careInstructions: "Dry clean only", isFeatured: false, isNewArrival: true, isOnSale: true, rating: 4.6, reviewCount: 156,
    colors: [
      { id: 5701, colorCode: "#B8860B", colorName: "Dark Goldenrod", images: [getProductImage(57, "gold")], variants: [
        { id: 57001, sku: "BRF-057-G-1M", size: "1 Meter", priceAdjustment: 0, stock: 35 },
        { id: 57002, sku: "BRF-057-G-2M", size: "2 Meters", priceAdjustment: 699, stock: 25 },
      ]},
    ],
    createdAt: "2024-03-22",
  },
  {
    id: 58, name: "Velvet Fabric", slug: "velvet-fabric",
    description: "Luxurious velvet fabric for winter garments. Rich texture and sheen.",
    basePrice: 599, categoryId: 6, categoryName: "Fabrics", fabricType: "Velvet", pattern: "Plain",
    careInstructions: "Dry clean only", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.5, reviewCount: 112,
    colors: [
      { id: 5801, colorCode: "#000080", colorName: "Navy Blue", images: [getProductImage(58, "navy")], variants: [
        { id: 58001, sku: "VLF-058-N-1M", size: "1 Meter", priceAdjustment: 0, stock: 40 },
      ]},
      { id: 5802, colorCode: "#800000", colorName: "Maroon", images: [getProductImage(58, "maroon")], variants: [
        { id: 58002, sku: "VLF-058-M-1M", size: "1 Meter", priceAdjustment: 0, stock: 38 },
      ]},
    ],
    createdAt: "2024-01-15",
  },
  {
    id: 59, name: "Linen Fabric", slug: "linen-fabric",
    description: "Premium linen fabric for summer clothing. Natural and breathable.",
    basePrice: 549, categoryId: 6, categoryName: "Fabrics", fabricType: "Linen", pattern: "Plain",
    careInstructions: "Hand wash", isFeatured: false, isNewArrival: true, isOnSale: false, rating: 4.7, reviewCount: 189,
    colors: [
      { id: 5901, colorCode: "#F5F5F5", colorName: "White Smoke", images: [getProductImage(59, "whitesmoke")], variants: [
        { id: 59001, sku: "LNF-059-W-1M", size: "1 Meter", priceAdjustment: 0, stock: 55 },
        { id: 59002, sku: "LNF-059-W-3M", size: "3 Meters", priceAdjustment: 1098, stock: 30 },
      ]},
    ],
    createdAt: "2024-04-08",
  },
  {
    id: 60, name: "Chanderi Fabric", slug: "chanderi-fabric",
    description: "Traditional Chanderi fabric with golden buti. Lightweight and elegant.",
    basePrice: 449, categoryId: 6, categoryName: "Fabrics", fabricType: "Chanderi", pattern: "Buti",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.4, reviewCount: 98,
    colors: [
      { id: 6001, colorCode: "#FFB6C1", colorName: "Light Pink", images: [getProductImage(60, "pink")], variants: [
        { id: 60001, sku: "CHF-060-P-1M", size: "1 Meter", priceAdjustment: 0, stock: 42 },
      ]},
    ],
    createdAt: "2024-02-25",
  },
  {
    id: 61, name: "Georgette Fabric", slug: "georgette-fabric",
    description: "Flowing georgette fabric for sarees and dresses. Easy drape and sheer look.",
    basePrice: 349, categoryId: 6, categoryName: "Fabrics", fabricType: "Georgette", pattern: "Plain",
    careInstructions: "Dry clean", isFeatured: false, isNewArrival: false, isOnSale: false, rating: 4.3, reviewCount: 167,
    colors: [
      { id: 6101, colorCode: "#FF6347", colorName: "Tomato", images: [getProductImage(61, "tomato")], variants: [
        { id: 61001, sku: "GGF-061-T-1M", size: "1 Meter", priceAdjustment: 0, stock: 60 },
      ]},
      { id: 6102, colorCode: "#4169E1", colorName: "Royal Blue", images: [getProductImage(61, "royal")], variants: [
        { id: 61002, sku: "GGF-061-R-1M", size: "1 Meter", priceAdjustment: 0, stock: 55 },
      ]},
    ],
    createdAt: "2024-03-12",
  },
  {
    id: 62, name: "Tussar Silk Fabric", slug: "tussar-silk-fabric",
    description: "Natural Tussar silk with earthy texture. Eco-friendly and unique.",
    basePrice: 749, categoryId: 6, categoryName: "Fabrics", fabricType: "Tussar Silk", pattern: "Natural",
    careInstructions: "Dry clean only", isFeatured: true, isNewArrival: false, isOnSale: false, rating: 4.6, reviewCount: 78,
    colors: [
      { id: 6201, colorCode: "#D2B48C", colorName: "Tan", images: [getProductImage(62, "tan")], variants: [
        { id: 62001, sku: "TSF-062-T-1M", size: "1 Meter", priceAdjustment: 0, stock: 30 },
        { id: 62002, sku: "TSF-062-T-2M", size: "2 Meters", priceAdjustment: 749, stock: 20 },
      ]},
    ],
    createdAt: "2024-01-25",
  },
];

// Helper functions
export const getFeaturedProducts = () => shopProducts.filter(p => p.isFeatured);
export const getNewArrivals = () => shopProducts.filter(p => p.isNewArrival);
export const getOnSaleProducts = () => shopProducts.filter(p => p.isOnSale);
export const getProductsByCategory = (categoryId: number) => shopProducts.filter(p => p.categoryId === categoryId);
export const getProductBySlug = (slug: string) => shopProducts.find(p => p.slug === slug);
export const getProductById = (id: number) => shopProducts.find(p => p.id === id);
export const getCategoryBySlug = (slug: string) => shopCategories.find(c => c.slug === slug);

// Filter options
export const fabricTypeOptions = [
  { label: "Pure Silk", value: "Pure Silk" },
  { label: "Banarasi Silk", value: "Banarasi Silk" },
  { label: "Cotton", value: "Cotton" },
  { label: "Cotton Silk", value: "Cotton Silk" },
  { label: "Linen", value: "Linen" },
  { label: "Georgette", value: "Georgette" },
  { label: "Chiffon", value: "Chiffon" },
  { label: "Organza", value: "Organza" },
  { label: "Rayon", value: "Rayon" },
  { label: "Crepe", value: "Crepe" },
  { label: "Velvet", value: "Velvet" },
  { label: "Net", value: "Net" },
];

export const priceRanges = [
  { label: "Under ₹1,000", min: 0, max: 999 },
  { label: "₹1,000 - ₹2,500", min: 1000, max: 2500 },
  { label: "₹2,500 - ₹5,000", min: 2500, max: 5000 },
  { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 - ₹25,000", min: 10000, max: 25000 },
  { label: "Above ₹25,000", min: 25000, max: Infinity },
];

export const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Popularity", value: "popular" },
  { label: "Rating", value: "rating" },
];
