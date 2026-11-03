import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Pricing from "@/pages/Pricing";

export const Route = createFileRoute("/pricing")({
  head: () =>
    pageHead({
      title: "Pricing",
      description:
        "Simple and transparent pricing — zero-fee regular mutual funds, and share trading on Choice FinX from Choice Equity Broking at 0.30% delivery and 0.03% intraday.",
      path: "/pricing",
    }),
  component: Pricing,
});
