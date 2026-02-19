
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminBulletin() {
  return (
    <GenericCMSPage
      title="Bulletin Board"
      subtitle="Manage important notices, platform updates, and announcements"
      tableName="bulletins"
      emptyForm={{ title: '', description: '', priority: 'info', status: 'draft', expires_at: '' }}
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Bulletin title', required: true, colSpan: 2 },
        { key: 'priority', label: 'Priority', type: 'select', required: true, options: ['info', 'important', 'warning', 'success'] },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'] },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Full bulletin content...', colSpan: 2 },
        { key: 'expires_at', label: 'Expires At (optional)', type: 'text', placeholder: 'YYYY-MM-DD', colSpan: 2 },
      ]}
      tableColumns={[
        { key: 'title', label: 'Title' },
        { key: 'priority', label: 'Priority', width: 'w-28' },
        { key: 'status', label: 'Status', width: 'w-24' },
      ]}
    />
  );
}
