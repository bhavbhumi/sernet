
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Upload, Save, Globe, Palette, Type, Image as ImageIcon, RefreshCw } from 'lucide-react';
import sernetLogo from '@/assets/sernet-logo.png';

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat',
  'Raleway', 'Playfair Display', 'Merriweather', 'Nunito', 'Source Sans 3',
];

const FONT_SIZES = ['14px', '15px', '16px', '17px', '18px'];

interface SiteSettingRow {
  key: string;
  value: Record<string, string>;
}

function useSettings(key: string) {
  return useQuery({
    queryKey: ['site_settings', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings' as any)
        .select('value')
        .eq('key', key)
        .single();
      if (error) throw error;
      return (data as any).value as Record<string, string>;
    },
  });
}

// ─── Identity Tab ────────────────────────────────────────────────────────────
function IdentityTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useSettings('identity');
  const [form, setForm] = useState({ logo_url: '', favicon_url: '', og_image_url: '', logo_dark_url: '' });
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (data) setForm({ logo_url: data.logo_url ?? '', favicon_url: data.favicon_url ?? '', og_image_url: data.og_image_url ?? '', logo_dark_url: data.logo_dark_url ?? '' });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('site_settings' as any).update({ value: form }).eq('key', 'identity');
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['site_settings', 'identity'] }); toast.success('Identity settings saved'); },
    onError: () => toast.error('Failed to save'),
  });

  const uploadFile = async (field: string, file: File) => {
    setUploading(field);
    const ext = file.name.split('.').pop();
    const path = `site/${field}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('cms-media').upload(path, file, { upsert: true });
    if (upErr) { toast.error('Upload failed'); setUploading(null); return; }
    const { data: urlData } = supabase.storage.from('cms-media').getPublicUrl(path);
    setForm(prev => ({ ...prev, [field]: urlData.publicUrl }));
    setUploading(null);
    toast.success('File uploaded');
  };

  if (isLoading) return <p className="text-sm text-muted-foreground py-6">Loading…</p>;

  const fields: { key: keyof typeof form; label: string; hint: string }[] = [
    { key: 'logo_url', label: 'Logo (Light Mode)', hint: 'Recommended: SVG or PNG, transparent background' },
    { key: 'logo_dark_url', label: 'Logo (Dark Mode)', hint: 'White / inverted version for dark backgrounds' },
    { key: 'favicon_url', label: 'Favicon', hint: 'ICO or PNG, 32×32 px minimum' },
    { key: 'og_image_url', label: 'OG / Social Share Image', hint: 'Recommended: 1200×630 px PNG or JPG' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(f => (
          <Card key={f.key} className="p-4 space-y-3">
            <div>
              <Label className="font-medium">{f.label}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">{f.hint}</p>
            </div>
            {/* Preview */}
            {form[f.key] ? (
              <div className={`rounded-lg border border-border flex items-center justify-center p-3 ${f.key === 'logo_dark_url' ? 'bg-zinc-900' : 'bg-muted/30'}`} style={{ minHeight: 72 }}>
                <img src={form[f.key]} alt={f.label} className="max-h-14 max-w-full object-contain" />
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border flex items-center justify-center text-muted-foreground bg-muted/20" style={{ minHeight: 72 }}>
                <ImageIcon className="h-8 w-8 opacity-30" />
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={form[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder="Paste URL or upload…"
                className="h-8 text-xs"
              />
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" className="h-8 px-2 gap-1 text-xs pointer-events-none" asChild>
                  <span><Upload className="h-3 w-3" />{uploading === f.key ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Upload'}</span>
                </Button>
                <input type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadFile(f.key, e.target.files[0]); }} />
              </label>
            </div>
          </Card>
        ))}
      </div>
      {/* Current logo fallback info */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground">
        <img src={sernetLogo} alt="Current Logo" className="h-6 object-contain" />
        <p>Currently using the built-in logo asset. Upload a new file above to override it.</p>
      </div>
      <Button onClick={() => save.mutate()} disabled={save.isPending} className="gap-2">
        <Save className="h-4 w-4" /> Save Identity Settings
      </Button>
    </div>
  );
}

// ─── Branding Tab ────────────────────────────────────────────────────────────
function BrandingTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useSettings('branding');
  const [form, setForm] = useState({ site_name: '', tagline: '', primary_color: '#1a56db', secondary_color: '#7e3af2', accent_color: '#0694a2' });

  useEffect(() => {
    if (data) setForm({ site_name: data.site_name ?? '', tagline: data.tagline ?? '', primary_color: data.primary_color ?? '#1a56db', secondary_color: data.secondary_color ?? '#7e3af2', accent_color: data.accent_color ?? '#0694a2' });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('site_settings' as any).update({ value: form }).eq('key', 'branding');
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['site_settings', 'branding'] }); toast.success('Branding saved'); },
    onError: () => toast.error('Failed to save'),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground py-6">Loading…</p>;

  return (
    <div className="space-y-6 max-w-lg">
      <div className="space-y-1.5">
        <Label>Site Name</Label>
        <Input value={form.site_name} onChange={e => setForm(p => ({ ...p, site_name: e.target.value }))} placeholder="SERNET" />
      </div>
      <div className="space-y-1.5">
        <Label>Tagline</Label>
        <Input value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} placeholder="Your Trusted Financial Partner" />
      </div>
      <Separator />
      <p className="text-sm font-medium text-foreground">Brand Colours</p>
      <p className="text-xs text-muted-foreground -mt-4">These are reference values for your brand guide. To change the live site theme, update the CSS variables in index.css.</p>
      {[
        { key: 'primary_color', label: 'Primary Colour' },
        { key: 'secondary_color', label: 'Secondary Colour' },
        { key: 'accent_color', label: 'Accent Colour' },
      ].map(f => (
        <div key={f.key} className="flex items-center gap-3">
          <input
            type="color"
            value={form[f.key as keyof typeof form]}
            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            className="h-10 w-10 rounded-md border border-border cursor-pointer bg-transparent p-0.5"
          />
          <div className="flex-1">
            <Label className="text-xs">{f.label}</Label>
            <Input
              value={form[f.key as keyof typeof form]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="h-8 mt-1 font-mono text-xs"
            />
          </div>
          <div className="h-10 w-10 rounded-md border border-border" style={{ backgroundColor: form[f.key as keyof typeof form] }} />
        </div>
      ))}
      <Button onClick={() => save.mutate()} disabled={save.isPending} className="gap-2">
        <Save className="h-4 w-4" /> Save Branding
      </Button>
    </div>
  );
}

// ─── Typography Tab ───────────────────────────────────────────────────────────
function TypographyTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useSettings('typography');
  const [form, setForm] = useState({ heading_font: 'Inter', body_font: 'Inter', base_font_size: '16px' });

  useEffect(() => {
    if (data) setForm({ heading_font: data.heading_font ?? 'Inter', body_font: data.body_font ?? 'Inter', base_font_size: data.base_font_size ?? '16px' });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('site_settings' as any).update({ value: form }).eq('key', 'typography');
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['site_settings', 'typography'] }); toast.success('Typography saved'); },
    onError: () => toast.error('Failed to save'),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground py-6">Loading…</p>;

  return (
    <div className="space-y-6 max-w-lg">
      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-200 text-xs text-yellow-700 dark:text-yellow-400">
        Typography selections are saved as brand reference values. To apply fonts live, update the CSS imports and Tailwind config accordingly.
      </div>
      {[
        { key: 'heading_font', label: 'Heading Font', preview: 'The quick brown fox' },
        { key: 'body_font', label: 'Body / Paragraph Font', preview: 'Invest wisely with SERNET' },
      ].map(f => (
        <div key={f.key} className="space-y-2">
          <Label>{f.label}</Label>
          <select
            value={form[f.key as keyof typeof form]}
            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {GOOGLE_FONTS.map(font => <option key={font} value={font}>{font}</option>)}
          </select>
          <div className="rounded-lg border border-border p-3 bg-muted/20">
            <p className="text-xs text-muted-foreground mb-1">Preview</p>
            <p style={{ fontFamily: `${form[f.key as keyof typeof form]}, sans-serif` }} className="text-base">{f.preview}</p>
          </div>
        </div>
      ))}
      <div className="space-y-2">
        <Label>Base Font Size</Label>
        <select
          value={form.base_font_size}
          onChange={e => setForm(p => ({ ...p, base_font_size: e.target.value }))}
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <Button onClick={() => save.mutate()} disabled={save.isPending} className="gap-2">
        <Save className="h-4 w-4" /> Save Typography
      </Button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminSiteSettings() {
  return (
    <AdminLayout
      title="Site Settings"
      subtitle="Manage brand identity, colours, logo, favicon and typography"
    >
      <Tabs defaultValue="identity">
        <TabsList className="bg-muted/40 p-1 mb-6">
          <TabsTrigger value="identity" className="gap-1.5 text-xs"><Globe className="h-3.5 w-3.5" /> Identity</TabsTrigger>
          <TabsTrigger value="branding" className="gap-1.5 text-xs"><Palette className="h-3.5 w-3.5" /> Branding</TabsTrigger>
          <TabsTrigger value="typography" className="gap-1.5 text-xs"><Type className="h-3.5 w-3.5" /> Typography</TabsTrigger>
        </TabsList>
        <TabsContent value="identity"><IdentityTab /></TabsContent>
        <TabsContent value="branding"><BrandingTab /></TabsContent>
        <TabsContent value="typography"><TypographyTab /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
