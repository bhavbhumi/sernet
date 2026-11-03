import { createFileRoute } from "@tanstack/react-router";
import AdminEmployees from "@/pages/admin/hr/AdminEmployees";

export const Route = createFileRoute("/admin/hr/employees")({
  component: AdminEmployees,
});
