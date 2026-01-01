// src/routes/admin/shipments/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import Shipments from "@/features/admin/shipments";

export const Route = createFileRoute("/admin/shipments/")({
  component: Shipments,
});
