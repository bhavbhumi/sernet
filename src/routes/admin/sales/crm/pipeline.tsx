import { createFileRoute } from "@tanstack/react-router";
import AdminCRMDeals from "@/pages/admin/sales/AdminCRMDeals";

export const Route = createFileRoute("/admin/sales/crm/pipeline")({
  component: AdminCRMDeals,
});
