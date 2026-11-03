import { createFileRoute } from "@tanstack/react-router";
import EconomicCalendar from "@/pages/EconomicCalendar";

export const Route = createFileRoute("/economic-calendar")({
  component: EconomicCalendar,
});
