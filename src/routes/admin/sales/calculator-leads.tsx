import { createFileRoute } from "@tanstack/react-router";
import AdminLeads from "@/pages/admin/sales/AdminUnifiedLeads";

export const Route = createFileRoute("/admin/sales/calculator-leads")({
  head: () => ({meta:[{title:'Calculator Enquiries | SERNET'},{name:'description',content:'SERNET calculator enquiries within the shared Sales workflow.'},{property:'og:title',content:'Calculator Enquiries | SERNET'},{property:'og:description',content:'SERNET calculator enquiries within the shared Sales workflow.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component: AdminLeads,
});
