
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminCirculars() {
  return (
    <GenericCMSPage
      title="Circulars"
      subtitle="Manage SEBI circulars, exchange notices, and regulatory policy updates"
      tableName="circulars"
      emptyForm={{ title: '', summary: '', source: '', category: 'SEBI Circulars', link: '', is_rss: false, rss_feed_url: '', status: 'draft' }}
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Circular headline', required: true, colSpan: 2 },
        { key: 'source', label: 'Source', type: 'text', placeholder: 'e.g. SEBI, NSE, BSE, CDSL', required: true },
        { key: 'category', label: 'Category', type: 'select', required: true, options: ['SEBI Circulars', 'Exchange Notices', 'Policy Updates', 'Depository'] },
        { key: 'link', label: 'External Link', type: 'url', placeholder: 'https://...', colSpan: 2 },
        { key: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Brief summary...', colSpan: 2 },
        { key: 'rss_feed_url', label: 'RSS Feed URL (if RSS sourced)', type: 'url', placeholder: 'https://feed...', colSpan: 2 },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'] },
      ]}
      tableColumns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category', width: 'w-36' },
        { key: 'source', label: 'Source', width: 'w-24' },
        { key: 'status', label: 'Status', width: 'w-24' },
      ]}
    />
  );
}
