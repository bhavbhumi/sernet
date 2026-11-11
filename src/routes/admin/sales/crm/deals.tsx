import { createFileRoute } from "@tanstack/react-router";
import AdminCRMDeals from "@/pages/admin/sales/AdminCRMDeals";

export const Route = createFileRoute("/admin/sales/crm/deals")({
  head: () => ({meta:[{title:'Sales Opportunities | SERNET'},{name:'description',content:'Manage sales opportunities for SERNET staff.'},{property:'og:title',content:'Sales Opportunities | SERNET'},{property:'og:description',content:'Manage sales opportunities for SERNET staff.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component: AdminCRMDeals,
});
