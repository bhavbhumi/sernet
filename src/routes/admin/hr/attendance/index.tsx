import { createFileRoute } from "@tanstack/react-router";
import AdminAttendance from "@/pages/admin/hr/AdminAttendance";

export const Route = createFileRoute("/admin/hr/attendance/")({
  component: AdminAttendance,
});
