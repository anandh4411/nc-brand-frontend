import { createFileRoute } from "@tanstack/react-router";
import Offers from "@/features/admin/offers";

export const Route = createFileRoute("/admin/offers/")({
  component: Offers,
});
