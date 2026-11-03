import { createFileRoute } from "@tanstack/react-router";
import AdminSalaryRegister from "@/pages/admin/hr/AdminSalaryRegister";

export const Route = createFileRoute("/admin/hr/payroll/register")({
  component: AdminSalaryRegister,
});
