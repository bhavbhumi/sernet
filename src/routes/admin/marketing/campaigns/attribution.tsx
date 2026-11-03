import { createFileRoute } from "@tanstack/react-router";
import AdminLeadAttribution from "@/pages/admin/marketing/AdminLeadAttribution";

export const Route = createFileRoute("/admin/marketing/campaigns/attribution")({
  component: AdminLeadAttribution,
});
