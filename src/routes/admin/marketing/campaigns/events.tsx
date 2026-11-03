import { createFileRoute } from "@tanstack/react-router";
import AdminEvents from "@/pages/admin/marketing/AdminEvents";

export const Route = createFileRoute("/admin/marketing/campaigns/events")({
  component: AdminEvents,
});
