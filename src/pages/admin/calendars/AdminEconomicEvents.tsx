import { AdminLayout } from '@/components/admin/AdminLayout';
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import type { FieldDef } from '@/components/admin/GenericCMSPage';

const fields: FieldDef[] = [
  { key: 'event_date', label: 'Event Date', type: 'date', required: true, tip: 'Scheduled date for this economic release.' },
  { key: 'event_time', label: 'Event Time (IST)', type: 'text', placeholder: '17:30', tip: 'Time in 24-hour IST format, e.g. 17:30.' },
  { key: 'event_name', label: 'Event Name', type: 'text', required: true, placeholder: 'e.g. RBI Monetary Policy Decision', tip: 'Official name of the economic event.' },
  { key: 'country', label: 'Country', type: 'select', options: ['India', 'USA', 'Europe', 'China', 'Japan', 'UK', 'Global'], required: true },
  { key: 'impact', label: 'Impact Level', type: 'select', options: ['high', 'medium', 'low'], required: true, tip: 'Expected market impact of this event.' },
  { key: 'category', label: 'Category', type: 'select', options: ['Interest Rates', 'Inflation Data', 'GDP & Growth', 'Trade Data', 'Employment', 'Manufacturing', 'General'], tip: 'Type of economic data.' },
  { key: 'previous_value', label: 'Previous Value', type: 'text', placeholder: '6.50%', tip: 'Last known reading of this indicator.' },
  { key: 'forecast_value', label: 'Forecast', type: 'text', placeholder: '6.50%', tip: 'Analyst consensus forecast.' },
  { key: 'actual_value', label: 'Actual Value', type: 'text', placeholder: 'Fill after release', tip: 'Actual result after the event (fill post-release).' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of this event...', tip: 'Optional context about the event.' },
  { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft'], required: true },
];

const emptyForm = {
  event_date: '',
  event_time: '',
  event_name: '',
  country: 'India',
  impact: 'medium',
  category: 'General',
  previous_value: '',
  forecast_value: '',
  actual_value: '',
  description: '',
  status: 'published',
};

const tableColumns = [
  { key: 'event_date', label: 'Date' },
  { key: 'event_time', label: 'Time' },
  { key: 'event_name', label: 'Event' },
  { key: 'country', label: 'Country' },
  { key: 'impact', label: 'Impact' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
];

const AdminEconomicEvents = () => (
  <AdminLayout title="Economic Events" subtitle="Manage economic calendar events, data releases, and policy meetings.">
    <GenericCMSPage
      title="Economic Events"
      subtitle="Manage economic calendar events, data releases, and policy meetings."
      tableName="economic_events"
      fields={fields}
      emptyForm={emptyForm}
      tableColumns={tableColumns}
      hasStatus
      categoryField="impact"
    />
  </AdminLayout>
);

export default AdminEconomicEvents;
