
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminAnalysis() {
  return (
    <GenericCMSPage
      title="Market Analysis"
      subtitle="Manage in-depth technical, fundamental, and macro analysis posts"
      tableName="analyses"
      emptyForm={{ title: '', excerpt: '', body: '', author: 'Research Desk', category: '', icon_name: 'TrendingUp', status: 'draft', item_date: '' }}
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Analysis title', required: true, colSpan: 2, tip: 'The headline for this analysis post. Keep it clear and descriptive — it appears as the card title on the Z-Connect page.' },
        { key: 'author', label: 'Author', type: 'text', placeholder: 'Research Desk', tip: 'Name of the analyst or team who authored this piece (e.g. "Research Desk", "Quant Team").' },
        { key: 'category', label: 'Category', type: 'select', required: true, options: ['Weekly Update', 'Technical', 'Fundamental', 'Macro', 'Sectoral', 'Quantitative', 'Derivatives'], tip: 'Classification for this analysis. Used for filtering on the public-facing insights page.' },
        { key: 'icon_name', label: 'Icon', type: 'select', options: ['TrendingUp', 'BarChart3', 'PieChart'], tip: 'The icon displayed alongside this analysis card. Choose one that best represents the analysis type.' },
        { key: 'item_date', label: 'Article Date', type: 'date', placeholder: 'Date the analysis was written/researched', tip: 'The actual date this analysis was written or researched. This date is shown on the public card, separate from when it was published in the CMS.' },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'], tip: 'Draft is invisible to the public. Set to Published to make it live on Z-Connect.' },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'Short summary (2–3 sentences)...', colSpan: 2, tip: 'A brief teaser shown on the card. 2–3 sentences max. Readers see this before clicking through.' },
        { key: 'body', label: 'Full Content', type: 'html', placeholder: 'Full analysis body — use # ## ### for headings, **bold**, > blockquotes, - list items...', colSpan: 2, tip: 'Write the full analysis here. Use # for H1, ## for H2, ### for H3 headings. These auto-generate the Topic Index on the detail page.' },
      ]}
      tableColumns={[
        { key: 'title', label: 'Title' },
        { key: 'item_date', label: 'Date', width: 'w-28' },
        { key: 'category', label: 'Category', width: 'w-28' },
        { key: 'author', label: 'Author', width: 'w-32' },
        { key: 'status', label: 'Status', width: 'w-24' },
      ]}
    />
  );
}
