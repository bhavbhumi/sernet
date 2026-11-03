import { createFileRoute } from "@tanstack/react-router";
import PortalDashboard from "@/pages/portal/PortalDashboard";

export const Route = createFileRoute("/portal/")({
  component: PortalDashboard,
});
