import { createFileRoute } from "@tanstack/react-router";
import AdminImportEconomicEvents from "@/pages/admin/calendars/AdminImportEconomicEvents";

export const Route = createFileRoute("/admin/marketing/calendars/import-economic")({
  component: AdminImportEconomicEvents,
});
