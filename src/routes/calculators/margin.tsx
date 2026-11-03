import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import MarginCalculator from "@/pages/calculators/MarginCalculator";

export const Route = createFileRoute("/calculators/margin")({
  head: () =>
    pageHead({
      title: "Margin Calculator",
      description:
        "Estimate margin requirements for trades on Choice FinX.",
      path: "/calculators/margin",
    }),
  component: MarginCalculator,
});
