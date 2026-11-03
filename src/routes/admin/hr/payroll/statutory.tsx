import { createFileRoute } from "@tanstack/react-router";
import AdminStatutoryDues from "@/pages/admin/hr/AdminStatutoryDues";

export const Route = createFileRoute("/admin/hr/payroll/statutory")({
  component: AdminStatutoryDues,
});
