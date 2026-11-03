import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import EconomicCalendar from "@/pages/EconomicCalendar";

export const Route = createFileRoute("/economic-calendar")({
  head: () =>
    pageHead({
      title: "Economic Calendar",
      description:
        "Upcoming economic events and data releases that move Indian and global markets.",
      path: "/economic-calendar",
    }),
  component: EconomicCalendar,
});
