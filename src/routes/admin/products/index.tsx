// src/routes/admin/products/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import Products from "@/features/admin/products";

type ProductsSearch = {
  openAdd?: boolean;
};

export const Route = createFileRoute("/admin/products/")({
  component: Products,
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    openAdd: search.openAdd === true || search.openAdd === "true" || undefined,
  }),
});
