/**
 * Centralized Admin Route Map
 * Master → Department → Module → Section hierarchy
 */

export const ADMIN_ROUTES = {
  // Master
  dashboard: '/admin',
  login: '/admin/login',
  setup: '/admin/setup',

  // ── Marketing ──────────────────────────────────
  marketing: {
    root: '/admin/marketing',
    content: {
      articles: '/admin/marketing/content/articles',
      analysis: '/admin/marketing/content/analysis',
      awareness: '/admin/marketing/content/awareness',
      reports: '/admin/marketing/content/reports',
      bulletin: '/admin/marketing/content/bulletin',
      import: '/admin/marketing/content/import',
    },
    updates: {
      news: '/admin/marketing/updates/news',
      circulars: '/admin/marketing/updates/circulars',
    },
    engagement: {
      polls: '/admin/marketing/engagement/polls',
      surveys: '/admin/marketing/engagement/surveys',
      reviews: '/admin/marketing/engagement/reviews',
      newsletter: '/admin/marketing/engagement/newsletter',
      composer: '/admin/marketing/engagement/composer',
    },
    press: '/admin/marketing/press',
    calendars: {
      holidays: '/admin/marketing/calendars/holidays',
      economic: '/admin/marketing/calendars/economic',
      importEconomic: '/admin/marketing/calendars/import-economic',
      corporate: '/admin/marketing/calendars/corporate',
    },
    site: {
      settings: '/admin/marketing/site/settings',
      pages: '/admin/marketing/site/pages',
      media: '/admin/marketing/site/media',
    },
  },

  // ── Sales ──────────────────────────────────────
  sales: {
    root: '/admin/sales',
    pipeline: '/admin/sales/crm/pipeline',
    pipelineConfig: '/admin/sales/crm/pipeline-config',
    deals: '/admin/sales/crm/deals',
    contacts: '/admin/sales/crm/contacts',
    activities: '/admin/sales/crm/activities',
    leads: '/admin/sales/leads',
    calculatorLeads: '/admin/sales/calculator-leads',
  },

  // ── HR ─────────────────────────────────────────
  hr: {
    root: '/admin/hr',
    careers: {
      openings: '/admin/hr/careers/openings',
      applications: '/admin/hr/careers/applications',
    },
    employees: '/admin/hr/employees',
    leave: '/admin/hr/leave',
    attendance: '/admin/hr/attendance',
  },

  // ── Accounts ──────────────────────────────────
  accounts: {
    root: '/admin/accounts',
    firmProfile: '/admin/accounts/firm-profile',
    taxRates: '/admin/accounts/tax-rates',
    bankAccounts: '/admin/accounts/bank-accounts',
    paymentTerms: '/admin/accounts/payment-terms',
    serviceCatalog: '/admin/accounts/service-catalog',
    salaryComponents: '/admin/accounts/salary-components',
    invoices: '/admin/accounts/invoices',
    payroll: '/admin/accounts/payroll',
  },

  // ── Legal & Compliance ─────────────────────────
  legal: {
    root: '/admin/legal',
    pages: '/admin/legal/pages',
    investorCharter: '/admin/legal/investor-charter',
  },

  // ── Support ───────────────────────────────────
  support: {
    root: '/admin/support',
    tickets: '/admin/support/tickets',
    ticketDetail: '/admin/support/tickets/:id',
    knowledgeBase: '/admin/support/knowledge-base',
    cannedResponses: '/admin/support/canned-responses',
  },

  // ── Settings (Super Admin) ─────────────────────
  settings: {
    root: '/admin/settings',
    users: '/admin/settings/users',
    rss: '/admin/settings/rss',
    aiUsage: '/admin/settings/ai-usage',
    auditLog: '/admin/settings/audit-log',
    workflows: '/admin/settings/workflows',
  },
} as const;

/** Department labels for sidebar grouping */
export const DEPARTMENTS = [
  { key: 'marketing', label: 'Marketing', color: 'text-blue-500' },
  { key: 'sales', label: 'Sales', color: 'text-emerald-500' },
  { key: 'hr', label: 'HR', color: 'text-orange-500' },
  { key: 'accounts', label: 'Accounts', color: 'text-amber-500' },
  { key: 'support', label: 'Support', color: 'text-cyan-500' },
  { key: 'legal', label: 'Legal & Compliance', color: 'text-violet-500' },
  { key: 'settings', label: 'System', color: 'text-muted-foreground' },
] as const;

export type DepartmentKey = typeof DEPARTMENTS[number]['key'];
