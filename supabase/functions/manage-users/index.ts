import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Verify caller is super_admin (or service_role for initial setup)
    const authHeader = req.headers.get('authorization');
    if (!authHeader) throw new Error('Unauthorized');

    const token = authHeader.replace('Bearer ', '');
    const isServiceRole = token === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    let callerId: string | null = null;

    if (!isServiceRole) {
      const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !caller) throw new Error('Unauthorized');
      callerId = caller.id;

      const { data: callerRole } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', caller.id)
        .maybeSingle();

      if (!callerRole || callerRole.role !== 'super_admin') {
        return new Response(JSON.stringify({ error: 'Only super admins can manage users.' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const { action, ...params } = await req.json();

    if (action === 'update_user') {
      const { user_id, password, user_metadata } = params;
      const updatePayload: Record<string, unknown> = {};
      if (password) updatePayload.password = password;
      if (user_metadata) updatePayload.user_metadata = user_metadata;

      const { error } = await supabaseAdmin.auth.admin.updateUser(user_id, updatePayload);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_user') {
      const { email, password, name, role, department } = params;

      const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });
      if (createError) throw createError;

      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: authData.user.id, role, department: department || null });
      if (roleError) throw roleError;

      return new Response(JSON.stringify({ success: true, user_id: authData.user.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'list_users') {
      const { data: roles } = await supabaseAdmin
        .from('user_roles')
        .select('*');

      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;

      const enriched = (users || []).map(u => {
        const roleEntry = (roles || []).find(r => r.user_id === u.id);
        return {
          id: u.id,
          email: u.email,
          name: u.user_metadata?.name || '',
          role: roleEntry?.role || null,
          department: roleEntry?.department || null,
          role_id: roleEntry?.id || null,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
        };
      });

      return new Response(JSON.stringify({ users: enriched }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update_role') {
      const { user_id, role, department } = params;
      const { error } = await supabaseAdmin
        .from('user_roles')
        .update({ role, department: department || null })
        .eq('user_id', user_id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete_user') {
      const { user_id } = params;
      if (user_id === caller.id) throw new Error('Cannot delete yourself');
      
      await supabaseAdmin.from('user_roles').delete().eq('user_id', user_id);
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
