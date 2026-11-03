import { createFileRoute } from "@tanstack/react-router";
import AdminLeads from "@/pages/admin/sales/AdminUnifiedLeads";

export const Route = createFileRoute("/admin/sales/leads")({
  component: AdminLeads,
});
