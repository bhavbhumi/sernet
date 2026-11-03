import { createFileRoute } from "@tanstack/react-router";
import AdminPayroll from "@/pages/admin/accounts/AdminPayroll";

export const Route = createFileRoute("/admin/accounts/payroll")({
  component: AdminPayroll,
});
