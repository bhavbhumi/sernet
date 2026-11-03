import { createFileRoute } from "@tanstack/react-router";
import AdminLeaveEncashment from "@/pages/admin/hr/AdminLeaveEncashment";

export const Route = createFileRoute("/admin/hr/leave/encashment")({
  component: AdminLeaveEncashment,
});
