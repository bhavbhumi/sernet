import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import CreditClaim from "@/pages/CreditClaim";

export const Route = createFileRoute("/credit-claim")({
  head: () =>
    pageHead({
      title: "Credit and Claim Rights",
      description:
        "Information about your rights regarding credits, claims and investor protection at SERNET.",
      path: "/credit-claim",
    }),
  component: CreditClaim,
});
