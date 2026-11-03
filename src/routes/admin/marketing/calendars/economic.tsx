import { createFileRoute } from "@tanstack/react-router";
import AdminEconomicEvents from "@/pages/admin/calendars/AdminEconomicEvents";

export const Route = createFileRoute("/admin/marketing/calendars/economic")({
  component: AdminEconomicEvents,
});
