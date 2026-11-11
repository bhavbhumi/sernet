import { createFileRoute } from "@tanstack/react-router";
import AdminCampaigns from "@/pages/admin/marketing/AdminCampaigns";

export const Route = createFileRoute("/admin/marketing/campaigns/tracker")({
  head: () => ({meta:[{title:'Campaigns | SERNET'},{name:'description',content:'SERNET campaign planning and tracked links.'},{property:'og:title',content:'Campaigns | SERNET'},{property:'og:description',content:'SERNET campaign planning and tracked links.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component: AdminCampaigns,
});
