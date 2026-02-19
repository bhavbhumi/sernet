
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminAnalysis() {
  return (
    <GenericCMSPage
      title="Market Analysis"
      subtitle="Manage in-depth technical, fundamental, and macro analysis posts"
      tableName="analyses"
      emptyForm={{ title: '', excerpt: '', body: '', author: 'Research Desk', category: '', icon_name: 'TrendingUp', status: 'draft' }}
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Analysis title', required: true, colSpan: 2 },
        { key: 'author', label: 'Author', type: 'text', placeholder: 'Research Desk' },
        { key: 'category', label: 'Category', type: 'select', required: true, options: ['Technical', 'Fundamental', 'Macro', 'Sectoral', 'Quantitative', 'Derivatives'] },
        { key: 'icon_name', label: 'Icon', type: 'select', options: ['TrendingUp', 'BarChart3', 'PieChart'] },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'] },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'Short summary...', colSpan: 2 },
        { key: 'body', label: 'Full Content (HTML)', type: 'html', placeholder: 'Full analysis body...', colSpan: 2 },
      ]}
      tableColumns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category', width: 'w-28' },
        { key: 'author', label: 'Author', width: 'w-32' },
        { key: 'status', label: 'Status', width: 'w-24' },
      ]}
    />
  );
}
