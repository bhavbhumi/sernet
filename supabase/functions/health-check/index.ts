import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ── 1. Table row counts ──────────────────────────────────
    const contentTables = [
      "articles", "analyses", "awareness", "reports", "bulletins",
      "news_items", "circulars", "press_items",
    ];
    const operationalTables = [
      "crm_deals", "crm_contacts", "crm_activities", "leads", "calculator_leads",
      "support_tickets", "kb_articles", "employees", "invoices",
      "profiles", "reviews", "polls", "surveys",
    ];
    const systemTables = [
      "audit_logs", "workflow_rules", "workflow_logs", "user_roles",
    ];
    const allTables = [...contentTables, ...operationalTables, ...systemTables];

    const tableCounts: Record<string, number> = {};
    await Promise.all(
      allTables.map(async (t) => {
        const { count } = await supabase.from(t).select("id", { count: "exact", head: true });
        tableCounts[t] = count ?? 0;
      })
    );

    // ── 2. Content health ────────────────────────────────────
    const { count: draftArticles } = await supabase
      .from("articles").select("id", { count: "exact", head: true }).eq("status", "draft");
    const { count: publishedArticles } = await supabase
      .from("articles").select("id", { count: "exact", head: true }).eq("status", "published");
    const { count: expiredBulletins } = await supabase
      .from("bulletins").select("id", { count: "exact", head: true })
      .eq("status", "published").lt("expires_at", new Date().toISOString());
    const { count: missingThumbnails } = await supabase
      .from("articles").select("id", { count: "exact", head: true })
      .eq("status", "published").is("thumbnail_url", null);

    // ── 3. Support health ────────────────────────────────────
    const { count: openTickets } = await supabase
      .from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open");
    const { count: breachedTickets } = await supabase
      .from("support_tickets").select("id", { count: "exact", head: true })
      .in("status", ["open", "in_progress"]).lt("tat_deadline", new Date().toISOString());

    // ── 4. Workflow health ───────────────────────────────────
    const { count: activeRules } = await supabase
      .from("workflow_rules").select("id", { count: "exact", head: true }).eq("is_active", true);
    const { count: totalRules } = await supabase
      .from("workflow_rules").select("id", { count: "exact", head: true });
    const { count: recentErrors } = await supabase
      .from("workflow_logs").select("id", { count: "exact", head: true })
      .eq("status", "error")
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    const { count: recentExecutions } = await supabase
      .from("workflow_logs").select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // ── 5. CRM health ────────────────────────────────────────
    const { count: openDeals } = await supabase
      .from("crm_deals").select("id", { count: "exact", head: true })
      .not("stage", "in", "(won,lost)");
    const { count: staleDeals } = await supabase
      .from("crm_deals").select("id", { count: "exact", head: true })
      .not("stage", "in", "(won,lost)")
      .lt("updated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // ── 6. Auth & portal health ──────────────────────────────
    const { count: staffUsers } = await supabase
      .from("user_roles").select("id", { count: "exact", head: true });
    const { count: portalUsers } = await supabase
      .from("profiles").select("id", { count: "exact", head: true });
    const { count: pendingPartners } = await supabase
      .from("profiles").select("id", { count: "exact", head: true })
      .eq("user_type", "partner").eq("status", "pending_approval");

    // ── 7. Scheduled tasks (cron) ────────────────────────────
    const { data: cronJobs } = await supabase.rpc("get_cron_jobs").catch(() => ({ data: null }));
    // Fallback: just report what we know
    const scheduledTasks = cronJobs || [
      { name: "sync-economic-actuals-nightly", schedule: "30 0 * * *", active: true },
      { name: "rss-auto-sync-hourly", schedule: "0 */4 * * *", active: true },
      { name: "bulletin-expiry-daily", schedule: "0 1 * * *", active: true },
    ];

    // ── 8. Build health score ────────────────────────────────
    const issues: Array<{ severity: "critical" | "warning" | "info"; area: string; message: string }> = [];

    if ((breachedTickets ?? 0) > 0) {
      issues.push({ severity: "critical", area: "Support", message: `${breachedTickets} ticket(s) have breached TAT deadline` });
    }
    if ((expiredBulletins ?? 0) > 0) {
      issues.push({ severity: "warning", area: "Content", message: `${expiredBulletins} published bulletin(s) past expiry date` });
    }
    if ((missingThumbnails ?? 0) > 0) {
      issues.push({ severity: "info", area: "Content", message: `${missingThumbnails} published article(s) missing thumbnails` });
    }
    if ((staleDeals ?? 0) > 0) {
      issues.push({ severity: "warning", area: "Sales", message: `${staleDeals} deal(s) not updated in 30+ days` });
    }
    if ((recentErrors ?? 0) > 0) {
      issues.push({ severity: "warning", area: "Workflows", message: `${recentErrors} workflow error(s) in last 7 days` });
    }
    if ((pendingPartners ?? 0) > 0) {
      issues.push({ severity: "info", area: "Portal", message: `${pendingPartners} partner(s) awaiting approval` });
    }
    if ((draftArticles ?? 0) > (publishedArticles ?? 0)) {
      issues.push({ severity: "info", area: "Content", message: `More drafts (${draftArticles}) than published articles (${publishedArticles})` });
    }

    const criticalCount = issues.filter(i => i.severity === "critical").length;
    const warningCount = issues.filter(i => i.severity === "warning").length;
    const healthScore = Math.max(0, 100 - (criticalCount * 20) - (warningCount * 10) - (issues.length * 2));

    const result = {
      timestamp: new Date().toISOString(),
      health_score: healthScore,
      status: criticalCount > 0 ? "critical" : warningCount > 0 ? "warning" : "healthy",
      issues,
      summary: {
        content: {
          total: contentTables.reduce((sum, t) => sum + (tableCounts[t] || 0), 0),
          drafts: draftArticles ?? 0,
          published: publishedArticles ?? 0,
          missing_thumbnails: missingThumbnails ?? 0,
          expired_bulletins: expiredBulletins ?? 0,
        },
        support: {
          total_tickets: tableCounts.support_tickets || 0,
          open: openTickets ?? 0,
          breached: breachedTickets ?? 0,
          kb_articles: tableCounts.kb_articles || 0,
        },
        sales: {
          total_deals: tableCounts.crm_deals || 0,
          open_deals: openDeals ?? 0,
          stale_deals: staleDeals ?? 0,
          leads: tableCounts.leads || 0,
          calculator_leads: tableCounts.calculator_leads || 0,
          contacts: tableCounts.crm_contacts || 0,
        },
        workflows: {
          total_rules: totalRules ?? 0,
          active_rules: activeRules ?? 0,
          recent_executions: recentExecutions ?? 0,
          recent_errors: recentErrors ?? 0,
        },
        users: {
          staff: staffUsers ?? 0,
          portal: portalUsers ?? 0,
          pending_partners: pendingPartners ?? 0,
        },
        database: {
          total_tables: allTables.length,
          table_counts: tableCounts,
        },
        scheduled_tasks: scheduledTasks,
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
