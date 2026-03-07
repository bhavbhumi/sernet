
import { GenericCMSPage } from '@/components/admin/GenericCMSPage';

const fields = [
  // ── System Classification ──
  { key: 'issue_code', label: 'Issue Code', type: 'text' as const, placeholder: 'CFX-TRD-001', tip: 'Product-Category-Number format. Links to issue dictionary.' },
  { key: 'category_code', label: 'Category Code', type: 'text' as const, placeholder: 'TRD', tip: 'Short code for the issue category' },
  { key: 'product', label: 'Product', type: 'select' as const, options: ['all', 'choicefinx', 'tickfunds', 'tushil'], required: true },
  { key: 'sub_product', label: 'Sub Product', type: 'text' as const, placeholder: 'e.g. Equity, SIP, Term Life' },
  { key: 'category', label: 'Category', type: 'select' as const, options: ['General', 'Account', 'KYC', 'Trading', 'Funds', 'Technical', 'Billing', 'Products', 'Onboarding', 'Transactions', 'Reports', 'Compliance', 'Security', 'Insurance'], required: true },
  { key: 'issue_type', label: 'Issue Type', type: 'text' as const, placeholder: 'e.g. Order Placement Failure' },
  { key: 'priority', label: 'Priority', type: 'select' as const, options: ['critical', 'high', 'standard'] },
  { key: 'owner_team', label: 'Owner Team', type: 'select' as const, options: ['support', 'operations', 'compliance', 'technology', 'accounts'] },
  { key: 'escalation_level', label: 'Escalation Level', type: 'number' as const },
  { key: 'regulatory_tag', label: 'Regulatory Tag', type: 'select' as const, options: ['none', 'SEBI', 'IRDAI', 'Exchange', 'AMFI'] },
  { key: 'impact_type', label: 'Impact Type', type: 'select' as const, options: ['financial', 'compliance', 'operational', 'reputational'] },

  // ── Customer KB Content ──
  { key: 'title', label: 'Article Title', type: 'text' as const, required: true, colSpan: 2 },
  { key: 'slug', label: 'Slug', type: 'text' as const, required: true, placeholder: 'auto-generated-slug', tip: 'URL-friendly identifier. Must be unique.' },
  { key: 'question_variants', label: 'Question Variants', type: 'textarea' as const, colSpan: 2, placeholder: 'One variant per line — used for search & chatbot matching', tip: 'Enter each question variant on a new line. These power search and AI matching.' },
  { key: 'short_summary', label: 'Short Summary', type: 'textarea' as const, colSpan: 2, placeholder: 'Brief 1-2 sentence summary of the issue and resolution' },
  { key: 'possible_reasons', label: 'Possible Reasons', type: 'html' as const, colSpan: 2 },
  { key: 'what_to_check', label: 'What To Check', type: 'html' as const, colSpan: 2 },
  { key: 'resolution_steps', label: 'Resolution Steps', type: 'html' as const, colSpan: 2 },
  { key: 'documents_required', label: 'Essential Requirements', type: 'textarea' as const, placeholder: 'One requirement per line', tip: 'Enter each essential requirement on a new line (documents, prerequisites, etc.)' },
  { key: 'resolution_timeline', label: 'Resolution Timeline', type: 'textarea' as const, placeholder: 'e.g. 24-48 hours\nDescribe the expected resolution timeline in detail' },
  { key: 'when_to_raise_ticket', label: 'When To Raise Ticket', type: 'textarea' as const, colSpan: 2, placeholder: 'Describe conditions when user should escalate to a ticket' },
  { key: 'body', label: 'Full Article Content (Legacy)', type: 'html' as const, colSpan: 2 },

  // ── Internal ──
  { key: 'internal_escalation_note', label: 'Internal Escalation Note', type: 'textarea' as const, colSpan: 2, placeholder: 'Internal-only notes for support agents' },

  // ── Search & AI ──
  { key: 'search_keywords', label: 'Search Keywords', type: 'textarea' as const, placeholder: 'One keyword per line', tip: 'Keywords for search indexing & AI matching' },
  { key: 'tags', label: 'Tags', type: 'text' as const, placeholder: 'Comma-separated tags', colSpan: 2 },
  { key: 'suggested_article_group', label: 'Suggested Article Group', type: 'text' as const, placeholder: 'e.g. trading-failures, kyc-issues', tip: 'Group key to link related articles for suggestion engine' },

  // ── Control ──
  { key: 'visibility', label: 'Visibility', type: 'select' as const, options: ['public', 'internal'] },
  { key: 'status', label: 'Status', type: 'select' as const, options: ['draft', 'published', 'archived'] },
  { key: 'is_featured', label: 'Featured', type: 'checkbox' as const },
];

const tableColumns = [
  { key: 'title', label: 'Article' },
  { key: 'issue_code', label: 'Code' },
  { key: 'product', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'priority', label: 'Priority' },
  { key: 'owner_team', label: 'Team' },
  { key: 'visibility', label: 'Visibility' },
  { key: 'status', label: 'Status' },
];

export default function AdminKnowledgeBase() {
  return (
    <GenericCMSPage
      title="Knowledge Base"
      subtitle="Production-ready KB articles with issue classification, self-service resolution, and AI search"
      tableName="kb_articles"
      fields={fields}
      emptyForm={{
        issue_code: '', category_code: '', product: 'all', sub_product: '', category: 'General',
        issue_type: '', priority: 'standard', owner_team: 'support', escalation_level: 1,
        regulatory_tag: 'none', impact_type: 'operational',
        title: '', slug: '', question_variants: '', short_summary: '',
        possible_reasons: '', what_to_check: '', resolution_steps: '',
        documents_required: '', resolution_timeline: '', when_to_raise_ticket: '',
        body: '', internal_escalation_note: '',
        search_keywords: '', tags: '', suggested_article_group: '',
        visibility: 'public', status: 'draft', is_featured: false,
      }}
      tableColumns={tableColumns}
      hasStatus
      hasFeatured
      categoryField="category"
      extraFilterField="product"
      extraFilterLabel="All Products"
    />
  );
}
