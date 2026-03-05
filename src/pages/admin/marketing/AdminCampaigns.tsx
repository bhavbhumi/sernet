import { AdminGuard } from '@/components/admin/AdminGuard';
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminCampaigns() {
  return (
    <AdminGuard>
      <GenericCMSPage
        title="Campaign Tracker"
        subtitle="Plan and track marketing campaigns with UTM attribution"
        tableName="campaigns"
        tableColumns={[
          { key: 'name', label: 'Campaign Name' },
          { key: 'campaign_type', label: 'Type' },
          { key: 'status', label: 'Status' },
          { key: 'utm_source', label: 'UTM Source' },
          { key: 'utm_medium', label: 'UTM Medium' },
          { key: 'start_date', label: 'Start', format: 'date' },
          { key: 'end_date', label: 'End', format: 'date' },
          { key: 'budget', label: 'Budget (₹)' },
        ]}
        fields={[
          { key: 'name', label: 'Campaign Name', type: 'text', required: true },
          { key: 'campaign_type', label: 'Type', type: 'select', options: ['email', 'social', 'event', 'print', 'digital_ad', 'referral', 'other'] },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'utm_source', label: 'UTM Source', type: 'text', placeholder: 'e.g. google, linkedin, newsletter' },
          { key: 'utm_medium', label: 'UTM Medium', type: 'text', placeholder: 'e.g. cpc, email, social' },
          { key: 'utm_campaign', label: 'UTM Campaign', type: 'text', placeholder: 'e.g. spring-2026-sip' },
          { key: 'start_date', label: 'Start Date', type: 'date' },
          { key: 'end_date', label: 'End Date', type: 'date' },
          { key: 'budget', label: 'Budget (₹)', type: 'text' },
          { key: 'target_audience', label: 'Target Audience', type: 'text', placeholder: 'e.g. HNW Clients, NRI Investors' },
        ]}
        emptyForm={{
          name: '', campaign_type: 'email', description: '',
          utm_source: '', utm_medium: '', utm_campaign: '',
          start_date: '', end_date: '', budget: '', target_audience: '',
        }}
        hasStatus
        categoryField="campaign_type"
        orderBy={{ column: 'created_at', ascending: false }}
      />
    </AdminGuard>
  );
}
