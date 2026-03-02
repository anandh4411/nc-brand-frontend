import { createFileRoute } from "@tanstack/react-router";
import ShippingPolicyPage from "@/features/legal/shipping-policy";

export const Route = createFileRoute("/shipping-policy")({
  component: ShippingPolicyPage,
});
