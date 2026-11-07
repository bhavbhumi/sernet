import { createFileRoute } from "@tanstack/react-router";
import AdminEconomicEvents from "@/pages/admin/calendars/AdminEconomicEvents";

export const Route = createFileRoute("/admin/marketing/calendars/economic")({
  head: () => ({ meta: [{ title: 'Economic Events | SERNET Admin' }, { name: 'description', content: 'Manage SERNET economic releases and calendar values.' }, { property: 'og:title', content: 'Economic Events | SERNET Admin' }, { property: 'og:description', content: 'Manage SERNET economic releases and calendar values.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminEconomicEvents,
});
