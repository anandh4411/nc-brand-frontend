import { createFileRoute } from "@tanstack/react-router";
import ContactPage from "@/features/legal/contact";

export const Route = createFileRoute("/shop/contact")({
  component: ContactPage,
});
