/**
 * sync-economic-actuals
 * ---------------------
 * Fetches released actual values for economic events from the
 * Trading Economics free-tier JSON API and updates the database.
 *
 * Runs nightly via pg_cron at 00:30 UTC (06:00 IST).
 * Can also be triggered manually via POST /sync-economic-actuals
 *
 * Free TE API endpoint (no key required, limited countries):
 * https://api.tradingeconomics.com/calendar/country/{country}?c=guest:guest
 * (Rate limited to ~50 req/day on guest credentials)
 *
 * NOTE: If you have a Trading Economics API key, add it as the TE_API_KEY
 * secret and the function will automatically use it for higher limits.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Country codes used by Trading Economics API
const TE_COUNTRIES: Record<string, string> = {
  India: 'india',
  USA: 'united-states',
  Europe: 'euro-area',
  UK: 'united-kingdom',
  China: 'china',
  Japan: 'japan',
};

interface TEEvent {
  Date: string;
  Country: string;
  Category: string;
  Event: string;
  Actual: string | null;
  Previous: string | null;
  Forecast: string | null;
  TEForecast: string | null;
  Importance: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const teKey = Deno.env.get('TE_API_KEY') || 'guest:guest';
  const log: string[] = [];
  let totalUpdated = 0;
  let totalFetched = 0;

  const addLog = (msg: string) => {
    console.log(msg);
    log.push(msg);
  };

  try {
    addLog(`🚀 Starting Economic Actuals Sync — ${new Date().toISOString()}`);

    // Fetch events from TE for each country
    for (const [displayName, teSlug] of Object.entries(TE_COUNTRIES)) {
      try {
        addLog(`📡 Fetching ${displayName} from Trading Economics...`);

        // Fetch next 3 months of events
        const today = new Date();
        const future = new Date();
        future.setMonth(future.getMonth() + 3);
        const dateFrom = today.toISOString().slice(0, 10);
        const dateTo = future.toISOString().slice(0, 10);

        const url = `https://api.tradingeconomics.com/calendar/country/${teSlug}/${dateFrom}/${dateTo}?c=${teKey}`;
        const resp = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0',
          },
        });

        if (!resp.ok) {
          addLog(`⚠️ ${displayName}: HTTP ${resp.status} — skipping`);
          continue;
        }

        const events: TEEvent[] = await resp.json();
        totalFetched += events.length;
        addLog(`  → ${events.length} events fetched for ${displayName}`);

        // Update actuals for events that now have a released value
        for (const ev of events) {
          if (!ev.Actual) continue; // Only update when actual is available

          // Normalise date
          const eventDate = ev.Date?.slice(0, 10);
          if (!eventDate) continue;

          // Try to match by event_date + event_name + country (fuzzy)
          const { data: matches } = await supabase
            .from('economic_events')
            .select('id, actual_value, event_name')
            .eq('event_date', eventDate)
            .eq('country', displayName)
            .ilike('event_name', `%${ev.Event.split(' ').slice(0, 3).join('%')}%`)
            .limit(1);

          if (matches && matches.length > 0) {
            const match = matches[0];
            // Only update if actual is empty or changed
            if (match.actual_value !== ev.Actual) {
              const { error } = await supabase
                .from('economic_events')
                .update({
                  actual_value: ev.Actual,
                  // Also update forecast/previous if we have better data
                  ...(ev.Forecast ? { forecast_value: ev.Forecast } : {}),
                  ...(ev.Previous ? { previous_value: ev.Previous } : {}),
                })
                .eq('id', match.id);

              if (!error) {
                totalUpdated++;
                addLog(`  ✅ Updated actual for "${match.event_name}": ${ev.Actual}`);
              }
            }
          }
        }

        // Rate-limit courtesy delay between countries
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        addLog(`❌ Error fetching ${displayName}: ${String(err)}`);
      }
    }

    addLog(`\n🎉 Sync complete. Fetched: ${totalFetched}, Updated: ${totalUpdated}`);

    return new Response(
      JSON.stringify({
        success: true,
        fetched: totalFetched,
        updated: totalUpdated,
        log,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    addLog(`💥 Fatal error: ${String(err)}`);
    return new Response(
      JSON.stringify({ success: false, error: String(err), log }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
