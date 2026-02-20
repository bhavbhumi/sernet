import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import type { FieldDef } from '@/components/admin/GenericCMSPage';

const fields: FieldDef[] = [
  { key: 'event_date', label: 'Event Date', type: 'date', required: true, tip: 'Date of the corporate action or meeting.' },
  { key: 'company_name', label: 'Company Name', type: 'text', required: true, placeholder: 'e.g. Reliance Industries', tip: 'Full company name as listed on the exchange.' },
  { key: 'ticker', label: 'Ticker / Symbol', type: 'text', placeholder: 'RELIANCE', tip: 'NSE/BSE ticker symbol (optional).' },
  { key: 'event_type', label: 'Event Type', type: 'select', options: ['board', 'dividend', 'agm', 'bonus', 'split', 'buyback', 'rights', 'other'], required: true, tip: 'Type of corporate action.' },
  { key: 'event_details', label: 'Event Details', type: 'textarea', placeholder: 'e.g. Q3 FY24 results declaration, Interim dividend of ₹9 per share...', tip: 'Description of the event or corporate action.', colSpan: 2 },
  { key: 'ex_date', label: 'Ex-Date', type: 'date', tip: 'Ex-dividend or ex-rights date (if applicable).' },
  { key: 'record_date', label: 'Record Date', type: 'date', tip: 'Record date for entitlement (if applicable).' },
  { key: 'amount', label: 'Amount / Ratio', type: 'text', placeholder: 'e.g. ₹9 per share, 1:1', tip: 'Dividend amount or bonus/split ratio.' },
  { key: 'status', label: 'Status', type: 'select', options: ['published', 'draft'], required: true },
];

const emptyForm = {
  event_date: '',
  company_name: '',
  ticker: '',
  event_type: 'board',
  event_details: '',
  ex_date: '',
  record_date: '',
  amount: '',
  status: 'published',
};

const tableColumns = [
  { key: 'event_date', label: 'Date' },
  { key: 'company_name', label: 'Company' },
  { key: 'ticker', label: 'Ticker' },
  { key: 'event_type', label: 'Event Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
];

const AdminCorporateEvents = () => (
  <GenericCMSPage
    title="Corporate Events"
    subtitle="Manage board meetings, dividends, AGMs, bonus issues, splits, and buybacks."
    tableName="corporate_events"
    fields={fields}
    emptyForm={emptyForm}
    tableColumns={tableColumns}
    hasStatus
    categoryField="event_type"
  />
);

export default AdminCorporateEvents;
