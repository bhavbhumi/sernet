import { createFileRoute } from "@tanstack/react-router";
import AdminTickets from "@/pages/admin/support/AdminTickets";

export const Route = createFileRoute("/admin/support/tickets/")({
  component: AdminTickets,
});
