
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

const fields = [
  { key: 'title', label: 'Title', type: 'text' as const, required: true, colSpan: 2 },
  { key: 'slug', label: 'Slug', type: 'text' as const, required: true, placeholder: 'auto-generated-slug', tip: 'URL-friendly identifier. Must be unique.' },
  { key: 'category', label: 'Category', type: 'select' as const, options: ['General', 'Account', 'Trading', 'Funds', 'KYC', 'Technical', 'Billing', 'Products'], required: true },
  { key: 'body', label: 'Content', type: 'html' as const, colSpan: 2 },
  { key: 'tags', label: 'Tags', type: 'text' as const, placeholder: 'Comma-separated tags', colSpan: 2, tip: 'Enter comma-separated tags' },
  { key: 'status', label: 'Status', type: 'select' as const, options: ['draft', 'published', 'archived'] },
  { key: 'is_featured', label: 'Featured', type: 'checkbox' as const },
];

const tableColumns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'view_count', label: 'Views' },
  { key: 'helpful_count', label: 'Helpful' },
  { key: 'status', label: 'Status' },
  { key: 'published_at', label: 'Published', format: 'date' as const },
];

export default function AdminKnowledgeBase() {
  return (
    <GenericCMSPage
      title="Knowledge Base"
      subtitle="Manage self-service help articles for customers"
      tableName="kb_articles"
      fields={fields}
      emptyForm={{ title: '', slug: '', category: 'General', body: '', tags: '', status: 'draft', is_featured: false }}
      tableColumns={tableColumns}
      hasStatus
      hasFeatured
      categoryField="category"
    />
  );
}
