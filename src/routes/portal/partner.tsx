import { createFileRoute } from "@tanstack/react-router";
import PartnerDashboard from "@/pages/portal/PartnerDashboard";

export const Route = createFileRoute("/portal/partner")({
  component: PartnerDashboard,
});
