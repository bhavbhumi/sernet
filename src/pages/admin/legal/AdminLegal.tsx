import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { logAudit } from '@/lib/auditLog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Scale, Shield, FileText, AlertTriangle, Save } from 'lucide-react';

const slugConfig = [
  { slug: 'terms', label: 'Terms & Conditions', icon: Scale },
  { slug: 'privacy', label: 'Privacy Policy', icon: Shield },
  { slug: 'policies', label: 'Policies & Procedures', icon: FileText },
  { slug: 'disclosures', label: 'Disclosures', icon: AlertTriangle },
];

export default function AdminLegal() {
  const [activeSlug, setActiveSlug] = useState('terms');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('legal_pages' as any)
        .select('body')
        .eq('slug', activeSlug)
        .single();
      setBody((data as any)?.body || '');
      setLoading(false);
    })();
  }, [activeSlug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('legal_pages' as any)
        .update({ body, updated_at: new Date().toISOString() } as any)
        .eq('slug', activeSlug);
      if (error) throw error;
      await logAudit({ action: 'update', entity_type: 'legal_page', entity_id: activeSlug, details: { slug: activeSlug } });
      toast.success('Legal page saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminGuard>
      <AdminLayout title="Legal Pages" subtitle="Manage terms, privacy, policies, and disclosures">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-end">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>

          {/* Tab pills */}
          <div className="flex gap-2 flex-wrap">
            {slugConfig.map((cfg) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={cfg.slug}
                  onClick={() => setActiveSlug(cfg.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSlug === cfg.slug
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Editor */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {slugConfig.find(c => c.slug === activeSlug)?.label} — Content (HTML)
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
                placeholder="Enter HTML content for this legal page..."
              />
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
