import { createFileRoute } from "@tanstack/react-router";
import AdminDocumentVault from "@/pages/admin/hr/AdminDocumentVault";

export const Route = createFileRoute("/admin/hr/documents")({
  component: AdminDocumentVault,
});
