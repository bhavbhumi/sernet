
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

export default function AdminReports() {
  return (
    <GenericCMSPage
      title="Research Reports"
      subtitle="Manage downloadable PDF reports — monthly, quarterly, annual, and special"
      tableName="reports"
      emptyForm={{ title: '', description: '', report_type: 'Monthly', pages: 0, file_url: '', status: 'draft' }}
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Report title', required: true, colSpan: 2, tip: 'The display name for this report (e.g. "Monthly Market Outlook – Jan 2026"). Shown as the card heading.' },
        { key: 'report_type', label: 'Report Type', type: 'select', required: true, options: ['Monthly', 'Quarterly', 'Annual', 'Special'], tip: 'Categorises the report by its publication frequency or nature. Used for filtering.' },
        { key: 'pages', label: 'Page Count', type: 'number', placeholder: '0', tip: 'Total number of pages in the PDF. Displayed as metadata on the report card.' },
        { key: 'file_url', label: 'PDF File URL', type: 'url', placeholder: 'https://...', colSpan: 2, tip: 'Paste the publicly accessible download URL for the PDF (from file storage or an external host). Users click "Download" to access it.' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'What does this report cover?', colSpan: 2, tip: 'A short description of the report contents. Shown as the card summary to help users decide whether to download.' },
        { key: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'], tip: 'Draft keeps the report hidden. Published makes it visible on the Reports tab. Archived removes it from public view.' },
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
