import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Index from "@/pages/Index";
import { homeJsonLd } from "@/lib/homeJsonLd";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({
      title: "SERNET | Mutual Funds, Insurance & Trading Since 1986",
      exactTitle: true,
      description:
        "AMFI-registered mutual fund and APMI PMS distributor (ARN-35275). Invest via Tick Funds, insure via Tushil, trade via Choice FinX. A family practice since 1986.",
      path: "/",
    }),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(homeJsonLd) }],
  }),
  component: Index,
});
