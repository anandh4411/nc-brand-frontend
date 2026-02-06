// src/features/admin/inventory/data/mock-data.ts
import type { InventoryItem, LowStockAlert } from "@/types/dto/inventory.dto";

export const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    uuid: "inv-1",
    quantity: 25,
    lowStockThreshold: 10,
    batchNumber: "BATCH-2024-001",
    isLowStock: false,
    variant: {
      id: 1,
      uuid: "var-1",
      sku: "KS-MAR-STD",
      size: "Standard",
      productName: "Kanchipuram Silk Saree",
      productGroupName: "Kanchipuram Silk Saree",
      colorName: "Maroon",
    },
  },
  {
    id: 2,
    uuid: "inv-2",
    quantity: 18,
    lowStockThreshold: 10,
    batchNumber: "BATCH-2024-001",
    isLowStock: false,
    variant: {
      id: 2,
      uuid: "var-2",
      sku: "KS-GRN-STD",
      size: "Standard",
      productName: "Kanchipuram Silk Saree",
      productGroupName: "Kanchipuram Silk Saree",
      colorName: "Dark Green",
    },
  },
  {
    id: 3,
    uuid: "inv-3",
    quantity: 50,
    lowStockThreshold: 20,
    batchNumber: "BATCH-2024-002",
    isLowStock: false,
    variant: {
      id: 3,
      uuid: "var-3",
      sku: "KUR-BLU-S",
      size: "S",
      productName: "Cotton Casual Kurti",
      productGroupName: "Cotton Casual Kurti",
      colorName: "Royal Blue",
    },
  },
  {
    id: 4,
    uuid: "inv-4",
    quantity: 8,
    lowStockThreshold: 20,
    batchNumber: "BATCH-2024-002",
    isLowStock: true,
    variant: {
      id: 4,
      uuid: "var-4",
      sku: "KUR-BLU-M",
      size: "M",
      productName: "Cotton Casual Kurti",
      productGroupName: "Cotton Casual Kurti",
      colorName: "Royal Blue",
    },
  },
  {
    id: 5,
    uuid: "inv-5",
    quantity: 35,
    lowStockThreshold: 20,
    batchNumber: "BATCH-2024-002",
    isLowStock: false,
    variant: {
      id: 5,
      uuid: "var-5",
      sku: "KUR-BLU-L",
      size: "L",
      productName: "Cotton Casual Kurti",
      productGroupName: "Cotton Casual Kurti",
      colorName: "Royal Blue",
    },
  },
];

export const mockLowStockAlerts: LowStockAlert[] = [
  {
    productVariantId: 4,
    productVariantSku: "KUR-BLU-M",
    productName: "Cotton Casual Kurti",
    colorName: "Royal Blue",
    size: "M",
    currentQuantity: 8,
    threshold: 20,
    location: "manufacturing",
  },
];

// Adjustment reasons
export const adjustmentReasons = [
  { label: "Stock Count Correction", value: "count_correction" },
  { label: "Damaged/Defective", value: "damaged" },
  { label: "Return to Supplier", value: "return_supplier" },
  { label: "Sample/Display", value: "sample" },
  { label: "Production Completed", value: "production" },
  { label: "Other", value: "other" },
];
