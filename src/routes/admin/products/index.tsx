// src/routes/admin/products/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import Products from "@/features/admin/products";

export const Route = createFileRoute("/admin/products/")({
  component: Products,
});
