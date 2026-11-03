import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import { companyHistory } from "@/lib/companyHistory";
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Wealth Management & Financial Services",
      description:
        `SERNET — a family financial-services legacy ${companyHistory.familyLegacyLabel.toLowerCase()}. Trading, mutual funds and insurance across 54 cities and 18 countries.`,
      path: "/",
    }),
  component: Index,
});
