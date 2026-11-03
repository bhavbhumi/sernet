import { createFileRoute } from "@tanstack/react-router";
import AdminCorporateEvents from "@/pages/admin/calendars/AdminCorporateEvents";

export const Route = createFileRoute("/admin/marketing/calendars/corporate")({
  component: AdminCorporateEvents,
});
