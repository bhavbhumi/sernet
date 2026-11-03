import { createFileRoute } from "@tanstack/react-router";
import AdminMonitor from "@/pages/admin/settings/AdminMonitor";

export const Route = createFileRoute("/admin/settings/monitor")({
  component: AdminMonitor,
});
