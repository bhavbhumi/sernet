import { createFileRoute } from "@tanstack/react-router";
import AdminMarketingLeads from "@/pages/admin/marketing/AdminMarketingLeads";

export const Route = createFileRoute("/admin/marketing/leads")({
  head: () => ({meta:[{title:'Marketing Dashboard | SERNET'},{name:'description',content:'SERNET lead generation and Marketing action dashboard.'},{property:'og:title',content:'Marketing Dashboard | SERNET'},{property:'og:description',content:'SERNET lead generation and Marketing action dashboard.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component: AdminMarketingLeads,
});
