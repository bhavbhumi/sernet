import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json().catch(() => ({}));
    const { action = 'find', table = 'articles' } = body;

    // Find duplicates by title (case-insensitive)
    const validTables = ['articles', 'analyses'];
    if (!validTables.includes(table)) {
      return new Response(JSON.stringify({ error: 'Invalid table' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: allItems, error } = await supabase
      .from(table)
      .select('id, title, created_at, item_date, media_url')
      .order('title', { ascending: true });

    if (error) throw error;

    // Group by normalized title
    const groups: Record<string, typeof allItems> = {};
    for (const item of allItems || []) {
      const key = item.title.toLowerCase().trim().replace(/\s+/g, ' ');
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    // Find duplicates
    const duplicates = Object.entries(groups)
      .filter(([, items]) => items.length > 1)
      .map(([title, items]) => ({ title, count: items.length, items }));

    if (action === 'find') {
      return new Response(JSON.stringify({
        success: true,
        table,
        totalItems: (allItems || []).length,
        duplicateGroups: duplicates.length,
        duplicateTotalItems: duplicates.reduce((sum, d) => sum + d.count, 0),
        duplicates: duplicates.map(d => ({
          title: d.title,
          count: d.count,
          items: d.items.map(i => ({
            id: i.id,
            created_at: i.created_at,
            item_date: i.item_date,
            media_url: i.media_url,
          })),
        })),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'remove_recent_dupes') {
      // For each duplicate group, keep the OLDEST created_at and delete ones created today/yesterday
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const cutoff = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD

      const toDelete: string[] = [];
      for (const group of duplicates) {
        // Sort by created_at ascending (oldest first)
        const sorted = [...group.items].sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        // Keep the oldest, mark recent ones for deletion
        for (let i = 1; i < sorted.length; i++) {
          const createdDate = sorted[i].created_at.split('T')[0];
          if (createdDate >= cutoff) {
            toDelete.push(sorted[i].id);
          }
        }
      }

      if (toDelete.length === 0) {
        return new Response(JSON.stringify({
          success: true,
          message: 'No recent duplicates to remove',
          duplicateGroups: duplicates.length,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Delete in batches
      const BATCH = 50;
      let deleted = 0;
      for (let i = 0; i < toDelete.length; i += BATCH) {
        const batch = toDelete.slice(i, i + BATCH);
        const { error: delError } = await supabase
          .from(table)
          .delete()
          .in('id', batch);
        if (delError) {
          console.error('Delete error:', delError);
        } else {
          deleted += batch.length;
        }
      }

      return new Response(JSON.stringify({
        success: true,
        table,
        duplicateGroupsFound: duplicates.length,
        deletedCount: deleted,
        deletedIds: toDelete,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
