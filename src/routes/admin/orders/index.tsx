// src/routes/admin/orders/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import Orders from "@/features/admin/orders";

export const Route = createFileRoute("/admin/orders/")({
  component: Orders,
});
