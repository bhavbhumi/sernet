import { createFileRoute } from "@tanstack/react-router";
import AdminAuditLog from "@/pages/admin/settings/AdminAuditLog";

export const Route = createFileRoute("/admin/settings/audit-log")({
  component: AdminAuditLog,
});
