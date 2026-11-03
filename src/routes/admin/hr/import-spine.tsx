import { createFileRoute } from "@tanstack/react-router";
import AdminImportSpine from "@/pages/admin/hr/AdminImportSpine";

export const Route = createFileRoute("/admin/hr/import-spine")({
  component: AdminImportSpine,
});
