import { createFileRoute } from "@tanstack/react-router";
import AdminHealth from "@/pages/admin/settings/AdminHealth";

export const Route = createFileRoute("/admin/settings/health")({
  component: AdminHealth,
});
