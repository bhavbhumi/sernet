import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/routeHead";
import ScheduleCall from "@/pages/ScheduleCall";

export const Route = createFileRoute("/schedule-call")({
  head: () =>
    pageHead({
      title: "Schedule a Call",
      description:
        "Book a free 30-minute consultation with SERNET financial advisors — investment, trading, insurance.",
      path: "/schedule-call",
    }),
  component: ScheduleCall,
});
