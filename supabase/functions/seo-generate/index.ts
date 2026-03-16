import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function callAI(apiKey: string, systemPrompt: string, userPrompt: string) {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error("AI gateway error:", resp.status, errText);
    if (resp.status === 429) throw new Error("RATE_LIMIT");
    if (resp.status === 402) throw new Error("CREDITS_EXHAUSTED");
    throw new Error(`AI gateway returned ${resp.status}`);
  }

  const data = await resp.json();
  const raw = data.choices?.[0]?.message?.content ?? "";
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error("Could not parse AI response:", raw);
    throw new Error("AI response did not contain valid JSON array");
  }
  return JSON.parse(jsonMatch[0]);
}

const BRAND_CONTEXT = `You are an SEO specialist for SERNET India (sernetindia.com), a financial services company offering wealth management, mutual funds, insurance, trading, and investment services. Their brands include TickFunds (mutual funds), Tushil (insurance), and ChoiceFinX (trading platform).

Target keywords to weave in naturally where relevant:
- financial planning services, wealth management tips
- mutual fund investment strategies, trading education resources
- insurance products comparison, tax planning strategies
- financial literacy courses, international investment opportunities`;

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // Parse optional target from request body
    let target = "all";
    try {
      const body = await req.json();
      if (body?.target) target = body.target;
    } catch { /* no body is fine */ }

    let pagesUpdated = 0;
    let articlesUpdated = 0;

    // ── 1. Site Pages ────────────────────────────────────
    if (target === "all" || target === "pages") {
      const { data: pages, error: fetchErr } = await sb
        .from("site_pages")
        .select("id, title, path, section, description, meta_title, meta_description")
        .or("meta_title.is.null,meta_description.is.null,meta_title.eq.,meta_description.eq.")
        .order("path");

      if (fetchErr) throw fetchErr;

      if (pages && pages.length > 0) {
        const pageList = pages
          .map((p: any) =>
            `- id: ${p.id} | title: "${p.title}" | path: "${p.path}" | section: "${p.section}" | desc: "${p.description || ""}" | existing_meta_title: "${p.meta_title || ""}" | existing_meta_desc: "${p.meta_description || ""}"`
          )
          .join("\n");

        const systemPrompt = `${BRAND_CONTEXT}

Generate SEO-optimized meta titles and descriptions for site pages. Only generate for MISSING fields.

Rules:
- Meta titles: max 60 characters, include primary keyword, brand name "SERNET" where appropriate
- Meta descriptions: max 160 characters, compelling, include call-to-action where appropriate
- Use financial services terminology appropriate for Indian market
- For legal/compliance pages, keep tone professional and factual
- For product pages, be benefit-driven
- For tool pages (calculators, calendars), emphasize utility`;

        const userPrompt = `Generate missing SEO meta for these pages. Return ONLY a valid JSON array of objects with fields: id, meta_title, meta_description. Only include fields that were missing/empty.\n\nPages:\n${pageList}`;

        const suggestions = await callAI(LOVABLE_API_KEY, systemPrompt, userPrompt);

        for (const s of suggestions) {
          const page = pages.find((p: any) => p.id === s.id);
          if (!page) continue;
          const updates: Record<string, string> = {};
          if ((!page.meta_title || page.meta_title === "") && s.meta_title)
            updates.meta_title = s.meta_title.slice(0, 60);
          if ((!page.meta_description || page.meta_description === "") && s.meta_description)
            updates.meta_description = s.meta_description.slice(0, 160);
          if (Object.keys(updates).length > 0) {
            const { error } = await sb.from("site_pages").update(updates).eq("id", s.id);
            if (!error) pagesUpdated++;
            else console.error(`Failed to update page ${s.id}:`, error);
          }
        }
      }
    }

    // ── 2. Published Articles ────────────────────────────
    if (target === "all" || target === "articles") {
      const { data: articles, error: artErr } = await sb
        .from("articles")
        .select("id, title, category, sub_category, content_type, excerpt, meta_title, meta_description")
        .eq("status", "published")
        .or("meta_title.is.null,meta_description.is.null,meta_title.eq.,meta_description.eq.")
        .order("published_at", { ascending: false })
        .limit(50); // batch to avoid token limits

      if (artErr) throw artErr;

      if (articles && articles.length > 0) {
        const artList = articles
          .map((a: any) =>
            `- id: ${a.id} | title: "${a.title}" | type: ${a.content_type} | category: "${a.category}" | sub_cat: "${a.sub_category || ""}" | excerpt: "${(a.excerpt || "").slice(0, 120)}" | existing_meta_title: "${a.meta_title || ""}" | existing_meta_desc: "${a.meta_description || ""}"`
          )
          .join("\n");

        const systemPrompt = `${BRAND_CONTEXT}

Generate SEO-optimized meta titles and descriptions for published blog articles and analysis posts.

Rules:
- Meta titles: max 60 characters, descriptive, include the article's primary keyword
- Meta descriptions: max 160 characters, summarize the value proposition, encourage click-through
- For IPO articles, include "IPO" and key detail (price band, dates, or analysis)
- For market analysis, include the asset/sector and insight type
- For mutual fund articles, use phrases like "mutual fund investment strategies" naturally
- Always make it compelling for Google SERP click-through`;

        const userPrompt = `Generate missing SEO meta for these articles. Return ONLY a valid JSON array of objects with fields: id, meta_title, meta_description. Only include fields that were missing/empty.\n\nArticles:\n${artList}`;

        const suggestions = await callAI(LOVABLE_API_KEY, systemPrompt, userPrompt);

        for (const s of suggestions) {
          const art = articles.find((a: any) => a.id === s.id);
          if (!art) continue;
          const updates: Record<string, string> = {};
          if ((!art.meta_title || art.meta_title === "") && s.meta_title)
            updates.meta_title = s.meta_title.slice(0, 60);
          if ((!art.meta_description || art.meta_description === "") && s.meta_description)
            updates.meta_description = s.meta_description.slice(0, 160);
          if (Object.keys(updates).length > 0) {
            const { error } = await sb.from("articles").update(updates).eq("id", s.id);
            if (!error) articlesUpdated++;
            else console.error(`Failed to update article ${s.id}:`, error);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: `SEO meta generated: ${pagesUpdated} pages, ${articlesUpdated} articles updated.`,
        pagesUpdated,
        articlesUpdated,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg === "RATE_LIMIT") {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (msg === "CREDITS_EXHAUSTED") {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.error("seo-generate error:", e);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
