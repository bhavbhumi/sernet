import { supabase } from '@/integrations/supabase/client';

export type AuditAction = 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'feature' | 'unfeature' | 'import' | 'login' | 'logout' | 'signup' | 'settings_change' | 'status_change';

interface AuditLogEntry {
  action: AuditAction;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  source?: string;
}

export async function logAudit({ action, entity_type, entity_id, details = {}, source = 'admin' }: AuditLogEntry) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await (supabase.from('audit_logs') as any).insert({
      action,
      entity_type,
      entity_id: entity_id ?? null,
      details,
      user_id: session.user.id,
      user_email: session.user.email ?? null,
      source,
      user_agent: navigator.userAgent,
    });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}
