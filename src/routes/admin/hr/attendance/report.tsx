import { createFileRoute } from "@tanstack/react-router";
import AdminAttendanceReport from "@/pages/admin/hr/AdminAttendanceReport";

export const Route = createFileRoute("/admin/hr/attendance/report")({
  component: AdminAttendanceReport,
});
