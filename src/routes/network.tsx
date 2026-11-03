import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import { companyHistory } from "@/lib/companyHistory";
import Network from "@/pages/Network";

export const Route = createFileRoute("/network")({
  head: () =>
    pageHead({
      title: "Our Network",
      description:
        `SERNET’s growing network across 54 cities and 18 countries — a family financial-services legacy ${companyHistory.familyLegacyLabel.toLowerCase()}.`,
      path: "/network",
    }),
  component: Network,
});
