import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface WorkflowCondition {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "gt" | "lt" | "is_empty" | "is_not_empty";
  value: string;
}

interface WorkflowAction {
  type: "update_field" | "create_activity" | "send_notification";
  config: Record<string, string>;
}

function evaluateCondition(condition: WorkflowCondition, record: Record<string, unknown>): boolean {
  const fieldValue = String(record[condition.field] ?? "");
  switch (condition.operator) {
    case "equals": return fieldValue === condition.value;
    case "not_equals": return fieldValue !== condition.value;
    case "contains": return fieldValue.toLowerCase().includes(condition.value.toLowerCase());
    case "gt": return Number(fieldValue) > Number(condition.value);
    case "lt": return Number(fieldValue) < Number(condition.value);
    case "is_empty": return !fieldValue || fieldValue === "null";
    case "is_not_empty": return !!fieldValue && fieldValue !== "null";
    default: return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { entity_type, trigger_event, entity_id, record, old_record } = await req.json();

    if (!entity_type || !trigger_event || !entity_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch matching active rules
    const { data: rules, error: rulesErr } = await supabase
      .from("workflow_rules")
      .select("*")
      .eq("entity_type", entity_type)
      .eq("trigger_event", trigger_event)
      .eq("is_active", true)
      .order("priority", { ascending: true });

    if (rulesErr) throw rulesErr;
    if (!rules || rules.length === 0) {
      return new Response(JSON.stringify({ executed: 0, message: "No matching rules" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Array<{ rule_id: string; status: string; actions: string[] }> = [];

    for (const rule of rules) {
      try {
        // Check trigger_field filter
        if (rule.trigger_field && trigger_event === "update") {
          const oldVal = old_record?.[rule.trigger_field];
          const newVal = record?.[rule.trigger_field];
          if (oldVal === newVal) continue; // field didn't change
          if (rule.trigger_value && String(newVal) !== rule.trigger_value) continue;
        }

        // Evaluate conditions
        const conditions = (rule.conditions as WorkflowCondition[]) || [];
        const allMet = conditions.every((c) => evaluateCondition(c, record || {}));
        if (!allMet) {
          // Log as skipped
          await supabase.from("workflow_logs").insert({
            rule_id: rule.id,
            entity_type,
            entity_id: String(entity_id),
            trigger_event,
            status: "skipped",
            actions_executed: [],
            execution_time_ms: Date.now() - startTime,
          });
          continue;
        }

        // Execute actions
        const actions = (rule.actions as WorkflowAction[]) || [];
        const executedActions: string[] = [];

        for (const action of actions) {
          switch (action.type) {
            case "update_field": {
              const updates: Record<string, string> = {};
              if (action.config.field && action.config.value !== undefined) {
                updates[action.config.field] = action.config.value;
              }
              if (Object.keys(updates).length > 0) {
                await supabase.from(entity_type).update(updates).eq("id", entity_id);
                executedActions.push(`update_field:${action.config.field}=${action.config.value}`);
              }
              break;
            }
            case "create_activity": {
              await supabase.from("crm_activities").insert({
                subject: action.config.subject || "Auto-generated activity",
                description: action.config.description || `Triggered by workflow: ${rule.name}`,
                activity_type: action.config.activity_type || "note",
                deal_id: entity_type === "crm_deals" ? entity_id : null,
                contact_id: entity_type === "crm_contacts" ? entity_id : (record?.contact_id || null),
              });
              executedActions.push(`create_activity:${action.config.subject || "note"}`);
              break;
            }
            case "send_notification": {
              // Log notification intent (actual sending would need email/webhook integration)
              executedActions.push(`notification:${action.config.message || "triggered"}`);
              break;
            }
          }
        }

        // Log success
        await supabase.from("workflow_logs").insert({
          rule_id: rule.id,
          entity_type,
          entity_id: String(entity_id),
          trigger_event,
          status: "success",
          actions_executed: executedActions,
          execution_time_ms: Date.now() - startTime,
        });

        results.push({ rule_id: rule.id, status: "success", actions: executedActions });
      } catch (ruleErr: unknown) {
        const errorMessage = ruleErr instanceof Error ? ruleErr.message : String(ruleErr);
        await supabase.from("workflow_logs").insert({
          rule_id: rule.id,
          entity_type,
          entity_id: String(entity_id),
          trigger_event,
          status: "error",
          error_message: errorMessage,
          execution_time_ms: Date.now() - startTime,
        });
        results.push({ rule_id: rule.id, status: "error", actions: [] });
      }
    }

    return new Response(
      JSON.stringify({ executed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
