import { createFileRoute } from "@tanstack/react-router";
import AdminBulletin from "@/pages/admin/content/AdminBulletin";

export const Route = createFileRoute("/admin/marketing/content/bulletin")({
  component: AdminBulletin,
});
