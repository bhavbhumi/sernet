import { createFileRoute } from "@tanstack/react-router";
import AdminUsers from "@/pages/admin/settings/AdminUsers";

export const Route = createFileRoute("/admin/settings/permissions")({
  component: AdminUsers,
});
