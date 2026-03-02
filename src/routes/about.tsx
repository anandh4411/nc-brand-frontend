import { createFileRoute } from "@tanstack/react-router";
import AboutPage from "@/features/legal/about";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});
