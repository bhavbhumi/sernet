import { createFileRoute } from "@tanstack/react-router";
import AdminNewsletterComposer from "@/pages/admin/engagement/AdminNewsletterComposer";

export const Route = createFileRoute("/admin/marketing/engagement/composer")({
  head: () => ({ meta: [{ title: 'Newsletter Composer | SERNET Admin' }, { name: 'description', content: 'Prepare and approve SERNET newsletters for permitted subscribers.' }, { property: 'og:title', content: 'Newsletter Composer | SERNET Admin' }, { property: 'og:description', content: 'Prepare and approve SERNET newsletters for permitted subscribers.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: AdminNewsletterComposer,
});
