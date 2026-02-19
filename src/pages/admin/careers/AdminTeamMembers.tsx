
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminTeamMembers() {
  return (
    <GenericCMSPage
      title="Team Members"
      subtitle="Manage team member profiles shown on the Careers page"
      tableName="team_members"
      emptyForm={{ name: '', position: '', department: '', photo_url: '', bio: '', sort_order: 0 }}
      fields={[
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Full name', required: true },
        { key: 'position', label: 'Position', type: 'text', placeholder: 'e.g. Founder & Promoter', required: true },
        { key: 'department', label: 'Department', type: 'text', placeholder: 'e.g. Leadership, Technology' },
        { key: 'sort_order', label: 'Display Order', type: 'number', placeholder: '0' },
        { key: 'photo_url', label: 'Photo URL', type: 'url', placeholder: 'https://...', colSpan: 2 },
        { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Short biography...', colSpan: 2 },
      ]}
      tableColumns={[
        { key: 'name', label: 'Name' },
        { key: 'position', label: 'Position' },
        { key: 'department', label: 'Department', width: 'w-32' },
        { key: 'sort_order', label: 'Order', width: 'w-16' },
      ]}
      hasStatus={false}
    />
  );
}
