import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import SIPCalculator from "@/pages/calculators/SIPCalculator";

export const Route = createFileRoute("/calculators/sip")({
  head: () =>
    pageHead({
      title: "SIP Calculator",
      description:
        "Estimate the future value of your monthly SIP investments.",
      path: "/calculators/sip",
    }),
  component: SIPCalculator,
});
