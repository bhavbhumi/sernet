import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import QuickLinks from "@/pages/QuickLinks";

export const Route = createFileRoute("/quick-links")({
  head: () =>
    pageHead({
      title: "Quick Links",
      description:
        "Important links to exchanges, regulatory bodies, depositories and investor resources.",
      path: "/quick-links",
    }),
  component: QuickLinks,
});
