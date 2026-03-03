
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

const fields = [
  { key: 'title', label: 'Title', type: 'text' as const, required: true, colSpan: 2, tip: 'Descriptive name for the template' },
  { key: 'shortcode', label: 'Shortcode', type: 'text' as const, required: true, placeholder: 'e.g. greeting', tip: 'Unique shortcode to quickly reference this response. Use lowercase with hyphens.' },
  { key: 'category', label: 'Category', type: 'select' as const, options: ['General', 'Greeting', 'Follow-up', 'Resolution', 'Escalation', 'Billing', 'Technical'] },
  { key: 'is_active', label: 'Active', type: 'checkbox' as const },
  { key: 'body', label: 'Response Body', type: 'html' as const, colSpan: 2 },
];

const tableColumns = [
  { key: 'title', label: 'Title' },
  { key: 'shortcode', label: 'Shortcode' },
  { key: 'category', label: 'Category' },
  { key: 'usage_count', label: 'Used' },
  { key: 'is_active', label: 'Active' },
];

export default function AdminCannedResponses() {
  return (
    <GenericCMSPage
      title="Canned Responses"
      subtitle="Pre-written reply templates for quick support responses"
      tableName="canned_responses"
      fields={fields}
      emptyForm={{ title: '', shortcode: '', category: 'General', body: '', is_active: true }}
      tableColumns={tableColumns}
      hasStatus={false}
    />
  );
}
