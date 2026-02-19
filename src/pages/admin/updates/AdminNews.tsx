
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminNews() {
  return (
    <GenericCMSPage
      title="News"
      subtitle="Manage market news, corporate actions, and economic news items"
      tableName="news_items"
      emptyForm={{ title: '', summary: '', source: '', category: 'Market News', link: '', is_rss: false, rss_feed_url: '', status: 'draft' }}
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'News headline', required: true, colSpan: 2 },
        { key: 'source', label: 'Source', type: 'text', placeholder: 'e.g. Reuters, Economic Times', required: true },
        { key: 'category', label: 'Category', type: 'select', required: true, options: ['Market News', 'Corporate Actions', 'Economy', 'Global Markets', 'Commodities'] },
        { key: 'link', label: 'External Link', type: 'url', placeholder: 'https://...', colSpan: 2 },
        { key: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Brief summary...', colSpan: 2 },
        { key: 'rss_feed_url', label: 'RSS Feed URL (if RSS sourced)', type: 'url', placeholder: 'https://feed...', colSpan: 2 },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'] },
      ]}
      tableColumns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category', width: 'w-32' },
        { key: 'source', label: 'Source', width: 'w-28' },
        { key: 'status', label: 'Status', width: 'w-24' },
      ]}
    />
  );
}
