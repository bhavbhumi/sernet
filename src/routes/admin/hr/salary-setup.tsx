import { createFileRoute } from "@tanstack/react-router";
import AdminSalarySetup from "@/pages/admin/hr/AdminSalarySetup";

export const Route = createFileRoute("/admin/hr/salary-setup")({
  component: AdminSalarySetup,
});
