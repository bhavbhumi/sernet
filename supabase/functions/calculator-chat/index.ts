import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, calcType, aiContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Build param extraction tool
    const paramTool = {
      type: "function",
      function: {
        name: "update_calculator_params",
        description: "When the user provides numerical values that should update the calculator, call this to set them.",
        parameters: {
          type: "object",
          properties: {
            monthlyInvestment: { type: "number", description: "Monthly SIP/investment amount in rupees" },
            lumpsum: { type: "number", description: "One-time lumpsum investment in rupees" },
            targetAmount: { type: "number", description: "Target goal amount in rupees" },
            expectedReturn: { type: "number", description: "Expected annual return as percentage (e.g. 12 for 12%)" },
            timePeriod: { type: "number", description: "Time period in years" },
            annualIncome: { type: "number", description: "Annual income in rupees" },
            age: { type: "number", description: "Current age in years" },
            retirementAge: { type: "number", description: "Planned retirement age" },
            liabilities: { type: "number", description: "Outstanding liabilities/loans in rupees" },
            existingCover: { type: "number", description: "Existing insurance cover in rupees" },
            existingCorpus: { type: "number", description: "Existing savings/corpus in rupees" },
            buyPrice: { type: "number", description: "Buy/purchase price per share in rupees" },
            sellPrice: { type: "number", description: "Sell price per share in rupees" },
            quantity: { type: "number", description: "Number of shares/quantity" },
            stockPrice: { type: "number", description: "Current stock/index price in rupees" },
          },
        },
      },
    };

    const systemPrompt = `You are a friendly, expert Indian financial advisor AI assistant embedded in a ${calcType} calculator.

Context about this calculator: ${aiContext}

Your role:
1. Help users understand their financial needs through conversation
2. Extract numerical values from their messages and update the calculator via the update_calculator_params tool
3. Provide clear, jargon-free explanations of results and recommendations
4. Give context appropriate for Indian markets (use ₹, Lakh, Crore notation)
5. Ask clarifying questions when needed to understand their situation better
6. Provide rationale for your suggestions (risk, time horizon, market assumptions)
7. Keep responses concise (2-4 sentences max unless explaining methodology)
8. Be warm and encouraging — financial planning can feel overwhelming

Important:
- Always call update_calculator_params when you extract numerical values from user input
- Use 12% as default equity return assumption unless user specifies otherwise
- Inflation assumption: 6-7% for long-term planning
- For insurance: recommend 10-15x annual income as a minimum
- Never make promises about returns; use "estimated" or "projected"`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        tools: [paramTool],
        tool_choice: "auto",
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit reached. Please wait a moment.", status: 429 }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      if (status === 402) return new Response(JSON.stringify({ error: "AI usage limit reached.", status: 402 }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const message = choice?.message;

    let reply = message?.content || "";
    let params: Record<string, number> | undefined;

    // Handle tool call
    if (message?.tool_calls?.length > 0) {
      const toolCall = message.tool_calls[0];
      if (toolCall.function?.name === "update_calculator_params") {
        try {
          params = JSON.parse(toolCall.function.arguments);
        } catch (_) {}
      }

      // If no text reply, make a follow-up call for the text
      if (!reply) {
        const followUp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
              message,
              {
                role: "tool",
                tool_call_id: toolCall.id,
                content: "Parameters updated successfully.",
              },
            ],
            temperature: 0.7,
          }),
        });
        const followData = await followUp.json();
        reply = followData.choices?.[0]?.message?.content || "I've updated the calculator with your values. Let me know if you'd like to adjust anything!";
      }
    }

    return new Response(JSON.stringify({ reply, params }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("calculator-chat error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
