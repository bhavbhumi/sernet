import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HealthIssue {
  area: string;
  message: string;
  severity: "critical" | "warning" | "info";
}

export interface HealthData {
  timestamp: string;
  health_score: number;
  status: "healthy" | "warning" | "critical";
  issues: HealthIssue[];
  details: Record<string, unknown>;
  summary: {
    content: { total: number; drafts: number; published: number; missing_thumbnails: number; expired_bulletins: number };
    support: { total_tickets: number; open: number; breached: number; kb_articles: number };
    sales: { total_deals: number; open_deals: number; stale_deals: number; leads: number; calculator_leads: number; contacts: number };
    workflows: { total_rules: number; active_rules: number; recent_executions: number; recent_errors: number };
    users: { staff: number; portal: number; pending_partners: number };
    database: { total_tables: number; table_counts: Record<string, number> };
    scheduled_tasks: Array<{ name: string; schedule: string; active: boolean }>;
  };
}

async function fetchHealth(): Promise<HealthData> {
  const { data, error } = await supabase.functions.invoke("health-check");
  if (error) throw error;
  return data as HealthData;
}

export function useHealthCheck(enabled = true) {
  return useQuery({
    queryKey: ["system-health"],
    queryFn: fetchHealth,
    enabled,
    staleTime: 10 * 60 * 1000,   // 10 minutes — won't re-fetch within this window
    gcTime: 15 * 60 * 1000,      // keep in cache 15 min after unmount
    refetchOnWindowFocus: false,  // no silent refetches on tab switch
    retry: 1,
  });
}
