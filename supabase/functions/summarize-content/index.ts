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
    const { title, body, contentType = "article", contentId } = await req.json();

    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: "title and body are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role client to bypass RLS for cache read/write
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ── 1. Check cache first ──────────────────────────────────────────────
    if (contentId) {
      const { data: cached } = await supabase
        .from("content_summaries")
        .select("*")
        .eq("content_id", contentId)
        .eq("content_type", contentType)
        .maybeSingle();

      if (cached) {
        console.log(`Cache hit for ${contentType}:${contentId}`);
        return new Response(
          JSON.stringify({
            summary: {
              tldr: cached.tldr,
              keyPoints: cached.key_points,
              sentiment: cached.sentiment,
              readTime: cached.read_time,
            },
            cached: true,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // ── 2. No cache — call AI ─────────────────────────────────────────────
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a financial content summarizer for SerNet, a SEBI-registered investment advisory firm.
Your task is to produce a concise, structured summary of ${contentType}s that helps retail investors quickly grasp the key insights.

Always respond with a JSON object in this exact structure:
{
  "tldr": "One sentence — the single most important takeaway (max 30 words)",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "bullish" | "bearish" | "neutral",
  "readTime": "X min read"
}

Rules:
- tldr must be plain text, no markdown
- keyPoints: exactly 3 bullet points, each max 20 words, plain text
- sentiment: one of exactly: bullish, bearish, neutral — based on the content's market outlook
- readTime: estimate based on body length (avg 200 words/min)
- Do NOT include any text outside the JSON object`;

    const userPrompt = `Summarize this ${contentType}:\n\nTitle: ${title}\n\nContent:\n${body.slice(0, 4000)}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        temperature: 0.1, // Low temperature = consistent, deterministic output
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service usage limit reached." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content ?? "";

    // Parse JSON from AI response (strip markdown code fences if present)
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in AI response:", rawContent);
      return new Response(
        JSON.stringify({ error: "Could not parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const summary = JSON.parse(jsonMatch[0]);

    // ── 3. Store in cache ─────────────────────────────────────────────────
    if (contentId) {
      const { error: cacheErr } = await supabase
        .from("content_summaries")
        .upsert({
          content_id: contentId,
          content_type: contentType,
          tldr: summary.tldr,
          key_points: summary.keyPoints,
          sentiment: summary.sentiment,
          read_time: summary.readTime,
        }, { onConflict: "content_id,content_type" });

      if (cacheErr) {
        console.error("Failed to cache summary:", cacheErr.message);
        // Non-fatal — still return the summary
      } else {
        console.log(`Cached summary for ${contentType}:${contentId}`);
      }
    }

    return new Response(
      JSON.stringify({ summary, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("summarize-content error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
