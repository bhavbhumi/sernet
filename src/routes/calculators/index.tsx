import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Calculators from "@/pages/Calculators";

export const Route = createFileRoute("/calculators/")({
  head: () => {
    const head = pageHead({
      title: "Financial Calculators",
      description:
        "SERNET calculators for funds: lumpsum, SIP, STP, SWP and annual step-up/down plans, plus bonds, goals, brokerage and insurance needs.",
      path: "/calculators",
    });
    return { ...head, meta: [...head.meta, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
  },
  component: Calculators,
});
