import { createFileRoute } from "@tanstack/react-router";
import AdminWorkflows from "@/pages/admin/settings/AdminWorkflows";

export const Route = createFileRoute("/admin/settings/workflows")({
  component: AdminWorkflows,
});
