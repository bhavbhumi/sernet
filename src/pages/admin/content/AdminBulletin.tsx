
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminBulletin() {
  return (
    <GenericCMSPage
      title="Bulletin Board"
      subtitle="Manage important notices, platform updates, and announcements"
      tableName="bulletins"
      emptyForm={{ title: '', description: '', priority: 'info', status: 'draft', expires_at: '' }}
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Bulletin title', required: true, colSpan: 2, tip: 'Short, clear headline for the bulletin (e.g. "System maintenance on 20 Feb"). This is the first thing readers see.' },
        { key: 'priority', label: 'Priority', type: 'select', required: true, options: ['info', 'important', 'warning', 'success'], tip: 'Sets the colour and urgency indicator on the bulletin card. Use "warning" for urgent notices, "info" for general updates.' },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'], tip: 'Draft is invisible to the public. Publish to make it live. Archive to hide it without deleting.' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Full bulletin content...', colSpan: 2, tip: 'The body of the bulletin message. Be concise and action-oriented — tell users what happened and what (if anything) they need to do.' },
        { key: 'expires_at', label: 'Expiry Date (optional)', type: 'text', placeholder: 'YYYY-MM-DD', colSpan: 2, tip: 'Optional. If set, this bulletin will be automatically hidden from public view after this date. Leave blank to show indefinitely.' },
      ]}
      tableColumns={[
        { key: 'title', label: 'Title' },
        { key: 'priority', label: 'Priority', width: 'w-28' },
        { key: 'status', label: 'Status', width: 'w-24' },
      ]}
    />
  );
}
