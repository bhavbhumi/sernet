import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Sitemap from "@/pages/Sitemap";

export const Route = createFileRoute("/sitemap")({
  head: () =>
    pageHead({
      title: "Sitemap",
      description:
        "Complete directory of all pages on the SERNET Financial Services website.",
      path: "/sitemap",
    }),
  component: Sitemap,
});
