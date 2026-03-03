import { AdminGuard } from '@/components/admin/AdminGuard';
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminCRMContacts() {
  return (
    <AdminGuard>
      <GenericCMSPage
        title="CRM Contacts"
        subtitle="Manage contacts and accounts"
        tableName="crm_contacts"
        tableColumns={[
          { key: 'full_name', label: 'Name' },
          { key: 'contact_type', label: 'Type' },
          { key: 'phone', label: 'Phone' },
          { key: 'email', label: 'Email' },
          { key: 'city', label: 'City' },
          { key: 'source', label: 'Source' },
          { key: 'created_at', label: 'Created', format: 'date' },
        ]}
        fields={[
          { key: 'full_name', label: 'Full Name', type: 'text', required: true },
          { key: 'contact_type', label: 'Type', type: 'select', options: ['individual', 'company'] },
          { key: 'company_name', label: 'Company Name', type: 'text' },
          { key: 'phone', label: 'Phone', type: 'text' },
          { key: 'alternate_phone', label: 'Alternate Phone', type: 'text' },
          { key: 'email', label: 'Email', type: 'text' },
          { key: 'pan', label: 'PAN', type: 'text' },
          { key: 'city', label: 'City', type: 'text' },
          { key: 'state', label: 'State', type: 'text' },
          { key: 'source', label: 'Source', type: 'select', options: ['direct', 'referral', 'website', 'walk-in', 'campaign'] },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ]}
        emptyForm={{
          full_name: '', contact_type: 'individual', company_name: '', phone: '', alternate_phone: '',
          email: '', pan: '', city: '', state: '', source: 'direct', notes: '',
        }}
        hasStatus={false}
        orderBy={{ column: 'created_at', ascending: false }}
      />
    </AdminGuard>
  );
}
