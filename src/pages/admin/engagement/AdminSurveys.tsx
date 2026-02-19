
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminSurveys() {
  return (
    <GenericCMSPage
      title="Surveys"
      subtitle="Create and manage user surveys — view responses from the database"
      tableName="surveys"
      emptyForm={{ title: '', description: '', category: 'General', status: 'active', estimated_time: '5 mins', deadline_at: '' }}
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Survey title', required: true, colSpan: 2 },
        { key: 'category', label: 'Category', type: 'select', required: true, options: ['Platform', 'Support', 'Products', 'Education', 'General'] },
        { key: 'status', label: 'Status', type: 'select', options: ['active', 'closed', 'upcoming'] },
        { key: 'estimated_time', label: 'Estimated Time', type: 'text', placeholder: '5 mins' },
        { key: 'deadline_at', label: 'Deadline', type: 'text', placeholder: 'YYYY-MM-DD' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'What this survey is about...', colSpan: 2 },
      ]}
      tableColumns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category', width: 'w-28' },
        { key: 'estimated_time', label: 'Time', width: 'w-24' },
        { key: 'status', label: 'Status', width: 'w-24' },
      ]}
      hasStatus={false}
    />
  );
}
