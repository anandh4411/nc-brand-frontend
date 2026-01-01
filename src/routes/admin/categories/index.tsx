// src/routes/admin/categories/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import Categories from "@/features/admin/categories";

export const Route = createFileRoute("/admin/categories/")({
  component: Categories,
});
