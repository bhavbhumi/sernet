import { createFileRoute } from "@tanstack/react-router";
import AdminImportArticles from "@/pages/admin/content/AdminImportArticles";

export const Route = createFileRoute("/admin/marketing/content/import")({
  component: AdminImportArticles,
});
