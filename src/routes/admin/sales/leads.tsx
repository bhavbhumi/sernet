import { createFileRoute } from "@tanstack/react-router";
import AdminLeads from "@/pages/admin/sales/AdminUnifiedLeads";

export const Route = createFileRoute("/admin/sales/leads")({
  head: () => ({meta:[{title:'Shared Sales Leads | SERNET'},{name:'description',content:'SERNET shared lead qualification and Sales follow-ups.'},{property:'og:title',content:'Shared Sales Leads | SERNET'},{property:'og:description',content:'SERNET shared lead qualification and Sales follow-ups.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component: AdminLeads,
});
