import { createFileRoute } from "@tanstack/react-router";
import AdminLeaveManagement from "@/pages/admin/hr/AdminLeaveManagement";

export const Route = createFileRoute("/admin/hr/leave/")({
  component: AdminLeaveManagement,
});
