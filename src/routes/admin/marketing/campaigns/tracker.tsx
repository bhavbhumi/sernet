import { createFileRoute } from "@tanstack/react-router";
import AdminCampaigns from "@/pages/admin/marketing/AdminCampaigns";

export const Route = createFileRoute("/admin/marketing/campaigns/tracker")({
  component: AdminCampaigns,
});
