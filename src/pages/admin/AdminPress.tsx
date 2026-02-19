
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminPress() {
  return (
    <GenericCMSPage
      title="Press & Media"
      subtitle="Manage press mentions, media coverage, and publications"
      tableName="press_items"
      emptyForm={{ title: '', source: '', medium: 'Web', link: '', is_featured: false, status: 'draft', published_at: '' }}
      fields={[
        { key: 'title', label: 'Headline', type: 'text', placeholder: 'Press mention headline', required: true, colSpan: 2 },
        { key: 'source', label: 'Publication / Source', type: 'text', placeholder: 'e.g. Economic Times', required: true },
        { key: 'medium', label: 'Medium', type: 'select', required: true, options: ['Web', 'Print', 'TV', 'Radio', 'Podcast'] },
        { key: 'link', label: 'Article URL', type: 'url', placeholder: 'https://...', colSpan: 2 },
        { key: 'published_at', label: 'Article Date', type: 'date', placeholder: 'Date the article was originally published', tip: 'Enter the date the press article was actually published. This drives the year timeline on the Press page.' },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'] },
        { key: 'is_featured', label: 'Featured', type: 'checkbox', placeholder: 'Show in featured carousel on Press page', colSpan: 2 },
      ]}
      tableColumns={[
        { key: 'title', label: 'Headline' },
        { key: 'source', label: 'Source', width: 'w-36' },
        { key: 'medium', label: 'Medium', width: 'w-24' },
        { key: 'is_featured', label: 'Featured', width: 'w-24' },
        { key: 'status', label: 'Status', width: 'w-24' },
      ]}
    />
  );
}
