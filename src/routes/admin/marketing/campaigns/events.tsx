import { createFileRoute } from "@tanstack/react-router";
import AdminEvents from "@/pages/admin/marketing/AdminEvents";

export const Route = createFileRoute("/admin/marketing/campaigns/events")({
  head: () => ({meta:[{title:'Marketing Events | SERNET'},{name:'description',content:'SERNET events, registrations and attendance.'},{property:'og:title',content:'Marketing Events | SERNET'},{property:'og:description',content:'SERNET events, registrations and attendance.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component: AdminEvents,
});
