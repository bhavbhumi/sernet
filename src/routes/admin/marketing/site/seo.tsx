import { createFileRoute } from "@tanstack/react-router";
import AdminSEOAudit from "@/pages/admin/site/AdminSEOAudit";

export const Route = createFileRoute("/admin/marketing/site/seo")({
  component: AdminSEOAudit,
});
