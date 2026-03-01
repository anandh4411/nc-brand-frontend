// src/features/admin/outlets/profile/data/sales-mock-data.ts
import type { Order } from "@/types/dto/order.dto";

const createAddress = (name: string, phone: string, line1: string, city: string, pincode: string) => ({
  id: Math.floor(Math.random() * 1000),
  uuid: crypto.randomUUID(),
  customerId: Math.floor(Math.random() * 100),
  name,
  phone,
  addressLine1: line1,
  city,
  state: "Tamil Nadu",
  pincode,
  isDefault: true,
  createdAt: "2024-01-01T00:00:00Z",
});

const createItem = (
  id: number,
  orderId: number,
  name: string,
  color: string,
  size: string,
  sku: string,
  qty: number,
  unitPrice: number
) => ({
  id,
  orderId,
  productVariantId: id + 100,
  productSnapshot: {
    productGroupName: name,
    colorName: color,
    size,
    sku,
  },
  quantity: qty,
  unitPrice,
  totalPrice: qty * unitPrice,
});

const chennaiOrders: Order[] = [
  {
    id: 1001, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c01", orderNumber: "ORD-1001",
    customerId: 1, customerName: "Priya Sharma", customerEmail: "priya@example.com",
    billingAddress: createAddress("Priya Sharma", "9876543001", "12 MG Road", "Chennai", "600001"),
    shippingAddress: createAddress("Priya Sharma", "9876543001", "12 MG Road", "Chennai", "600001"),
    status: "delivered", items: [
      createItem(1, 1001, "Banarasi Silk Saree", "Royal Blue", "Free Size", "BSS-001-RB", 1, 4599),
      createItem(2, 1001, "Cotton Kurti", "Maroon", "M", "CCK-023-MR", 1, 1299),
    ],
    subtotal: 5898, tax: 1062, shippingFee: 0, total: 6960,
    paymentStatus: "paid", paymentMethod: "razorpay", notes: "Gift wrap requested",
    createdAt: "2025-01-28T10:30:00Z", updatedAt: "2025-01-30T14:00:00Z",
  },
  {
    id: 1002, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c02", orderNumber: "ORD-1002",
    customerId: 2, customerName: "Meera Patel", customerEmail: "meera@example.com",
    billingAddress: createAddress("Meera Patel", "9876543002", "45 Anna Nagar", "Chennai", "600040"),
    shippingAddress: createAddress("Meera Patel", "9876543002", "45 Anna Nagar", "Chennai", "600040"),
    status: "shipped", items: [
      createItem(3, 1002, "Kanchipuram Silk Saree", "Gold", "Free Size", "KSS-012-GD", 1, 8999),
    ],
    subtotal: 8999, tax: 1620, shippingFee: 0, total: 10619,
    paymentStatus: "paid", paymentMethod: "razorpay",
    createdAt: "2025-01-27T09:15:00Z", updatedAt: "2025-01-28T11:00:00Z",
  },
  {
    id: 1003, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c03", orderNumber: "ORD-1003",
    customerId: 3, customerName: "Anjali Reddy", customerEmail: "anjali@example.com",
    billingAddress: createAddress("Anjali Reddy", "9876543003", "78 T Nagar", "Chennai", "600017"),
    shippingAddress: createAddress("Anjali Reddy", "9876543003", "78 T Nagar", "Chennai", "600017"),
    status: "processing", items: [
      createItem(4, 1003, "Chiffon Printed Saree", "Pink", "Free Size", "CPS-045-PK", 2, 2199),
      createItem(5, 1003, "Embroidered Kurti", "Green", "L", "EKT-022-GR", 1, 1599),
    ],
    subtotal: 5997, tax: 1079, shippingFee: 99, total: 7175,
    paymentStatus: "paid", paymentMethod: "cod",
    createdAt: "2025-01-26T14:45:00Z", updatedAt: "2025-01-27T09:00:00Z",
  },
  {
    id: 1004, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c04", orderNumber: "ORD-1004",
    customerId: 4, customerName: "Kavitha Nair", customerEmail: "kavitha@example.com",
    billingAddress: createAddress("Kavitha Nair", "9876543004", "22 Adyar", "Chennai", "600020"),
    shippingAddress: createAddress("Kavitha Nair", "9876543004", "22 Adyar", "Chennai", "600020"),
    status: "delivered", items: [
      createItem(6, 1004, "Silk Blend Lehenga", "Red", "S", "SBL-015-RD", 1, 5499),
    ],
    subtotal: 5499, tax: 990, shippingFee: 0, total: 6489,
    paymentStatus: "paid", paymentMethod: "razorpay",
    createdAt: "2025-01-25T11:20:00Z", updatedAt: "2025-01-27T16:30:00Z",
  },
  {
    id: 1005, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c05", orderNumber: "ORD-1005",
    customerId: 5, customerName: "Lakshmi Devi", customerEmail: "lakshmi@example.com",
    billingAddress: createAddress("Lakshmi Devi", "9876543005", "99 Mylapore", "Chennai", "600004"),
    shippingAddress: createAddress("Lakshmi Devi", "9876543005", "99 Mylapore", "Chennai", "600004"),
    status: "cancelled", items: [
      createItem(7, 1005, "Printed Cotton Kurti", "Teal", "XL", "PCK-034-TL", 3, 999),
    ],
    subtotal: 2997, tax: 539, shippingFee: 99, total: 3635,
    paymentStatus: "refunded", paymentMethod: "razorpay", notes: "Customer requested cancellation",
    createdAt: "2025-01-24T16:00:00Z", updatedAt: "2025-01-25T10:00:00Z",
  },
  {
    id: 1006, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c06", orderNumber: "ORD-1006",
    customerId: 6, customerName: "Ranjitha K", customerEmail: "ranjitha@example.com",
    billingAddress: createAddress("Ranjitha K", "9876543006", "56 Velachery", "Chennai", "600042"),
    shippingAddress: createAddress("Ranjitha K", "9876543006", "56 Velachery", "Chennai", "600042"),
    status: "pending", items: [
      createItem(8, 1006, "Designer Lehenga Set", "Navy Blue", "M", "DLS-008-NB", 1, 12999),
      createItem(9, 1006, "Dupatta Silk", "Gold", "Free Size", "DSK-002-GD", 1, 1999),
    ],
    subtotal: 14998, tax: 2700, shippingFee: 0, total: 17698,
    paymentStatus: "pending", paymentMethod: "razorpay",
    createdAt: "2025-01-29T08:00:00Z", updatedAt: "2025-01-29T08:00:00Z",
  },
  {
    id: 1007, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c07", orderNumber: "ORD-1007",
    customerId: 7, customerName: "Suresh Kumar", customerEmail: "suresh@example.com",
    billingAddress: createAddress("Suresh Kumar", "9876543007", "34 Tambaram", "Chennai", "600045"),
    shippingAddress: createAddress("Suresh Kumar", "9876543007", "34 Tambaram", "Chennai", "600045"),
    status: "confirmed", items: [
      createItem(10, 1007, "Wedding Saree Collection", "Magenta", "Free Size", "WSC-005-MG", 1, 15999),
    ],
    subtotal: 15999, tax: 2880, shippingFee: 0, total: 18879,
    paymentStatus: "paid", paymentMethod: "razorpay",
    createdAt: "2025-01-28T15:30:00Z", updatedAt: "2025-01-28T16:00:00Z",
  },
  {
    id: 1008, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c08", orderNumber: "ORD-1008",
    customerId: 8, customerName: "Deepa R", customerEmail: "deepa@example.com",
    billingAddress: createAddress("Deepa R", "9876543008", "11 Porur", "Chennai", "600116"),
    shippingAddress: createAddress("Deepa R", "9876543008", "11 Porur", "Chennai", "600116"),
    status: "delivered", items: [
      createItem(11, 1008, "Casual Cotton Saree", "White", "Free Size", "CCS-019-WH", 2, 1499),
      createItem(12, 1008, "Palazzo Set", "Black", "L", "PLS-007-BK", 1, 1899),
    ],
    subtotal: 4897, tax: 881, shippingFee: 99, total: 5877,
    paymentStatus: "paid", paymentMethod: "cod",
    createdAt: "2025-01-23T12:00:00Z", updatedAt: "2025-01-26T10:00:00Z",
  },
  {
    id: 1009, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c09", orderNumber: "ORD-1009",
    customerId: 9, customerName: "Muthulakshmi S", customerEmail: "muthu@example.com",
    billingAddress: createAddress("Muthulakshmi S", "9876543009", "67 Chromepet", "Chennai", "600044"),
    shippingAddress: createAddress("Muthulakshmi S", "9876543009", "67 Chromepet", "Chennai", "600044"),
    status: "returned", items: [
      createItem(13, 1009, "Georgette Saree", "Peach", "Free Size", "GGS-031-PC", 1, 3499),
    ],
    subtotal: 3499, tax: 630, shippingFee: 0, total: 4129,
    paymentStatus: "refunded", paymentMethod: "razorpay", notes: "Colour mismatch reported",
    createdAt: "2025-01-20T09:30:00Z", updatedAt: "2025-01-24T11:00:00Z",
  },
  {
    id: 1010, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c10", orderNumber: "ORD-1010",
    customerId: 10, customerName: "Kannan P", customerEmail: "kannan@example.com",
    billingAddress: createAddress("Kannan P", "9876543010", "89 Guindy", "Chennai", "600032"),
    shippingAddress: createAddress("Kannan P", "9876543010", "89 Guindy", "Chennai", "600032"),
    status: "delivered", items: [
      createItem(14, 1010, "Silk Dhoti Set", "Cream", "Free Size", "SDS-003-CR", 2, 2999),
      createItem(15, 1010, "Cotton Shirt", "Blue", "L", "CSH-011-BL", 2, 999),
    ],
    subtotal: 7996, tax: 1439, shippingFee: 0, total: 9435,
    paymentStatus: "paid", paymentMethod: "cod",
    createdAt: "2025-01-22T14:15:00Z", updatedAt: "2025-01-25T09:00:00Z",
  },
  {
    id: 1011, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c11", orderNumber: "ORD-1011",
    customerId: 11, customerName: "Vimala G", customerEmail: "vimala@example.com",
    billingAddress: createAddress("Vimala G", "9876543011", "23 Nungambakkam", "Chennai", "600034"),
    shippingAddress: createAddress("Vimala G", "9876543011", "23 Nungambakkam", "Chennai", "600034"),
    status: "processing", items: [
      createItem(16, 1011, "Bridal Silk Saree", "Crimson", "Free Size", "BRS-002-CR", 1, 22999),
    ],
    subtotal: 22999, tax: 4140, shippingFee: 0, total: 27139,
    paymentStatus: "paid", paymentMethod: "razorpay",
    createdAt: "2025-01-29T07:45:00Z", updatedAt: "2025-01-29T08:30:00Z",
  },
  {
    id: 1012, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c12", orderNumber: "ORD-1012",
    customerId: 12, customerName: "Saranya M", customerEmail: "saranya@example.com",
    billingAddress: createAddress("Saranya M", "9876543012", "44 Kilpauk", "Chennai", "600010"),
    shippingAddress: createAddress("Saranya M", "9876543012", "44 Kilpauk", "Chennai", "600010"),
    status: "shipped", items: [
      createItem(17, 1012, "Pattu Pavadai", "Purple", "28", "PPV-006-PR", 1, 3999),
      createItem(18, 1012, "Half Saree Set", "Orange", "Free Size", "HSS-009-OR", 1, 4599),
    ],
    subtotal: 8598, tax: 1548, shippingFee: 0, total: 10146,
    paymentStatus: "paid", paymentMethod: "razorpay",
    createdAt: "2025-01-27T11:00:00Z", updatedAt: "2025-01-28T14:00:00Z",
  },
  {
    id: 1013, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c13", orderNumber: "ORD-1013",
    customerId: 13, customerName: "Bhuvana L", customerEmail: "bhuvana@example.com",
    billingAddress: createAddress("Bhuvana L", "9876543013", "15 Besant Nagar", "Chennai", "600090"),
    shippingAddress: createAddress("Bhuvana L", "9876543013", "15 Besant Nagar", "Chennai", "600090"),
    status: "pending", items: [
      createItem(19, 1013, "Organza Saree", "Lavender", "Free Size", "OGS-014-LV", 1, 6999),
    ],
    subtotal: 6999, tax: 1260, shippingFee: 0, total: 8259,
    paymentStatus: "pending", paymentMethod: "cod",
    createdAt: "2025-01-30T06:30:00Z", updatedAt: "2025-01-30T06:30:00Z",
  },
  {
    id: 1014, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c14", orderNumber: "ORD-1014",
    customerId: 14, customerName: "Divya T", customerEmail: "divya@example.com",
    billingAddress: createAddress("Divya T", "9876543014", "88 Egmore", "Chennai", "600008"),
    shippingAddress: createAddress("Divya T", "9876543014", "88 Egmore", "Chennai", "600008"),
    status: "delivered", items: [
      createItem(20, 1014, "Linen Saree", "Olive", "Free Size", "LNS-021-OL", 1, 2799),
      createItem(21, 1014, "Cotton Blouse", "Beige", "S", "CTB-004-BG", 2, 699),
    ],
    subtotal: 4197, tax: 755, shippingFee: 99, total: 5051,
    paymentStatus: "paid", paymentMethod: "razorpay",
    createdAt: "2025-01-21T13:00:00Z", updatedAt: "2025-01-24T15:30:00Z",
  },
  {
    id: 1015, uuid: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c15", orderNumber: "ORD-1015",
    customerId: 15, customerName: "Nithya V", customerEmail: "nithya@example.com",
    billingAddress: createAddress("Nithya V", "9876543015", "33 Perambur", "Chennai", "600011"),
    shippingAddress: createAddress("Nithya V", "9876543015", "33 Perambur", "Chennai", "600011"),
    status: "confirmed", items: [
      createItem(22, 1015, "Art Silk Saree", "Teal", "Free Size", "ASS-018-TL", 1, 3299),
    ],
    subtotal: 3299, tax: 594, shippingFee: 99, total: 3992,
    paymentStatus: "paid", paymentMethod: "cod",
    createdAt: "2025-01-29T17:00:00Z", updatedAt: "2025-01-29T17:30:00Z",
  },
];

