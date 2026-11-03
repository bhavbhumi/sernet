import { createFileRoute } from "@tanstack/react-router";
import AdminOrgChart from "@/pages/admin/hr/AdminOrgChart";

export const Route = createFileRoute("/admin/hr/org-chart")({
  component: AdminOrgChart,
});
