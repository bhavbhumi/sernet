import { createFileRoute } from "@tanstack/react-router";
import AdminTicketFeedback from "@/pages/admin/engagement/AdminTicketFeedback";

export const Route = createFileRoute("/admin/marketing/engagement/ticket-feedback")({
  component: AdminTicketFeedback,
});
