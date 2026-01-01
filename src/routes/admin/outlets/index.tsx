// src/routes/admin/outlets/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import Outlets from "@/features/admin/outlets";

export const Route = createFileRoute("/admin/outlets/")({
  component: Outlets,
});
