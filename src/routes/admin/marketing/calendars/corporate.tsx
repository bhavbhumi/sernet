import { createFileRoute } from "@tanstack/react-router";
import AdminCorporateEvents from "@/pages/admin/calendars/AdminCorporateEvents";

export const Route = createFileRoute("/admin/marketing/calendars/corporate")({
  head: () => ({ meta: [{ title: 'Corporate Events | SERNET Admin' }, { name: 'description', content: 'Manage SERNET corporate actions and events.' }, { property: 'og:title', content: 'Corporate Events | SERNET Admin' }, { property: 'og:description', content: 'Manage SERNET corporate actions and events.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminCorporateEvents,
});
