// src/features/admin/products/data/mock-data.ts
import type { ProductGroup, Category } from "@/types/dto/product-catalog.dto";

export const mockProductGroups: ProductGroup[] = [
  {
    id: 1,
    uuid: "prod-001-uuid",
    name: "Kanchipuram Silk Saree",
    slug: "kanchipuram-silk-saree",
    description: "Premium handwoven Kanchipuram silk saree with gold zari work",
    basePrice: 15000,
    categoryId: 2,
    category: {
      id: 2,
      uuid: "cat-002-uuid",
      name: "Silk Sarees",
      slug: "silk-sarees",
      parentId: 1,
      isActive: true,
      sortOrder: 1,
      createdAt: "2024-01-12T11:00:00Z",
      updatedAt: "2024-06-10T09:15:00Z",
    },
    attributes: {
      fabricType: "silk",
      careInstructions: "Dry clean only. Store in muslin cloth.",
      pattern: "floral",
    },
    isActive: true,
    isFeatured: true,
    colorVariants: [
      {
        id: 1,
        uuid: "color-001-uuid",
        productGroupId: 1,
        colorCode: "#8B0000",
        colorName: "Maroon",
        images: [
          { id: 1, uuid: "img-001", imageUrl: "/products/kanchipuram-maroon-1.jpg", isPrimary: true, sortOrder: 1 },
          { id: 2, uuid: "img-002", imageUrl: "/products/kanchipuram-maroon-2.jpg", isPrimary: false, sortOrder: 2 },
        ],
        sizeVariants: [
          { id: 1, uuid: "var-001", productId: 1, sku: "KS-MAR-STD", size: "Standard", priceAdjustment: 0, isActive: true },
        ],
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-06-20T14:00:00Z",
      },
      {
        id: 2,
        uuid: "color-002-uuid",
        productGroupId: 1,
        colorCode: "#006400",
        colorName: "Dark Green",
        images: [
          { id: 3, uuid: "img-003", imageUrl: "/products/kanchipuram-green-1.jpg", isPrimary: true, sortOrder: 1 },
        ],
        sizeVariants: [
          { id: 2, uuid: "var-002", productId: 2, sku: "KS-GRN-STD", size: "Standard", priceAdjustment: 0, isActive: true },
        ],
        createdAt: "2024-01-16T10:00:00Z",
        updatedAt: "2024-06-18T12:00:00Z",
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-06-20T14:00:00Z",
  },
  {
    id: 2,
    uuid: "prod-002-uuid",
    name: "Cotton Casual Kurti",
    slug: "cotton-casual-kurti",
    description: "Comfortable cotton kurti for daily wear with block print",
    basePrice: 799,
    categoryId: 5,
    category: {
      id: 5,
      uuid: "cat-005-uuid",
      name: "Kurtis",
      slug: "kurtis",
      parentId: null,
      isActive: true,
      sortOrder: 3,
      createdAt: "2024-02-01T08:30:00Z",
      updatedAt: "2024-05-28T10:20:00Z",
    },
    attributes: {
      fabricType: "cotton",
      careInstructions: "Machine wash cold. Do not bleach.",
      pattern: "printed",
    },
    isActive: true,
    isFeatured: false,
    colorVariants: [
      {
        id: 3,
        uuid: "color-003-uuid",
        productGroupId: 2,
        colorCode: "#4169E1",
        colorName: "Royal Blue",
        images: [
          { id: 4, uuid: "img-004", imageUrl: "/products/kurti-blue-1.jpg", isPrimary: true, sortOrder: 1 },
        ],
        sizeVariants: [
          { id: 3, uuid: "var-003", productId: 3, sku: "KUR-BLU-S", size: "S", priceAdjustment: 0, isActive: true },
          { id: 4, uuid: "var-004", productId: 3, sku: "KUR-BLU-M", size: "M", priceAdjustment: 0, isActive: true },
          { id: 5, uuid: "var-005", productId: 3, sku: "KUR-BLU-L", size: "L", priceAdjustment: 0, isActive: true },
          { id: 6, uuid: "var-006", productId: 3, sku: "KUR-BLU-XL", size: "XL", priceAdjustment: 50, isActive: true },
        ],
        createdAt: "2024-02-05T09:00:00Z",
        updatedAt: "2024-06-15T11:00:00Z",
      },
      {
        id: 4,
        uuid: "color-004-uuid",
        productGroupId: 2,
        colorCode: "#FF6347",
        colorName: "Tomato Red",
        images: [
          { id: 5, uuid: "img-005", imageUrl: "/products/kurti-red-1.jpg", isPrimary: true, sortOrder: 1 },
        ],
        sizeVariants: [
          { id: 7, uuid: "var-007", productId: 4, sku: "KUR-RED-S", size: "S", priceAdjustment: 0, isActive: true },
          { id: 8, uuid: "var-008", productId: 4, sku: "KUR-RED-M", size: "M", priceAdjustment: 0, isActive: true },
          { id: 9, uuid: "var-009", productId: 4, sku: "KUR-RED-L", size: "L", priceAdjustment: 0, isActive: true },
        ],
        createdAt: "2024-02-06T09:00:00Z",
        updatedAt: "2024-06-12T10:00:00Z",
      },
    ],
    createdAt: "2024-02-05T09:00:00Z",
    updatedAt: "2024-06-15T11:00:00Z",
  },
  {
    id: 3,
    uuid: "prod-003-uuid",
    name: "Banarasi Wedding Lehenga",
    slug: "banarasi-wedding-lehenga",
    description: "Exquisite Banarasi silk lehenga with heavy zardozi work for weddings",
    basePrice: 45000,
    categoryId: 6,
    category: {
      id: 6,
      uuid: "cat-006-uuid",
      name: "Lehengas",
      slug: "lehengas",
      parentId: null,
      isActive: true,
      sortOrder: 4,
      createdAt: "2024-02-10T10:00:00Z",
      updatedAt: "2024-06-12T13:00:00Z",
    },
    attributes: {
      fabricType: "silk",
      careInstructions: "Professional dry clean only.",
      pattern: "floral",
    },
    isActive: true,
    isFeatured: true,
    colorVariants: [
      {
        id: 5,
        uuid: "color-005-uuid",
        productGroupId: 3,
        colorCode: "#FFD700",
        colorName: "Gold",
        images: [
          { id: 6, uuid: "img-006", imageUrl: "/products/lehenga-gold-1.jpg", isPrimary: true, sortOrder: 1 },
        ],
        sizeVariants: [
          { id: 10, uuid: "var-010", productId: 5, sku: "LEH-GLD-S", size: "S", priceAdjustment: 0, isActive: true },
          { id: 11, uuid: "var-011", productId: 5, sku: "LEH-GLD-M", size: "M", priceAdjustment: 0, isActive: true },
          { id: 12, uuid: "var-012", productId: 5, sku: "LEH-GLD-L", size: "L", priceAdjustment: 2000, isActive: true },
        ],
        createdAt: "2024-02-12T10:00:00Z",
        updatedAt: "2024-06-10T14:00:00Z",
      },
    ],
    createdAt: "2024-02-12T10:00:00Z",
    updatedAt: "2024-06-10T14:00:00Z",
  },
  {
    id: 4,
    uuid: "prod-004-uuid",
    name: "Pure Linen Dress Material",
    slug: "pure-linen-dress-material",
    description: "Premium linen dress material with self patterns",
    basePrice: 2500,
    categoryId: 4,
    attributes: {
      fabricType: "linen",
      careInstructions: "Hand wash or gentle machine wash.",
      pattern: "solid",
    },
    isActive: false,
    isFeatured: false,
    colorVariants: [
      {
        id: 6,
        uuid: "color-006-uuid",
        productGroupId: 4,
        colorCode: "#F5F5DC",
        colorName: "Beige",
        images: [
          { id: 7, uuid: "img-007", imageUrl: "/products/linen-beige-1.jpg", isPrimary: true, sortOrder: 1 },
        ],
        sizeVariants: [
          { id: 13, uuid: "var-013", productId: 6, sku: "LIN-BEI-2.5M", size: "2.5 Meters", priceAdjustment: 0, isActive: true },
        ],
        createdAt: "2024-03-01T10:00:00Z",
        updatedAt: "2024-05-15T11:00:00Z",
      },
    ],
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-05-15T11:00:00Z",
  },
];

// Fabric type options
export const fabricTypeOptions = [
  { label: "Cotton", value: "cotton" },
  { label: "Polyester", value: "polyester" },
  { label: "Silk", value: "silk" },
  { label: "Wool", value: "wool" },
  { label: "Linen", value: "linen" },
  { label: "Blend", value: "blend" },
  { label: "Synthetic", value: "synthetic" },
  { label: "Other", value: "other" },
];

// Pattern options
export const patternOptions = [
  { label: "Solid", value: "solid" },
  { label: "Printed", value: "printed" },
  { label: "Striped", value: "striped" },
  { label: "Checkered", value: "checkered" },
  { label: "Floral", value: "floral" },
  { label: "Geometric", value: "geometric" },
  { label: "Abstract", value: "abstract" },
  { label: "Other", value: "other" },
];

// Common sizes for apparel
export const sizeOptions = [
  { label: "XS", value: "XS" },
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
  { label: "Standard", value: "Standard" },
  { label: "Free Size", value: "Free Size" },
];
