import { createFileRoute } from "@tanstack/react-router";
import AdminRSSSettings from "@/pages/admin/settings/AdminRSSSettings";

export const Route = createFileRoute("/admin/settings/rss")({
  component: AdminRSSSettings,
});
