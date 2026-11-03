import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Support from "@/pages/Support";

export const Route = createFileRoute("/support/")({
  head: () =>
    pageHead({
      title: "Support Portal — SERNET Financial Services",
      description:
        "Search our knowledge base, raise tickets, and get expert help for Choice FinX, Tick Funds, and Tushil products.",
      path: "/support",
    }),
  component: Support,
});
