// src/routes/admin/inventory/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import Inventory from "@/features/admin/inventory";

export const Route = createFileRoute("/admin/inventory/")({
  component: Inventory,
});
