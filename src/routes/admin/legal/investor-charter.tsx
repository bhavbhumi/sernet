import { createFileRoute } from "@tanstack/react-router";
import AdminInvestorCharter from "@/pages/admin/legal/AdminInvestorCharter";

export const Route = createFileRoute("/admin/legal/investor-charter")({
  component: AdminInvestorCharter,
});
