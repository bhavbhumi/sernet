import { createFileRoute } from "@tanstack/react-router";
import AdminMarketHolidays from "@/pages/admin/calendars/AdminMarketHolidays";

export const Route = createFileRoute("/admin/marketing/calendars/holidays")({
  head: () => ({ meta: [{ title: 'Holiday Events | SERNET Admin' }, { name: 'description', content: 'Manage SERNET market and settlement holidays.' }, { property: 'og:title', content: 'Holiday Events | SERNET Admin' }, { property: 'og:description', content: 'Manage SERNET market and settlement holidays.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminMarketHolidays,
});
