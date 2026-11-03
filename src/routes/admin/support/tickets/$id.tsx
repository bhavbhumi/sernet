import { createFileRoute } from "@tanstack/react-router";
import AdminTicketDetail from "@/pages/admin/support/AdminTicketDetail";

export const Route = createFileRoute("/admin/support/tickets/$id")({
  component: AdminTicketDetail,
});