const defaultOrders: Order[] = [
  {
    id: 2001, uuid: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d01", orderNumber: "ORD-2001",
    customerId: 20, customerName: "Aishwarya S", customerEmail: "aishwarya@example.com",
    billingAddress: createAddress("Aishwarya S", "9876543020", "10 Main Road", "Salem", "636004"),
    shippingAddress: createAddress("Aishwarya S", "9876543020", "10 Main Road", "Salem", "636004"),
    status: "delivered", items: [
      createItem(30, 2001, "Cotton Saree", "Yellow", "Free Size", "CTS-041-YL", 1, 1999),
    ],
    subtotal: 1999, tax: 360, shippingFee: 99, total: 2458,
    paymentStatus: "paid", paymentMethod: "cod",
    createdAt: "2025-01-25T10:00:00Z", updatedAt: "2025-01-28T12:00:00Z",
  },
  {
    id: 2002, uuid: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d02", orderNumber: "ORD-2002",
    customerId: 21, customerName: "Ramya N", customerEmail: "ramya@example.com",
    billingAddress: createAddress("Ramya N", "9876543021", "55 Bus Stand Road", "Salem", "636004"),
    shippingAddress: createAddress("Ramya N", "9876543021", "55 Bus Stand Road", "Salem", "636004"),
    status: "shipped", items: [
      createItem(31, 2002, "Printed Kurti Set", "Pink", "M", "PKS-018-PK", 2, 1299),
    ],
    subtotal: 2598, tax: 468, shippingFee: 0, total: 3066,
    paymentStatus: "paid", paymentMethod: "razorpay",
    createdAt: "2025-01-27T14:30:00Z", updatedAt: "2025-01-28T09:00:00Z",
  },
  {
    id: 2003, uuid: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d03", orderNumber: "ORD-2003",
    customerId: 22, customerName: "Geetha R", customerEmail: "geetha@example.com",
    billingAddress: createAddress("Geetha R", "9876543022", "12 Temple Street", "Salem", "636004"),
    shippingAddress: createAddress("Geetha R", "9876543022", "12 Temple Street", "Salem", "636004"),
    status: "pending", items: [
      createItem(32, 2003, "Silk Saree", "Maroon", "Free Size", "SLS-027-MR", 1, 5499),
      createItem(33, 2003, "Blouse Piece", "Gold", "Free Size", "BLP-003-GD", 1, 499),
    ],
    subtotal: 5998, tax: 1080, shippingFee: 0, total: 7078,
    paymentStatus: "pending", paymentMethod: "razorpay",
    createdAt: "2025-01-29T11:00:00Z", updatedAt: "2025-01-29T11:00:00Z",
  },
  {
    id: 2004, uuid: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d04", orderNumber: "ORD-2004",
    customerId: 23, customerName: "Selvi K", customerEmail: "selvi@example.com",
    billingAddress: createAddress("Selvi K", "9876543023", "78 Market Road", "Salem", "636004"),
    shippingAddress: createAddress("Selvi K", "9876543023", "78 Market Road", "Salem", "636004"),
    status: "cancelled", items: [
      createItem(34, 2004, "Fancy Dupatta", "Multi", "Free Size", "FDP-011-ML", 2, 799),
    ],
    subtotal: 1598, tax: 288, shippingFee: 99, total: 1985,
    paymentStatus: "refunded", paymentMethod: "razorpay",
    createdAt: "2025-01-22T08:00:00Z", updatedAt: "2025-01-23T10:00:00Z",
  },
  {
    id: 2005, uuid: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d05", orderNumber: "ORD-2005",
    customerId: 24, customerName: "Janani P", customerEmail: "janani@example.com",
    billingAddress: createAddress("Janani P", "9876543024", "90 College Road", "Salem", "636004"),
    shippingAddress: createAddress("Janani P", "9876543024", "90 College Road", "Salem", "636004"),
    status: "delivered", items: [
      createItem(35, 2005, "Handloom Cotton Saree", "Off-White", "Free Size", "HCS-008-OW", 1, 2499),
      createItem(36, 2005, "Embroidered Kurti", "Blue", "L", "EKT-022-BL", 1, 1599),
    ],
    subtotal: 4098, tax: 738, shippingFee: 0, total: 4836,
    paymentStatus: "paid", paymentMethod: "cod",
    createdAt: "2025-01-19T15:00:00Z", updatedAt: "2025-01-22T11:00:00Z",
  },
];

const outletSalesMap: Record<string, Order[]> = {
  "550e8400-e29b-41d4-a716-446655440001": chennaiOrders,
};

export function getOutletSales(uuid: string): Order[] {
  return outletSalesMap[uuid] ?? defaultOrders;
}
