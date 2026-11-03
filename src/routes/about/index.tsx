import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import { companyHistory } from "@/lib/companyHistory";
import About from "@/pages/About";

export const Route = createFileRoute("/about/")({
  head: () =>
    pageHead({
      title: "About SERNET",
      description:
        `SERNET Financial Services Pvt Ltd — a family financial-services legacy ${companyHistory.familyLegacyLabel.toLowerCase()}, incorporated ${companyHistory.incorporationLabel}. Across 54 cities and 18 countries.`,
      path: "/about",
    }),
  component: About,
});
