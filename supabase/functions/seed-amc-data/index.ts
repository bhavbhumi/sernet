import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Determine office type from city/address heuristics
function classifyOfficeType(city: string, address1: string, amcName: string): string {
  const c = city?.toLowerCase().trim() || "";
  const a = (address1 || "").toLowerCase();
  
  // IFSC / GIFT City
  if (c.includes("gift") || a.includes("gift sez") || a.includes("gift city")) return "IFSC";
  
  // International
  if (c.includes("singapore") || c.includes("dubai") || c.includes("london") || c.includes("mauritius")) return "INTL";
  
  // Head Office: Mumbai is typically HO for most AMCs
  const hoCity = c.includes("mumbai") || c.includes("lower parel") || c.includes("bkc") || c.includes("nariman");
  if (hoCity && (a.includes("head") || a.includes("corporate") || a.includes("registered"))) return "HO";
  
  // Zonal offices - major metros
  const zonalCities = ["mumbai", "delhi", "new delhi", "chennai", "kolkata", "bangalore", "bengaluru", "hyderabad"];
  if (zonalCities.some(z => c.includes(z))) return "ZO";
  
  // Regional offices - state capitals and large cities
  const regionalCities = [
    "ahmedabad", "pune", "lucknow", "jaipur", "chandigarh", "bhopal", "patna",
    "guwahati", "bhubaneshwar", "bhubaneswar", "thiruvananthapuram", "trivandrum",
    "kochi", "ernakulam", "coimbatore", "indore", "nagpur", "surat", "vadodara",
    "rajkot", "gurgaon", "gurugram", "noida", "ludhiana", "amritsar", "ranchi",
    "raipur", "visakhapatnam", "vizag", "vijayawada", "madurai", "mangalore",
    "mysore", "hubli", "nashik", "thane", "panaji", "goa",
  ];
  if (regionalCities.some(r => c.includes(r))) return "RO";
  
  // Default: Branch Office
  return "BO";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { rows, clear_existing } = await req.json();

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return new Response(JSON.stringify({ error: "No rows provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optionally clear existing principal data
    if (clear_existing) {
      // Get all principal contact IDs
      const { data: principals } = await supabase
        .from("crm_contacts")
        .select("id")
        .eq("relationship_type", "principal")
        .eq("source", "import");

      if (principals && principals.length > 0) {
        const ids = principals.map((p: any) => p.id);
        // Delete branches first (cascade should handle, but be explicit)
        await supabase.from("contact_branches").delete().in("contact_id", ids);
        await supabase.from("contact_kmp").delete().in("contact_id", ids);
        await supabase.from("crm_contacts").delete().in("id", ids);
      }
    }

    // Group by AMC name
    const amcMap = new Map<string, typeof rows>();
    for (const row of rows) {
      const name = row.amc_name?.trim();
      if (!name) continue;
      if (!amcMap.has(name)) amcMap.set(name, []);
      amcMap.get(name)!.push(row);
    }

    const results = {
      contacts_created: 0,
      branches_created: 0,
      amcs_processed: 0,
      errors: [] as string[],
    };

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
        // Update meta
        await supabase.from("crm_contacts").update({
          relationship_meta: {
            category: "AMC",
            products: ["Mutual Funds", "SIF"],
            arn_number: "ARN 35275",
            total_branches: branches.length,
          },
        }).eq("id", contactId);
      } else {
        const primaryPhone = branches[0]?.phone?.replace(/[^0-9+\-\s\/()]/g, "").trim() || "";
        
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

      // Delete existing branches for this contact (to handle re-import)
      await supabase.from("contact_branches").delete().eq("contact_id", contactId);

      // Determine which is HO - first Mumbai entry or first entry
      let hoSet = false;
      const branchRows = branches.map((b: any) => {
        const city = b.city?.trim() || "Unknown";
        const officeType = classifyOfficeType(city, b.address1, amcName);
        const isHO = !hoSet && officeType === "ZO" && (city.toLowerCase().includes("mumbai"));
        if (isHO) hoSet = true;
        
        return {
          contact_id: contactId,
          branch_city: city,
          address_line1: b.address1?.trim() || null,
          address_line2: b.address2?.trim() || null,
          address_line3: b.address3?.trim() || null,
          pincode: b.pincode?.toString().replace(/\s/g, "").trim() || null,
          phone: b.phone?.trim() || null,
          is_head_office: isHO,
          office_type: isHO ? "HO" : officeType,
          address_type: "domestic",
          ownership: "own",
        };
      });

      // Mark first entry as HO if none was set
      if (!hoSet && branchRows.length > 0) {
        branchRows[0].is_head_office = true;
        branchRows[0].office_type = "HO";
      }

      // Insert in chunks
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

      results.amcs_processed++;
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
