import { createFileRoute } from "@tanstack/react-router";
import AdminSupportDocuments from "@/pages/admin/support/AdminSupportDocuments";

export const Route = createFileRoute("/admin/support/documents")({
  component: AdminSupportDocuments,
});
