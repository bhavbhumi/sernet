import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import type { FieldDef } from '@/components/admin/GenericCMSPage';

const fields: FieldDef[] = [
  { key: 'email', label: 'Email', type: 'text', required: true },
  { key: 'first_name', label: 'First Name', type: 'text', required: true },
  { key: 'last_name', label: 'Last Name', type: 'text' },
  { key: 'preferences', label: 'Preferences', type: 'multiselect', options: ['resources', 'articles', 'promotions'] },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'unsubscribed'], required: true },
  { key: 'consent_evidence', label: 'Subscription permission evidence (required to activate)', type: 'textarea' },
  { key: 'subscribed_at', label: 'Subscribed At', type: 'date' },
];

const emptyForm = {
  email: '',
  first_name: '',
  last_name: '',
  preferences: ['resources', 'articles', 'promotions'],
  status: 'active',
  consent_evidence: '',
  subscribed_at: '',
};

const tableColumns = [
  { key: 'email', label: 'Email', width: '25%' },
  { key: 'first_name', label: 'Name', width: '20%' },
  { key: 'preferences', label: 'Preferences', width: '20%' },
  { key: 'status', label: 'Status', width: '10%' },
  { key: 'subscribed_at', label: 'Subscribed', width: '15%', format: 'date' as const },
];

const AdminNewsletter = () => {
  return (
    <GenericCMSPage
      title="Newsletter Subscribers"
      subtitle="Manage newsletter sign-ups and preferences"
      tableName="newsletter_subscribers"
      fields={fields}
      emptyForm={emptyForm}
      tableColumns={tableColumns}
      hasStatus={false}
      orderBy={{ column: 'subscribed_at', ascending: false }}
      categoryField="status"
    />
  );
};

export default AdminNewsletter;
