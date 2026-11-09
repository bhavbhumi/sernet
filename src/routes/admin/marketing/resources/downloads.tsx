import { createFileRoute } from "@tanstack/react-router";
import AdminDownloads from "@/pages/admin/website/AdminDownloads";

export const Route = createFileRoute("/admin/marketing/resources/downloads")({
  component: AdminDownloads,
});
