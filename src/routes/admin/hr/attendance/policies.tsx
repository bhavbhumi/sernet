import { createFileRoute } from "@tanstack/react-router";
import AdminAttendancePolicies from "@/pages/admin/hr/AdminAttendancePolicies";

export const Route = createFileRoute("/admin/hr/attendance/policies")({
  component: AdminAttendancePolicies,
});
