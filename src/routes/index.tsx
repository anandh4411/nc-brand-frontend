import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "@/features/coming-soon";

export const Route = createFileRoute("/")({
  component: ComingSoon,
});
