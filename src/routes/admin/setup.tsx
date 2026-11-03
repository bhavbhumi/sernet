import { createFileRoute } from "@tanstack/react-router";
import AdminSetup from "@/pages/admin/AdminSetup";

export const Route = createFileRoute("/admin/setup")({
  component: AdminSetup,
});
