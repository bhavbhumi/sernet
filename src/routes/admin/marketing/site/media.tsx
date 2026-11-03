import { createFileRoute } from "@tanstack/react-router";
import AdminMediaLibrary from "@/pages/admin/site/AdminMediaLibrary";

export const Route = createFileRoute("/admin/marketing/site/media")({
  component: AdminMediaLibrary,
});
