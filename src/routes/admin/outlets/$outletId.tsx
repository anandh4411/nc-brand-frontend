import { createFileRoute } from "@tanstack/react-router";
import OutletProfile from "@/features/admin/outlets/profile";

export const Route = createFileRoute("/admin/outlets/$outletId")({
  component: OutletProfile,
});
