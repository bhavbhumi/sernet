/**
 * Support Classification Engine - Shared types & utilities
 */

export const PRODUCTS = [
  { key: 'tickfunds', label: 'Tick Funds', description: 'Mutual Funds & Investment', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { key: 'choicefinx', label: 'Choice FinX', description: 'Trading & Broking', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { key: 'tushil', label: 'Tushil', description: 'Insurance', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
] as const;

export const PRIORITY_CONFIG = {
  critical: { label: 'Critical', tat: '4 hours', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', dot: 'bg-red-500' },
  high: { label: 'High', tat: '24 hours', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300', dot: 'bg-orange-500' },
  standard: { label: 'Standard', tat: '48-72 hours', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', dot: 'bg-blue-500' },
} as const;

export const RISK_TAGS = {
  financial: { label: 'Financial', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' },
  compliance: { label: 'Compliance', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800' },
  operational: { label: 'Operational', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' },
  reputational: { label: 'Reputational', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800' },
} as const;

export const REGULATORS = {
  SEBI: { label: 'SEBI', color: 'text-blue-700 dark:text-blue-400' },
  IRDAI: { label: 'IRDAI', color: 'text-green-700 dark:text-green-400' },
  Exchange: { label: 'Exchange', color: 'text-orange-700 dark:text-orange-400' },
} as const;

export type Product = typeof PRODUCTS[number]['key'];

/** Run keyword-based automation rules against ticket text */
export function matchAutomationRules(
  text: string,
  rules: Array<{ conditions: any; actions: any; trigger_type: string; is_active: boolean }>
): { priority?: string; tat_hours?: number; assign_team?: string; notify?: string[] } | null {
  const lower = text.toLowerCase();
  for (const rule of rules) {
    if (!rule.is_active || rule.trigger_type !== 'keyword') continue;
    const keywords: string[] = rule.conditions?.keywords ?? [];
    const matched = keywords.some(kw => lower.includes(kw.toLowerCase()));
    if (matched) return rule.actions;
  }
  return null;
}
