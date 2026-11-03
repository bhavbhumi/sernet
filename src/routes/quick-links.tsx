import { createFileRoute } from "@tanstack/react-router";
import QuickLinks from "@/pages/QuickLinks";

export const Route = createFileRoute("/quick-links")({
  component: QuickLinks,
});
