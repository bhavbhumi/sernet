import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goalText, saveLead } = await req.json();

    if (!goalText || typeof goalText !== "string" || goalText.trim().length < 5) {
      return new Response(
        JSON.stringify({ error: "Please describe your financial goal." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert financial planner for SerNet, an AMFI-registered Mutual Fund Distributor and financial services firm in India.
A user has described their financial goal in natural language. Your job is to:
1. Identify the best product/calculator to use (sip, lumpsum, goal, brokerage, margin, insurance)
2. Extract structured parameters from their goal
3. Calculate results where possible
4. Write a short, friendly explanation in plain English

Products available:
- sip: Systematic Investment Plan (monthly investment, growth projection over time)
- lumpsum: One-time investment projection in mutual funds
- goal: Goal-based investment planner — use when user mentions a TARGET amount and wants to know HOW MUCH to invest (monthly or lumpsum) to get there. Also use for goals like retirement, child's education, wedding etc.
- brokerage: Trading cost calculator (brokerage, STT, charges)
- margin: Margin/leverage calculator for equity or F&O traders
- insurance: Life insurance need estimator — use when user mentions family cover, life insurance, term plan, or protecting dependents

Indian number formatting: use ₹, Lakh (L), Crore (Cr).
Return ONLY valid JSON matching the tool schema.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `User goal: "${goalText.slice(0, 500)}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "parse_financial_goal",
              description: "Parse a financial goal into structured calculator parameters and generate an AI explanation.",
              parameters: {
                type: "object",
                properties: {
                  product: {
                    type: "string",
                    enum: ["sip", "lumpsum", "goal", "brokerage", "margin", "insurance"],
                    description: "Which calculator best fits the user's goal. Use 'goal' when user wants to reach a target amount.",
                  },
                  params: {
                    type: "object",
                    description: "Calculator input parameters",
                    properties: {
                      monthlyInvestment: { type: "number", description: "Monthly SIP amount in ₹" },
                      lumpsum: { type: "number", description: "One-time investment amount in ₹" },
                      targetAmount: { type: "number", description: "Goal corpus in ₹" },
                      expectedReturn: { type: "number", description: "Expected annual return % (default 12 for equity, 7 for debt)" },
                      timePeriod: { type: "number", description: "Investment duration in years" },
                      tradeValue: { type: "number", description: "Trade value for brokerage calculation" },
                      coverAmount: { type: "number", description: "Insurance cover amount in ₹" },
                    },
                  },
                  result: {
                    type: "object",
                    description: "Pre-calculated result",
                    properties: {
                      futureValue: { type: "number", description: "Projected corpus value in ₹" },
                      totalInvested: { type: "number", description: "Total amount invested in ₹" },
                      wealthGained: { type: "number", description: "Estimated returns earned in ₹" },
                      requiredMonthly: { type: "number", description: "Monthly SIP needed to reach goal" },
                    },
                  },
                  explanation: {
                    type: "string",
                    description: "2-3 sentence friendly explanation of what the numbers mean and one actionable tip. Plain text, no markdown.",
                  },
                  confidence: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                    description: "How confident the AI is in the parameter extraction",
                  },
                },
                required: ["product", "params", "explanation", "confidence"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "parse_financial_goal" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI service error." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(
        JSON.stringify({ error: "Could not parse your goal. Please try rephrasing." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const parsed = JSON.parse(toolCall.function.arguments);

    // Save lead if provided — write to unified leads table
    if (saveLead?.name && saveLead?.phone) {
      const db = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      // Write to unified leads table
      await db.from("leads").insert({
        name: saveLead.name.slice(0, 100),
        phone: saveLead.phone.slice(0, 20),
        email: saveLead.email?.slice(0, 255) ?? null,
        source: "calculator",
        lead_type: "self",
        context: {
          goal_text: goalText.slice(0, 1000),
          product_type: parsed.product,
          calculated_result: parsed.result ?? null,
        },
      });
      // Also keep legacy calculator_leads for backward compat
      await db.from("calculator_leads").insert({
        name: saveLead.name.slice(0, 100),
        phone: saveLead.phone.slice(0, 20),
        email: saveLead.email?.slice(0, 255) ?? null,
        goal_text: goalText.slice(0, 1000),
        product_type: parsed.product,
        calculated_result: parsed.result ?? null,
      });
    }

    return new Response(
      JSON.stringify({ success: true, data: parsed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("ai-calculator error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
