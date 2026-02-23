import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { logAudit } from '@/lib/auditLog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, BookOpen } from 'lucide-react';

export default function AdminInvestorCharter() {
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('legal_pages' as any)
        .select('body')
        .eq('slug', 'investor-charter')
        .single();
      setBody((data as any)?.body || '');
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('legal_pages' as any)
        .update({ body, updated_at: new Date().toISOString() } as any)
        .eq('slug', 'investor-charter');
      if (error) throw error;
      await logAudit({ action: 'update', entity_type: 'legal_page', entity_id: 'investor-charter', details: { slug: 'investor-charter' } });
      toast.success('Investor Charter saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminGuard>
      <AdminLayout title="Investor Charter" subtitle="Manage the Investor Charter content (SEBI compliance page)">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">This page is shown under Support in the footer as a SEBI compliance requirement.</span>
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Investor Charter — Content (HTML)
              </span>
              <span className="text-xs text-muted-foreground">
                Supports HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;table&gt;, &lt;a&gt;, etc.
              </span>
            </div>
            {loading ? (
              <div className="h-[400px] bg-muted rounded animate-pulse" />
            ) : (
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
                placeholder="Enter HTML content for the Investor Charter page..."
              />
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
