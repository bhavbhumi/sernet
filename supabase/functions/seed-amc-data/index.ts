import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

    const { rows } = await req.json();
    // rows: Array<{ amc_name, address1, address2, address3, city, pincode, phone }>

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return new Response(JSON.stringify({ error: "No rows provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Group by AMC name
    const amcMap = new Map<string, typeof rows>();
    for (const row of rows) {
      const name = row.amc_name?.trim();
      if (!name) continue;
      if (!amcMap.has(name)) amcMap.set(name, []);
      amcMap.get(name)!.push(row);
    }

    const results: { contacts_created: number; branches_created: number; errors: string[] } = {
      contacts_created: 0,
      branches_created: 0,
      errors: [],
    };

    // 2. For each unique AMC, upsert contact and insert branches
    for (const [amcName, branches] of amcMap) {
      // Check if contact already exists
      const { data: existing } = await supabase
        .from("crm_contacts")
        .select("id")
        .eq("full_name", amcName)
        .eq("relationship_type", "principal")
        .maybeSingle();

      let contactId: string;

      if (existing) {
        contactId = existing.id;
      } else {
        // Get primary phone from first branch
        const primaryPhone = branches[0]?.phone?.replace(/[^0-9+\-\s\/]/g, "").trim() || "";
        
        const { data: newContact, error: contactErr } = await supabase
          .from("crm_contacts")
          .insert({
            full_name: amcName,
            relationship_type: "principal",
            contact_type: "company",
            company_name: amcName,
            phone: primaryPhone,
            source: "import",
            relationship_meta: {
              category: "AMC",
              products: ["Mutual Funds", "SIF"],
              arn_number: "ARN 35275",
              total_branches: branches.length,
            },
          })
          .select("id")
          .single();

        if (contactErr) {
          results.errors.push(`Contact "${amcName}": ${contactErr.message}`);
          continue;
        }
        contactId = newContact.id;
        results.contacts_created++;
      }

      // 3. Insert branches (batch)
      const branchRows = branches.map((b: any) => ({
        contact_id: contactId,
        branch_city: b.city?.trim() || "Unknown",
        address_line1: b.address1?.trim() || null,
        address_line2: b.address2?.trim() || null,
        address_line3: b.address3?.trim() || null,
        pincode: b.pincode?.toString().replace(/\s/g, "").trim() || null,
        phone: b.phone?.trim() || null,
        is_head_office: false,
      }));

      // Insert in chunks of 100
      for (let i = 0; i < branchRows.length; i += 100) {
        const chunk = branchRows.slice(i, i + 100);
        const { error: branchErr, data: inserted } = await supabase
          .from("contact_branches")
          .insert(chunk)
          .select("id");

        if (branchErr) {
          results.errors.push(`Branches for "${amcName}" chunk ${i}: ${branchErr.message}`);
        } else {
          results.branches_created += inserted?.length || 0;
        }
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
