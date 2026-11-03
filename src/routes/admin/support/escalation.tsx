import { createFileRoute } from "@tanstack/react-router";
import AdminEscalationMatrix from "@/pages/admin/support/AdminEscalationMatrix";

export const Route = createFileRoute("/admin/support/escalation")({
  component: AdminEscalationMatrix,
});
