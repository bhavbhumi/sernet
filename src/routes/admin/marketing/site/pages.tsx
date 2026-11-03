import { createFileRoute } from "@tanstack/react-router";
import AdminSitePages from "@/pages/admin/site/AdminSitePages";

export const Route = createFileRoute("/admin/marketing/site/pages")({
  component: AdminSitePages,
});
