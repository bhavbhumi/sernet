import { createFileRoute } from "@tanstack/react-router";
import AdminSalaryComponents from "@/pages/admin/accounts/AdminSalaryComponents";

export const Route = createFileRoute("/admin/accounts/salary-components")({
  component: AdminSalaryComponents,
});
