import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // Fetch pages missing meta_title or meta_description
    const { data: pages, error: fetchErr } = await sb
      .from("site_pages")
      .select("id, title, path, section, description, meta_title, meta_description")
      .or("meta_title.is.null,meta_description.is.null,meta_title.eq.,meta_description.eq.")
      .order("path");

    if (fetchErr) throw fetchErr;
    if (!pages || pages.length === 0) {
      return new Response(
        JSON.stringify({ message: "All pages already have SEO meta.", updated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build prompt
    const pageList = pages
      .map(
        (p: any) =>
          `- id: ${p.id} | title: "${p.title}" | path: "${p.path}" | section: "${p.section}" | desc: "${p.description || ""}" | existing_meta_title: "${p.meta_title || ""}" | existing_meta_desc: "${p.meta_description || ""}"`
      )
      .join("\n");

    const systemPrompt = `You are an SEO specialist for Sernet India (sernetindia.com), a financial services company offering wealth management, mutual funds, insurance, trading, and investment services. Their brands include TickFunds (mutual fund platform), Tushil (trading platform), and ChoiceFinX (insurance platform).

Generate SEO-optimized meta titles and descriptions for the pages listed below. Only generate for MISSING fields (empty meta_title or meta_description).

Rules:
- Meta titles: max 60 characters, include primary keyword, brand name "Sernet" where appropriate
- Meta descriptions: max 160 characters, compelling, include call-to-action where appropriate
- Use financial services terminology appropriate for Indian market
- For legal/compliance pages, keep tone professional and factual
- For product pages, be benefit-driven
- For tool pages (calculators, calendars), emphasize utility`;

    const userPrompt = `Generate missing SEO meta for these pages. Return ONLY a valid JSON array of objects with fields: id, meta_title, meta_description. Only include fields that were missing/empty. Keep existing values unchanged.

Pages:
${pageList}`;

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
      }
    );

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway returned ${aiResp.status}`);
    }

    const aiData = await aiResp.json();
    const raw = aiData.choices?.[0]?.message?.content ?? "";

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Could not parse AI response:", raw);
      throw new Error("AI response did not contain valid JSON array");
    }

    const suggestions = JSON.parse(jsonMatch[0]) as Array<{
      id: string;
      meta_title?: string;
      meta_description?: string;
    }>;

    // Update each page
    let updated = 0;
    for (const s of suggestions) {
      const page = pages.find((p: any) => p.id === s.id);
      if (!page) continue;

      const updates: Record<string, string> = {};
      if ((!page.meta_title || page.meta_title === "") && s.meta_title) {
        updates.meta_title = s.meta_title.slice(0, 60);
      }
      if ((!page.meta_description || page.meta_description === "") && s.meta_description) {
        updates.meta_description = s.meta_description.slice(0, 160);
      }

      if (Object.keys(updates).length > 0) {
        const { error: upErr } = await sb
          .from("site_pages")
          .update(updates)
          .eq("id", s.id);
        if (upErr) {
          console.error(`Failed to update page ${s.id}:`, upErr);
        } else {
          updated++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: `Generated SEO meta for ${updated} pages.`,
        updated,
        total_missing: pages.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("seo-generate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
