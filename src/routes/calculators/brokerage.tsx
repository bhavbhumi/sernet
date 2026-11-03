import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import BrokerageCalculator from "@/pages/calculators/BrokerageCalculator";

export const Route = createFileRoute("/calculators/brokerage")({
  head: () =>
    pageHead({
      title: "Brokerage Calculator",
      description:
        "Estimate brokerage and charges for trades on Choice FinX.",
      path: "/calculators/brokerage",
    }),
  component: BrokerageCalculator,
});
