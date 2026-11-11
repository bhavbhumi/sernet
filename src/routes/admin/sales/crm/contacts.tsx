import { createFileRoute } from "@tanstack/react-router";
import AdminCRMContacts from "@/pages/admin/sales/AdminCRMContacts";

export const Route = createFileRoute("/admin/sales/crm/contacts")({
  head: () => ({meta:[{title:'Sales Contacts | SERNET'},{name:'description',content:'Manage sales contacts for SERNET staff.'},{property:'og:title',content:'Sales Contacts | SERNET'},{property:'og:description',content:'Manage sales contacts for SERNET staff.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component: AdminCRMContacts,
});
