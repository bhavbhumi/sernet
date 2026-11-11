import { createFileRoute } from '@tanstack/react-router';
import AdminContentDistribution from '@/pages/admin/marketing/AdminContentDistribution';
export const Route = createFileRoute('/admin/marketing/campaigns/distribution')({
  head: () => ({meta:[{title:'Content Distribution | SERNET'},{name:'description',content:'SERNET campaign content preparation and posting records.'},{property:'og:title',content:'Content Distribution | SERNET'},{property:'og:description',content:'SERNET campaign content preparation and posting records.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]}),
  component: AdminContentDistribution,
});