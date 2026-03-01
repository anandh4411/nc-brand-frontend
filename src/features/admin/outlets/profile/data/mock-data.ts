// src/features/admin/outlets/profile/data/mock-data.ts

export interface OutletProfileStats {
  totalStock: number;
  stockChange: number;
  lowStockItems: number;
  pendingShipments: number;
  todaySales: number;
  salesChange: number;
  monthlyRevenue: number;
}

export interface LowStockItem {
  name: string;
  sku: string;
  stock: number;
  threshold: number;
}

export interface Shipment {
  id: string;
  items: number;
  status: "in_transit" | "dispatched" | "processing";
  eta: string;
}

export interface RecentSale {
  id: string;
  customer: string;
  amount: number;
  items: number;
  time: string;
}

export interface SalesDataPoint {
  month: string;
  sales: number;
}

export interface CategoryDataPoint {
  category: string;
  value: number;
}

export interface OutletProfileData {
  stats: OutletProfileStats;
  salesData: SalesDataPoint[];
  categoryData: CategoryDataPoint[];
  lowStockItems: LowStockItem[];
  pendingShipments: Shipment[];
  recentSales: RecentSale[];
}

const defaultProfile: OutletProfileData = {
  stats: {
    totalStock: 1247,
    stockChange: 12,
    lowStockItems: 8,
    pendingShipments: 3,
    todaySales: 24500,
    salesChange: 18,
    monthlyRevenue: 367000,
  },
  salesData: [
    { month: "Jan", sales: 45000 },
    { month: "Feb", sales: 52000 },
    { month: "Mar", sales: 48000 },
    { month: "Apr", sales: 61000 },
    { month: "May", sales: 55000 },
    { month: "Jun", sales: 67000 },
    { month: "Jul", sales: 72000 },
  ],
  categoryData: [
    { category: "Sarees", value: 35 },
    { category: "Kurtis", value: 25 },
    { category: "Lehengas", value: 20 },
    { category: "Dress Mat.", value: 12 },
    { category: "Others", value: 8 },
  ],
  lowStockItems: [
    { name: "Banarasi Silk Saree - Royal Blue", sku: "BSS-001-RB", stock: 2, threshold: 5 },
    { name: "Cotton Casual Kurti - Maroon", sku: "CCK-023-MR", stock: 3, threshold: 10 },
    { name: "Chiffon Printed Saree - Pink", sku: "CPS-045-PK", stock: 1, threshold: 5 },
  ],
  pendingShipments: [
    { id: "SHP-001", items: 45, status: "in_transit", eta: "Today" },
    { id: "SHP-002", items: 32, status: "dispatched", eta: "Tomorrow" },
    { id: "SHP-003", items: 28, status: "processing", eta: "2 days" },
  ],
  recentSales: [
    { id: "ORD-156", customer: "Priya Sharma", amount: 4599, items: 2, time: "10 mins ago" },
    { id: "ORD-155", customer: "Meera Patel", amount: 8999, items: 1, time: "25 mins ago" },
    { id: "ORD-154", customer: "Anjali Reddy", amount: 2199, items: 3, time: "1 hour ago" },
    { id: "ORD-153", customer: "Kavitha Nair", amount: 5499, items: 2, time: "2 hours ago" },
  ],
};

// Per-outlet overrides keyed by UUID
export const outletProfileDataMap: Record<string, OutletProfileData> = {
  // Chennai Main Store
  "550e8400-e29b-41d4-a716-446655440001": {
    ...defaultProfile,
    stats: {
      totalStock: 1247,
      stockChange: 12,
      lowStockItems: 8,
      pendingShipments: 3,
      todaySales: 24500,
      salesChange: 18,
      monthlyRevenue: 367000,
    },
  },
  // Coimbatore Branch
  "550e8400-e29b-41d4-a716-446655440002": {
    stats: {
      totalStock: 892,
      stockChange: -3,
      lowStockItems: 5,
      pendingShipments: 2,
      todaySales: 18200,
      salesChange: 8,
      monthlyRevenue: 285000,
    },
    salesData: [
      { month: "Jan", sales: 38000 },
      { month: "Feb", sales: 41000 },
      { month: "Mar", sales: 36000 },
      { month: "Apr", sales: 49000 },
      { month: "May", sales: 44000 },
      { month: "Jun", sales: 51000 },
      { month: "Jul", sales: 55000 },
    ],
    categoryData: [
      { category: "Sarees", value: 30 },
      { category: "Kurtis", value: 28 },
      { category: "Lehengas", value: 18 },
      { category: "Dress Mat.", value: 14 },
      { category: "Others", value: 10 },
    ],
    lowStockItems: [
      { name: "Kanchipuram Silk - Gold", sku: "KSS-012-GD", stock: 1, threshold: 5 },
      { name: "Printed Cotton Kurti - Teal", sku: "PCK-034-TL", stock: 4, threshold: 10 },
    ],
    pendingShipments: [
      { id: "SHP-018", items: 30, status: "in_transit", eta: "Today" },
      { id: "SHP-019", items: 22, status: "processing", eta: "3 days" },
    ],
    recentSales: [
      { id: "ORD-089", customer: "Lakshmi Devi", amount: 3299, items: 1, time: "5 mins ago" },
      { id: "ORD-088", customer: "Ranjitha K", amount: 7450, items: 2, time: "40 mins ago" },
      { id: "ORD-087", customer: "Suresh Kumar", amount: 1899, items: 1, time: "2 hours ago" },
    ],
  },
  // Madurai Outlet
  "550e8400-e29b-41d4-a716-446655440003": {
    stats: {
      totalStock: 654,
      stockChange: 5,
      lowStockItems: 12,
      pendingShipments: 4,
      todaySales: 15800,
      salesChange: -2,
      monthlyRevenue: 198000,
    },
    salesData: [
      { month: "Jan", sales: 28000 },
      { month: "Feb", sales: 31000 },
      { month: "Mar", sales: 27000 },
      { month: "Apr", sales: 35000 },
      { month: "May", sales: 32000 },
      { month: "Jun", sales: 38000 },
      { month: "Jul", sales: 41000 },
    ],
    categoryData: [
      { category: "Sarees", value: 40 },
      { category: "Kurtis", value: 20 },
      { category: "Lehengas", value: 15 },
      { category: "Dress Mat.", value: 15 },
      { category: "Others", value: 10 },
    ],
    lowStockItems: [
      { name: "Madurai Cotton Saree - White", sku: "MCS-001-WH", stock: 2, threshold: 8 },
      { name: "Silk Blend Lehenga - Red", sku: "SBL-015-RD", stock: 1, threshold: 5 },
      { name: "Embroidered Kurti - Green", sku: "EKT-022-GR", stock: 3, threshold: 10 },
    ],
    pendingShipments: [
      { id: "SHP-031", items: 50, status: "dispatched", eta: "Tomorrow" },
      { id: "SHP-032", items: 18, status: "in_transit", eta: "Today" },
      { id: "SHP-033", items: 25, status: "processing", eta: "4 days" },
      { id: "SHP-034", items: 12, status: "processing", eta: "5 days" },
    ],
    recentSales: [
      { id: "ORD-210", customer: "Deepa R", amount: 5999, items: 2, time: "15 mins ago" },
      { id: "ORD-209", customer: "Muthulakshmi S", amount: 2499, items: 1, time: "1 hour ago" },
      { id: "ORD-208", customer: "Kannan P", amount: 8750, items: 3, time: "3 hours ago" },
    ],
  },
};

export function getOutletProfileData(uuid: string): OutletProfileData {
  return outletProfileDataMap[uuid] ?? defaultProfile;
}
