import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Calculators from "@/pages/Calculators";

export const Route = createFileRoute("/calculators/")({
  head: () =>
    pageHead({
      title: "Financial Calculators",
      description:
        "Free calculators for brokerage, margin, SIP, lumpsum, goal planning and insurance needs from SERNET.",
      path: "/calculators",
    }),
  component: Calculators,
});
