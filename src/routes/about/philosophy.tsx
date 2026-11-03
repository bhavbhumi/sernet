import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Philosophy from "@/pages/Philosophy";

export const Route = createFileRoute("/about/philosophy")({
  head: () =>
    pageHead({
      title: "Our Philosophy",
      description:
        "The principles that guide SERNET — customer-first, transparency, simplicity and long-term thinking.",
      path: "/about/philosophy",
    }),
  component: Philosophy,
});
