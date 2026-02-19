
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminReports() {
  return (
    <GenericCMSPage
      title="Research Reports"
      subtitle="Manage downloadable PDF reports — monthly, quarterly, annual, and special"
      tableName="reports"
      emptyForm={{ title: '', description: '', report_type: 'Monthly', pages: 0, file_url: '', status: 'draft' }}
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Report title', required: true, colSpan: 2 },
        { key: 'report_type', label: 'Type', type: 'select', required: true, options: ['Monthly', 'Quarterly', 'Annual', 'Special'] },
        { key: 'pages', label: 'Pages', type: 'number', placeholder: '0' },
        { key: 'file_url', label: 'PDF File URL', type: 'url', placeholder: 'https://...', colSpan: 2 },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Report description...', colSpan: 2 },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'] },
      ]}
      tableColumns={[
        { key: 'title', label: 'Title' },
        { key: 'report_type', label: 'Type', width: 'w-24' },
        { key: 'pages', label: 'Pages', width: 'w-20' },
        { key: 'status', label: 'Status', width: 'w-24' },
      ]}
    />
  );
}
