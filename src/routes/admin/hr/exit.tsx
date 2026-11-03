import { createFileRoute } from "@tanstack/react-router";
import AdminEmployeeExit from "@/pages/admin/hr/AdminEmployeeExit";

export const Route = createFileRoute("/admin/hr/exit")({
  component: AdminEmployeeExit,
});
