import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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

    // Verify caller is super_admin or admin
    const authHeader = req.headers.get('authorization');
    if (!authHeader) throw new Error('Unauthorized');

    const token = authHeader.replace('Bearer ', '');
    const isServiceRole = token === Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    let callerId: string | null = null;
    let callerRole: string | null = null;

    if (!isServiceRole) {
      const { data: { user: caller }, error: authError } = await supabaseAdmin.auth.getUser(token);
      if (authError || !caller) throw new Error('Unauthorized');
      callerId = caller.id;

      const { data: callerRoleData } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', caller.id)
        .maybeSingle();

      if (!callerRoleData || !['super_admin', 'admin'].includes(callerRoleData.role)) {
        return new Response(JSON.stringify({ error: 'Only super admins and admins can manage users.' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      callerRole = callerRoleData.role;
    }

    const { action, ...params } = await req.json();

    // ─── List employees (for employee picker) ───
    if (action === 'list_employees') {
      const { data: employees, error } = await supabaseAdmin
        .from('employees')
        .select('id, full_name, email, phone, department, designation, user_id, status')
        .eq('status', 'active')
        .order('full_name');
      if (error) throw error;

      return new Response(JSON.stringify({ employees: employees || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── List pending portal users (partners needing approval) ───
    if (action === 'list_portal_users') {
      const { status_filter } = params;
      const query = supabaseAdmin
        .from('profiles')
        .select('id, user_id, full_name, email, phone, user_type, status, created_at, crm_contact_id');
      
      if (status_filter) {
        query.eq('status', status_filter);
      }
      
      const { data: profiles, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      return new Response(JSON.stringify({ profiles: profiles || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Approve portal user ───
    if (action === 'approve_portal_user') {
      const { profile_id } = params;
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', profile_id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Reject portal user ───
    if (action === 'reject_portal_user') {
      const { profile_id, user_id } = params;
      // Update status to rejected
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', profile_id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Auto-provision portal account for a CRM contact (deal won) ───
    if (action === 'provision_client_portal') {
      const { contact_id } = params;

      // Get the CRM contact
      const { data: contact, error: contactErr } = await supabaseAdmin
        .from('crm_contacts')
        .select('*')
        .eq('id', contact_id)
        .single();
      if (contactErr || !contact) throw new Error('Contact not found');

      if (!contact.email) throw new Error('Contact has no email — cannot provision portal account');

      // Check if already has a portal account
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('crm_contact_id', contact_id)
        .maybeSingle();
      
      if (existingProfile) {
        return new Response(JSON.stringify({ success: true, already_exists: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Generate a temporary password
      const tempPassword = crypto.randomUUID().slice(0, 12) + 'A1!';

      // Create auth user
      const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: contact.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { 
          name: contact.full_name, 
          user_type: 'client',
          phone: contact.phone || '',
        },
      });
      if (createError) throw createError;

      // Link profile to CRM contact
      await supabaseAdmin
        .from('profiles')
        .update({ crm_contact_id: contact_id, pan: contact.pan })
        .eq('user_id', authData.user.id);

      return new Response(JSON.stringify({ 
        success: true, 
        user_id: authData.user.id,
        temp_password: tempPassword,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Existing actions ───

    if (action === 'update_user') {
      const { user_id, password, user_metadata } = params;
      const updatePayload: Record<string, unknown> = {};
      if (password) updatePayload.password = password;
      if (user_metadata) updatePayload.user_metadata = user_metadata;

      const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, updatePayload);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_user') {
      const { email, password, name, role, department, employee_id } = params;

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

      // If linked to an employee, update the employee's user_id
      if (employee_id) {
        await supabaseAdmin
          .from('employees')
          .update({ user_id: authData.user.id })
          .eq('id', employee_id);
      }

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

    if (action === 'create_portal_user') {
      const { email, password, name, user_type, phone } = params;

      const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, user_type, phone: phone || '' },
      });
      if (createError) throw createError;

      return new Response(JSON.stringify({ success: true, user_id: authData.user.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete_user') {
      const { user_id } = params;
      if (user_id === callerId) throw new Error('Cannot delete yourself');
      
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
