import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Insights from "@/pages/Insights";

export const Route = createFileRoute("/insights/")({
  head: () =>
    pageHead({
      title: "Insights",
      description:
        "Articles and market updates on macro & markets, investment, insurance, trading, credit and personal finance from SERNET Financial Services.",
      path: "/insights",
    }),
  component: Insights,
});
