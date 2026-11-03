import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import Calendars from "@/pages/Calendars";

export const Route = createFileRoute("/calendars")({
  head: () =>
    pageHead({
      title: "Market Calendars",
      description:
        "Market holidays, economic events and corporate action calendars for Indian stock markets.",
      path: "/calendars",
    }),
  component: Calendars,
});
