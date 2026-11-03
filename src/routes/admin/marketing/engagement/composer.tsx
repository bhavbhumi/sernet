import { createFileRoute } from "@tanstack/react-router";
import AdminNewsletterComposer from "@/pages/admin/engagement/AdminNewsletterComposer";

export const Route = createFileRoute("/admin/marketing/engagement/composer")({
  component: AdminNewsletterComposer,
});
