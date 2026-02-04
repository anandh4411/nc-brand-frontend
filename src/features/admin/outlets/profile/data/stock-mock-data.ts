// src/features/admin/outlets/profile/data/stock-mock-data.ts
import type { Shipment } from "@/types/dto/inventory.dto";

const createShipmentItem = (
  id: number,
  shipmentId: number,
  name: string,
  color: string,
  size: string,
  sku: string,
  qty: number,
  received?: number
) => ({
  id,
  shipmentId,
  productVariantId: id + 200,
  productVariantSku: sku,
  productName: name,
  colorName: color,
  size,
  quantity: qty,
  receivedQuantity: received,
});

const chennaiShipments: Shipment[] = [
  {
    id: 101, uuid: "s1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b01", outletId: 1,
    outletName: "Chennai Main Store", status: "delivered",
    items: [
      createShipmentItem(1, 101, "Banarasi Silk Saree", "Royal Blue", "Free Size", "BSS-001-RB", 20, 20),
      createShipmentItem(2, 101, "Cotton Kurti", "Maroon", "M", "CCK-023-MR", 30, 28),
      createShipmentItem(3, 101, "Chiffon Printed Saree", "Pink", "Free Size", "CPS-045-PK", 15, 15),
    ],
    shippedAt: "2025-01-10T08:00:00Z", deliveredAt: "2025-01-12T14:00:00Z",
    notes: "Seasonal stock replenishment", createdBy: 1, createdByName: "Admin",
    createdAt: "2025-01-09T10:00:00Z", updatedAt: "2025-01-12T14:00:00Z",
  },
  {
    id: 102, uuid: "s1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b02", outletId: 1,
    outletName: "Chennai Main Store", status: "shipped",
    items: [
      createShipmentItem(4, 102, "Kanchipuram Silk Saree", "Gold", "Free Size", "KSS-012-GD", 10),
      createShipmentItem(5, 102, "Designer Lehenga Set", "Navy Blue", "M", "DLS-008-NB", 5),
    ],
    shippedAt: "2025-01-28T06:00:00Z", deliveredAt: null,
    createdBy: 1, createdByName: "Admin",
    createdAt: "2025-01-27T15:00:00Z", updatedAt: "2025-01-28T06:00:00Z",
  },
  {
    id: 103, uuid: "s1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b03", outletId: 1,
    outletName: "Chennai Main Store", status: "pending",
    items: [
      createShipmentItem(6, 103, "Wedding Saree Collection", "Magenta", "Free Size", "WSC-005-MG", 8),
      createShipmentItem(7, 103, "Bridal Silk Saree", "Crimson", "Free Size", "BRS-002-CR", 5),
      createShipmentItem(8, 103, "Dupatta Silk", "Gold", "Free Size", "DSK-002-GD", 25),
    ],
    shippedAt: null, deliveredAt: null,
    notes: "Wedding season stock", createdBy: 2, createdByName: "Warehouse Manager",
    createdAt: "2025-01-29T09:00:00Z", updatedAt: "2025-01-29T09:00:00Z",
  },
  {
    id: 104, uuid: "s1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b04", outletId: 1,
    outletName: "Chennai Main Store", status: "delivered",
    items: [
      createShipmentItem(9, 104, "Casual Cotton Saree", "White", "Free Size", "CCS-019-WH", 40, 40),
      createShipmentItem(10, 104, "Palazzo Set", "Black", "L", "PLS-007-BK", 20, 18),
    ],
    shippedAt: "2025-01-05T07:00:00Z", deliveredAt: "2025-01-07T16:00:00Z",
    createdBy: 1, createdByName: "Admin",
    createdAt: "2025-01-04T11:00:00Z", updatedAt: "2025-01-07T16:00:00Z",
  },
  {
    id: 105, uuid: "s1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b05", outletId: 1,
    outletName: "Chennai Main Store", status: "cancelled",
    items: [
      createShipmentItem(11, 105, "Georgette Saree", "Peach", "Free Size", "GGS-031-PC", 12),
    ],
    shippedAt: null, deliveredAt: null,
    notes: "Cancelled due to stock shortage at warehouse", createdBy: 2, createdByName: "Warehouse Manager",
    createdAt: "2025-01-15T10:00:00Z", updatedAt: "2025-01-16T09:00:00Z",
  },
  {
    id: 106, uuid: "s1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b06", outletId: 1,
    outletName: "Chennai Main Store", status: "shipped",
    items: [
      createShipmentItem(12, 106, "Linen Saree", "Olive", "Free Size", "LNS-021-OL", 15),
      createShipmentItem(13, 106, "Cotton Blouse", "Beige", "S", "CTB-004-BG", 30),
      createShipmentItem(14, 106, "Art Silk Saree", "Teal", "Free Size", "ASS-018-TL", 10),
    ],
    shippedAt: "2025-01-29T11:00:00Z", deliveredAt: null,
    createdBy: 1, createdByName: "Admin",
    createdAt: "2025-01-28T14:00:00Z", updatedAt: "2025-01-29T11:00:00Z",
  },
  {
    id: 107, uuid: "s1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b07", outletId: 1,
    outletName: "Chennai Main Store", status: "delivered",
    items: [
      createShipmentItem(15, 107, "Silk Dhoti Set", "Cream", "Free Size", "SDS-003-CR", 25, 25),
    ],
    shippedAt: "2024-12-20T08:00:00Z", deliveredAt: "2024-12-22T15:00:00Z",
    createdBy: 1, createdByName: "Admin",
    createdAt: "2024-12-19T10:00:00Z", updatedAt: "2024-12-22T15:00:00Z",
  },
  {
    id: 108, uuid: "s1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b08", outletId: 1,
    outletName: "Chennai Main Store", status: "pending",
    items: [
      createShipmentItem(16, 108, "Organza Saree", "Lavender", "Free Size", "OGS-014-LV", 10),
      createShipmentItem(17, 108, "Pattu Pavadai", "Purple", "28", "PPV-006-PR", 8),
    ],
    shippedAt: null, deliveredAt: null,
    notes: "Priority order for festival season", createdBy: 2, createdByName: "Warehouse Manager",
    createdAt: "2025-01-30T07:00:00Z", updatedAt: "2025-01-30T07:00:00Z",
  },
  {
    id: 109, uuid: "s1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b09", outletId: 1,
    outletName: "Chennai Main Store", status: "delivered",
    items: [
      createShipmentItem(18, 109, "Printed Cotton Kurti", "Teal", "XL", "PCK-034-TL", 35, 35),
      createShipmentItem(19, 109, "Embroidered Kurti", "Green", "L", "EKT-022-GR", 20, 20),
    ],
    shippedAt: "2025-01-18T09:00:00Z", deliveredAt: "2025-01-20T13:00:00Z",
    createdBy: 1, createdByName: "Admin",
    createdAt: "2025-01-17T11:00:00Z", updatedAt: "2025-01-20T13:00:00Z",
  },
  {
    id: 110, uuid: "s1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b10", outletId: 1,
    outletName: "Chennai Main Store", status: "shipped",
    items: [
      createShipmentItem(20, 110, "Half Saree Set", "Orange", "Free Size", "HSS-009-OR", 12),
    ],
    shippedAt: "2025-01-30T05:00:00Z", deliveredAt: null,
    createdBy: 2, createdByName: "Warehouse Manager",
    createdAt: "2025-01-29T16:00:00Z", updatedAt: "2025-01-30T05:00:00Z",
  },
];

