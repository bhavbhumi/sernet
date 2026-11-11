// Only mounted operational queries refresh; static settings and expensive health diagnostics do not.
export const MIS_REFRESH_MS = 60_000;
export const MIS_REFRESH_EVENT = 'sernet:mis-refresh';

const operationalKeys = new Set([
  'admin-dashboard-stats', 'leads', 'calculator-leads', 'lead-attribution', 'lead-activity-counts',
  'lead-activities', 'deal-activities', 'crm-activities', 'crm-deals', 'contact-deals', 'contact-activities',
  'invoices', 'payroll-records', 'attendance-logs', 'leave-requests', 'leave-balances',
  'leave-requests-approved', 'expense-claims', 'salary-register', 'leave-encashment',
  'employee-loans', 'employee-exits', 'event-registrations', 'workflow-logs',
  'admin-post-likes', 'admin-post-shares', 'admin-article-likes', 'admin-article-shares',
  'marketing-leads-overview', 'marketing-action-needed', 'campaign-links', 'content-distribution',
]);

export function isMISQuery(queryKey: readonly unknown[]) {
  return typeof queryKey[0] === 'string' && operationalKeys.has(queryKey[0]);
}

export async function readAllMISRows<T>(
  fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  const rows: T[] = [];
  const size = 500;
  for (let from = 0; ; from += size) {
    const { data, error } = await fetchPage(from, from + size - 1);
    if (error) throw new Error(error.message);
    const page = data ?? [];
    rows.push(...page);
    if (page.length < size) return rows;
  }
}

export function readMISCount(result: { count: number | null; error: unknown }): number | null {
  return result.error ? null : result.count;
}