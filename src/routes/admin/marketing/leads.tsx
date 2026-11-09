import { createFileRoute } from "@tanstack/react-router";
import AdminMarketingLeads from "@/pages/admin/marketing/AdminMarketingLeads";

export const Route = createFileRoute("/admin/marketing/leads")({
  component: AdminMarketingLeads,
});
