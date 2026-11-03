import { createFileRoute } from "@tanstack/react-router";
import AdminNewsletter from "@/pages/admin/engagement/AdminNewsletter";

export const Route = createFileRoute("/admin/marketing/engagement/newsletter")({
  component: AdminNewsletter,
});
