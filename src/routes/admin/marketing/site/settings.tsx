import { createFileRoute } from "@tanstack/react-router";
import AdminSiteSettings from "@/pages/admin/site/AdminSiteSettings";

export const Route = createFileRoute("/admin/marketing/site/settings")({
  component: AdminSiteSettings,
});
