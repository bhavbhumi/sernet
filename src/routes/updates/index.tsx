import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import UpdatesPage from "@/pages/Updates";

export const Route = createFileRoute("/updates/")({
  head: () =>
    pageHead({
      title: "Updates",
      description:
        "Latest market news, regulatory circulars and exchange notices curated by SERNET Financial Services.",
      path: "/updates",
    }),
  component: UpdatesPage,
});
