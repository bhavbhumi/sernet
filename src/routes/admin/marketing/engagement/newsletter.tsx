import { createFileRoute } from "@tanstack/react-router";
import AdminNewsletter from "@/pages/admin/engagement/AdminNewsletter";

export const Route = createFileRoute("/admin/marketing/engagement/newsletter")({
  head: () => ({ meta: [{ title: 'Newsletter Subscribers | SERNET Admin' }, { name: 'description', content: 'Manage SERNET newsletter subscribers and preferences.' }, { property: 'og:title', content: 'Newsletter Subscribers | SERNET Admin' }, { property: 'og:description', content: 'Manage SERNET newsletter subscribers and preferences.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminNewsletter,
});
