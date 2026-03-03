import { createFileRoute } from "@tanstack/react-router";
import Coupons from "@/features/admin/coupons";

export const Route = createFileRoute("/admin/coupons/")({
  component: Coupons,
});
