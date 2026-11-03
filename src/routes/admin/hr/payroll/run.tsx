import { createFileRoute } from "@tanstack/react-router";
import AdminPayrollRun from "@/pages/admin/hr/AdminPayrollRun";

export const Route = createFileRoute("/admin/hr/payroll/run")({
  component: AdminPayrollRun,
});
