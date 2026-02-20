import { AdminLayout } from '@/components/admin/AdminLayout';
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import type { FieldDef } from '@/components/admin/GenericCMSPage';

const fields: FieldDef[] = [
  { key: 'holiday_date', label: 'Holiday Date', type: 'date', required: true, tip: 'The date of the market holiday.' },
  { key: 'holiday_name', label: 'Holiday Name', type: 'text', required: true, placeholder: 'e.g. Republic Day', tip: 'Official name of the holiday.' },
  { key: 'holiday_type', label: 'Holiday Type', type: 'multiselect', options: ['Market', 'Settlement'], required: true, tip: 'Select all types that apply. Market = trading closed. Settlement = clearing/settlement closed but trading may occur.' },
  { key: 'day_of_week', label: 'Day of Week', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], tip: 'Day will auto-derive but you can override.' },
  { key: 'markets', label: 'Markets Closed', type: 'text', placeholder: 'NSE, BSE, MCX', tip: 'Comma-separated list of affected exchanges.', required: true },
  { key: 'year', label: 'Year', type: 'number', required: true, tip: 'Calendar year this holiday belongs to.' },
  { key: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Optional notes (e.g. Muhurat trading session)', tip: 'Any special notes about the trading session.' },
  { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft'], required: true },
];

const emptyForm = {
  holiday_date: '',
  holiday_name: '',
  holiday_type: ['Market'] as string[],
  day_of_week: '',
  markets: 'NSE, BSE',
  year: new Date().getFullYear(),
  notes: '',
  status: 'published',
};

const tableColumns = [
  { key: 'holiday_name', label: 'Holiday' },
  { key: 'holiday_date', label: 'Date' },
  { key: 'holiday_type', label: 'Type' },
  { key: 'markets', label: 'Markets' },
  { key: 'year', label: 'Year' },
  { key: 'status', label: 'Status' },
];

const AdminMarketHolidays = () => (
  <AdminLayout title="Holiday Events" subtitle="Manage NSE, BSE, and MCX trading holidays by year.">
    <GenericCMSPage
      title="Holiday Events"
      subtitle="Manage NSE, BSE, and MCX trading holidays by year."
      tableName="market_holidays"
      fields={fields}
      emptyForm={emptyForm}
      tableColumns={tableColumns}
      hasStatus
      categoryField="year"
    />
  </AdminLayout>
);

export default AdminMarketHolidays;
