import { createFileRoute } from "@tanstack/react-router";
import RefundPolicyPage from "@/features/legal/refund-policy";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicyPage,
});
