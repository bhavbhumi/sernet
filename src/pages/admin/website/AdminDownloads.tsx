import { AdminGuard } from '@/components/admin/AdminGuard';
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';
import { DOWNLOAD_SECTIONS, downloadsTabs } from '@/content/downloads';

export default function AdminDownloads() {
  return (
    <AdminGuard>
      <GenericCMSPage
        title="Downloads"
        subtitle="Forms, documents and app links shown on the public Downloads page. Empty sections stay hidden."
        tableName="download_items"
        tableColumns={[
          { key: 'title', label: 'Title' },
          { key: 'tab', label: 'Tab' },
          { key: 'section', label: 'Section' },
          { key: 'note', label: 'Note' },
          { key: 'sort_order', label: 'Order' },
        ]}
        fields={[
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'tab', label: 'Tab', type: 'select', options: [...downloadsTabs], required: true },
          { key: 'section', label: 'Section', type: 'select', options: [...DOWNLOAD_SECTIONS], required: true },
          { key: 'note', label: 'Short note', type: 'text', placeholder: 'e.g. PDF, Google Play, Download from AMFI' },
          { key: 'href', label: 'Link or uploaded file URL', type: 'url', required: true, placeholder: 'https://… (upload PDFs in Media Library and paste the link)' },
          { key: 'sort_order', label: 'Order within section', type: 'number' },
        ]}
        emptyForm={{ title: '', tab: 'invest', section: 'Account Opening', note: '', href: '', sort_order: 0, status: 'published' }}
        hasStatus
        categoryField="tab"
        extraFilterField="section"
        extraFilterLabel="All sections"
        orderBy={{ column: 'sort_order', ascending: true }}
      />
    </AdminGuard>
  );
}
