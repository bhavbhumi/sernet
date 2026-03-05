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
