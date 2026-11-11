import { createFileRoute } from '@tanstack/react-router';
import AdminLeadList from '@/pages/admin/marketing/AdminLeadList';
export const Route = createFileRoute('/admin/marketing/lead-list')({
  head: () => ({ meta: [{title:'Marketing Leads | SERNET'},{name:'description',content:'SERNET enquiry qualification and Sales handoffs.'},{property:'og:title',content:'Marketing Leads | SERNET'},{property:'og:description',content:'SERNET enquiry qualification and Sales handoffs.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}] }),
  component: AdminLeadList,
});