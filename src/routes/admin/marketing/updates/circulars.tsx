import { createFileRoute } from "@tanstack/react-router";
import AdminFeeds from "@/pages/admin/content/AdminFeeds";

export const Route = createFileRoute("/admin/marketing/updates/circulars")({
  component: AdminFeeds,
});
