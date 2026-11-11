import { createFileRoute } from "@tanstack/react-router";
import AdminLeadAttribution from "@/pages/admin/marketing/AdminLeadAttribution";

export const Route = createFileRoute("/admin/marketing/campaigns/attribution")({
  head: () => ({ meta: [{ title: 'Campaign Attribution | SERNET Admin' }, { name: 'description', content: 'SERNET lead sources and saved campaign attribution.' }, { property: 'og:title', content: 'Campaign Attribution | SERNET Admin' }, { property: 'og:description', content: 'SERNET lead sources and saved campaign attribution.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminLeadAttribution,
});