const defaultShipments: Shipment[] = [
  {
    id: 201, uuid: "s2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b01", outletId: 99,
    outletName: "Outlet Store", status: "delivered",
    items: [
      createShipmentItem(40, 201, "Cotton Saree", "Yellow", "Free Size", "CTS-041-YL", 20, 20),
      createShipmentItem(41, 201, "Fancy Dupatta", "Multi", "Free Size", "FDP-011-ML", 30, 30),
    ],
    shippedAt: "2025-01-08T07:00:00Z", deliveredAt: "2025-01-10T14:00:00Z",
    createdBy: 1, createdByName: "Admin",
    createdAt: "2025-01-07T10:00:00Z", updatedAt: "2025-01-10T14:00:00Z",
  },
  {
    id: 202, uuid: "s2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b02", outletId: 99,
    outletName: "Outlet Store", status: "shipped",
    items: [
      createShipmentItem(42, 202, "Silk Saree", "Maroon", "Free Size", "SLS-027-MR", 10),
    ],
    shippedAt: "2025-01-28T09:00:00Z", deliveredAt: null,
    createdBy: 1, createdByName: "Admin",
    createdAt: "2025-01-27T14:00:00Z", updatedAt: "2025-01-28T09:00:00Z",
  },
  {
    id: 203, uuid: "s2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b03", outletId: 99,
    outletName: "Outlet Store", status: "pending",
    items: [
      createShipmentItem(43, 203, "Handloom Cotton Saree", "Off-White", "Free Size", "HCS-008-OW", 15),
      createShipmentItem(44, 203, "Printed Kurti Set", "Pink", "M", "PKS-018-PK", 20),
    ],
    shippedAt: null, deliveredAt: null,
    notes: "Regular restocking order", createdBy: 2, createdByName: "Warehouse Manager",
    createdAt: "2025-01-29T10:00:00Z", updatedAt: "2025-01-29T10:00:00Z",
  },
  {
    id: 204, uuid: "s2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b04", outletId: 99,
    outletName: "Outlet Store", status: "cancelled",
    items: [
      createShipmentItem(45, 204, "Embroidered Kurti", "Blue", "L", "EKT-022-BL", 10),
    ],
    shippedAt: null, deliveredAt: null,
    notes: "Duplicate order cancelled", createdBy: 1, createdByName: "Admin",
    createdAt: "2025-01-20T08:00:00Z", updatedAt: "2025-01-21T09:00:00Z",
  },
  {
    id: 205, uuid: "s2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b05", outletId: 99,
    outletName: "Outlet Store", status: "delivered",
    items: [
      createShipmentItem(46, 205, "Casual Cotton Saree", "White", "Free Size", "CCS-019-WH", 25, 24),
    ],
    shippedAt: "2025-01-14T06:00:00Z", deliveredAt: "2025-01-16T12:00:00Z",
    createdBy: 2, createdByName: "Warehouse Manager",
    createdAt: "2025-01-13T11:00:00Z", updatedAt: "2025-01-16T12:00:00Z",
  },
];

const outletShipmentsMap: Record<string, Shipment[]> = {
  "550e8400-e29b-41d4-a716-446655440001": chennaiShipments,
};

export function getOutletShipments(uuid: string): Shipment[] {
  return outletShipmentsMap[uuid] ?? defaultShipments;
}
