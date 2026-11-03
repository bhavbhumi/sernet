import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import MarketHolidays from "@/pages/MarketHolidays";

export const Route = createFileRoute("/market-holidays")({
  head: () =>
    pageHead({
      title: "Market Holidays",
      description:
        "NSE, BSE and MCX trading holidays and market timings for the year.",
      path: "/market-holidays",
    }),
  component: MarketHolidays,
});
