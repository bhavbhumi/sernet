import { createFileRoute } from "@tanstack/react-router";
import AdminLeads from "@/pages/admin/sales/AdminUnifiedLeads";

export const Route = createFileRoute("/admin/sales/crm/leads")({
  head: () => ({meta:[{title:'Sales Work Queue | SERNET'},{name:'description',content:'SERNET accepted enquiries and guarded contact conversion.'},{property:'og:title',content:'Sales Work Queue | SERNET'},{property:'og:description',content:'SERNET accepted enquiries and guarded contact conversion.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component: AdminLeads,
});
